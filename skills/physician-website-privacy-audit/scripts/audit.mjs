#!/usr/bin/env node
import fs from "node:fs";
import { chromium } from "playwright";

const WAIT_MS = 1500;

function usage() {
  console.error("Usage: node scripts/audit.mjs --url https://clinic.example --pages /,/services,/contact [--reject 'Reject all'] [--accept 'Accept all'] [--out audit.json]");
  process.exit(2);
}

function options(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith("--") || !value || value.startsWith("--")) usage();
    result[key.slice(2)] = value;
  }
  if (!result.url) usage();
  let site;
  try { site = new URL(result.url); } catch { throw new Error("Invalid public website URL."); }
  if (!["http:", "https:"].includes(site.protocol) || site.username || site.password || site.search || site.hash) {
    throw new Error("Use a public http(s) URL without credentials, query string, or fragment.");
  }
  const paths = (result.pages || "/").split(",").map((path) => path.trim());
  if (paths.some((path) => !path.startsWith("/") || path.startsWith("//") || path.includes("?") || path.includes("#"))) {
    throw new Error("Pages must be same-site paths without query strings or fragments.");
  }
  return { site, paths, reject: result.reject, accept: result.accept, out: result.out || "audit.json" };
}

function summarizeRequests(events) {
  const counts = new Map();
  for (const event of events) {
    const key = `${event.host}\u0000${event.type}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts].map(([key, count]) => {
    const [host, type] = key.split("\u0000");
    return { host, type, count };
  }).sort((a, b) => a.host.localeCompare(b.host) || a.type.localeCompare(b.type));
}

async function snapshot(page, context, events, setCookies) {
  const cookies = await context.cookies();
  const storage = await page.evaluate(() => ({
    localStorage: Object.keys(localStorage),
    sessionStorage: Object.keys(sessionStorage),
  })).catch(() => ({ localStorage: [], sessionStorage: [], error: "Storage unavailable" }));
  return {
    requestHosts: summarizeRequests(events),
    setCookieNames: [...new Map(setCookies.map((x) => [`${x.host}\u0000${x.name}`, x])).values()].sort((a, b) => a.host.localeCompare(b.host) || a.name.localeCompare(b.name)),
    cookieNames: [...new Set(cookies.map((cookie) => `${cookie.domain}\u0000${cookie.name}`))].map((x) => {
      const [domain, name] = x.split("\u0000");
      return { domain, name };
    }).sort((a, b) => a.domain.localeCompare(b.domain) || a.name.localeCompare(b.name)),
    storageKeys: storage,
  };
}

async function visibleConsentButtons(page) {
  return page.getByRole("button").evaluateAll((buttons) => buttons
    .filter((button) => button.getClientRects().length && /accept|allow|agree|reject|decline|deny|settings|preferences|cookie/i.test(button.innerText || button.getAttribute("aria-label") || ""))
    .map((button) => (button.innerText || button.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 100))
    .filter(Boolean).slice(0, 20));
}

async function inspect(browser, target, choice) {
  const context = await browser.newContext();
  const page = await context.newPage();
  let phase = "beforeChoice";
  const events = { beforeChoice: [], afterChoice: [], afterReload: [] };
  const setCookies = { beforeChoice: [], afterChoice: [], afterReload: [] };
  page.on("request", (request) => {
    try {
      events[phase].push({ host: new URL(request.url()).hostname, type: request.resourceType() });
    } catch { /* Browser-internal URL. */ }
  });
  page.on("response", async (response) => {
    try {
      const host = new URL(response.url()).hostname;
      for (const header of await response.headersArray()) {
        if (header.name.toLowerCase() !== "set-cookie") continue;
        const name = header.value.split("=", 1)[0].trim();
        if (name) setCookies[phase].push({ host, name });
      }
    } catch { /* Ignore malformed/browser-internal responses. */ }
  });
  const output = { page: `${target.origin}${target.pathname}`, choice: choice?.kind || "none" };
  try {
    const response = await page.goto(target.href, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(WAIT_MS);
    output.status = response?.status() ?? null;
    output.finalHost = new URL(page.url()).hostname;
    output.visibleConsentButtons = await visibleConsentButtons(page);
    output.beforeChoice = await snapshot(page, context, events.beforeChoice, setCookies.beforeChoice);
    if (new URL(page.url()).origin !== target.origin) {
      output.choiceResult = "Redirected to a different origin; no consent click made";
      return output;
    }
    if (choice) {
      const button = page.getByRole("button", { name: choice.text, exact: true });
      const count = await button.count();
      if (count !== 1 || !(await button.isVisible())) {
        output.choiceResult = "Button absent or ambiguous; no click made";
      } else {
        phase = "afterChoice";
        await button.click({ timeout: 5000 });
        await page.waitForTimeout(WAIT_MS);
        output.choiceResult = "clicked";
        output.afterChoice = await snapshot(page, context, events.afterChoice, setCookies.afterChoice);
        phase = "afterReload";
        await page.reload({ waitUntil: "domcontentloaded", timeout: 20000 });
        await page.waitForTimeout(WAIT_MS);
        output.afterReload = await snapshot(page, context, events.afterReload, setCookies.afterReload);
      }
    }
  } catch (error) {
    output.error = error?.name || "Navigation or interaction error";
    output.errorNote = "This branch is incomplete; inspect the site manually.";
  } finally {
    await context.close();
  }
  return output;
}

async function main() {
  const config = options(process.argv.slice(2));
  const browser = await chromium.launch({ headless: true });
  const report = {
    schemaVersion: 1,
    testedAt: new Date().toISOString(),
    browser: "Playwright Chromium",
    scope: "Public pages; no form submission; no cookie values, request bodies, query strings, or identifying headers retained",
    limits: ["Fresh browser contexts may differ from returning visitors; retest later visits when material.", "External host and cookie names require purpose and data-flow review; this report makes no legal determination."],
    results: [],
  };
  try {
    for (const path of config.paths) {
      const target = new URL(path, config.site);
      if (target.origin !== config.site.origin) throw new Error("Cross-origin page path refused.");
      report.results.push(await inspect(browser, target));
      if (config.reject) report.results.push(await inspect(browser, target, { kind: "reject", text: config.reject }));
      if (config.accept) report.results.push(await inspect(browser, target, { kind: "accept", text: config.accept }));
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(config.out, `${JSON.stringify(report, null, 2)}\n`, { flag: "w" });
  console.log(`Saved sanitized report to ${config.out} (${report.results.length} browser runs).`);
}

main().catch((error) => {
  console.error(error?.message || "Audit failed");
  process.exitCode = 1;
});
