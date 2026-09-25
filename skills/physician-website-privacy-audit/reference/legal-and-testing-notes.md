# Legal and testing notes

Use this only to route a technical finding to the right human review. Check the current primary source and the practice's jurisdiction before describing a legal duty.

| Question | Source and careful interpretation |
|---|---|
| Does HIPAA apply to a public page? | [HHS OCR online tracking guidance](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html) distinguishes authenticated pages from unauthenticated public pages and notes a 2024 court order vacating part of its earlier guidance. A public page view plus IP address is not automatically PHI; information entered in appointment, registration, or portal flows may be. Inspect actual disclosure and context. |
| Does a cookie banner authorize PHI disclosure? | [HHS OCR](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html) says a cookie accept/reject banner is not a HIPAA authorization. If a tracker receives PHI, review permission, minimum-necessary obligations where applicable, vendor role, BAA, and potential breach assessment with counsel/privacy officer. |
| What about non-HIPAA health sites? | [FTC health information guidance](https://www.ftc.gov/business-guidance/resources/collecting-using-or-sharing-consumer-health-information-look-hipaa-ftc-act-health-breach) describes FTC Act risk from misleading or harmful health-data practices. The [FTC Health Breach Notification Rule](https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule) applies to specified non-HIPAA entities and circumstances, not every physician website. |
| Is consent always required before any cookie in the U.S.? | No universal conclusion follows from the observation alone. State laws vary in coverage and mechanism. For example, [California privacy rights](https://privacy.ca.gov/california-privacy-rights/rights-under-the-california-consumer-privacy-act/) include an opt-out of sale/sharing and limits for sensitive data for covered businesses. Ask counsel which laws apply; do not map a UK-style consent rule onto all U.S. visitors. |
| When is prior consent expected in the UK? | The [UK ICO's current storage and access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/) describes consent for nonexempt cookies, pixels, scripts, and similar technologies, with specified exceptions. Check the applicable purpose and exception; do not assume every analytics cookie has the same status. |

## Testing limits

- Browser traffic alone often cannot reveal the data in a server-side tag, a vendor's later processing, or the legal basis for a transfer. Review source code, tag-manager configuration, vendor contracts, and server logs with appropriate access.
- A request to an external hostname is a review lead, not automatically a tracker. A first-party hostname can still proxy tracking.
- Cookie names are clues, not reliable purpose labels. Record both storage and network calls; a pixel can transmit without setting a cookie.
- Test mobile layouts, geography, language, return visits, and consent persistence when these are material. State exactly which variants were not tested.
- Keep screenshots and raw HAR/network exports in an approved location. Raw URLs, headers, POST bodies, cookies, and screenshots may contain patient information or secrets.
- If litigation is threatened or filed, counsel controls preservation, deadlines, communications, and any remediation strategy. An audit report is not a response to a legal pleading.
