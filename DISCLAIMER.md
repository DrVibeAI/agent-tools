# Disclaimer

The tools in this repository are **educational and workflow infrastructure**. By using them you acknowledge the following.

- **Not medical advice.** Nothing here diagnoses, treats, triages, or prescribes, and nothing replaces the judgment of a licensed clinician. A qualified human must review any output before it is used in clinical, patient-facing, payer-facing, billing, coding, legal, or compliance contexts.
- **Not a medical device.** These tools are not intended to be, and have not been cleared or approved as, a medical device.
- **No warranty.** Provided "AS IS" under the Apache-2.0 license, without warranties or conditions of any kind. You are responsible for determining appropriateness and assume all risk.
- **Public, non-PHI data only.** The `clinical-apis-mcp` tools query public APIs with *search terms* — never patient identifiers. Do not place protected health information (PHI) in a query string, and do not send PHI to a third-party model or tool without appropriate agreements (e.g., a BAA) and safeguards in place. None of these public APIs are a BAA-covered destination.
- **`phi-guard` is risk reduction, not certified de-identification.** It *minimizes* direct identifiers (best-effort) so they need not reach a non-BAA model. It is **not** a HIPAA Safe-Harbor or Expert-Determination de-identification method: free text can hide identifiers, and quasi-identifiers may remain. The compliant path for real PHI is a BAA-covered deployment. A human must review redacted output.
- **Verify currency.** Public data sources, code sets (e.g., ICD-10-CM), and regulations change. Confirm against the authoritative source before relying on any result.

Use of these tools is at your own discretion and risk. Consult qualified professionals — physicians, attorneys, compliance officers, certified coders — before making medical, legal, or regulatory decisions.
