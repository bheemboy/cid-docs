# CID Security Doc — Style Brief

A one-pager pinned to every AI prompt and human edit pass for the Phase 2 prose draft. Read this before drafting or revising any page in `_outline-delta.md`.

---

## 1. Audience and purpose

- **Primary reader:** IT / Information Security reviewer at a pharma or biotech customer evaluating whether to approve the CID for deployment on their network. Technical, skeptical, time-constrained, reads to find disqualifiers.
- **Secondary reader:** Agilent field engineer or pre-sales SC using the doc to pre-answer IT objections during a customer engagement.
- **Reading level:** technically literate professional. Assume familiarity with TLS, X.509, OAuth, AWS service names, AD, MFA, SSO, SIEM. Do **not** explain these. Do explain anything **CID-specific** the reader cannot infer from the term alone (e.g. V-NIC pass-through, House/Instrument NIC split, Secure Tunneling on-demand model).
- **Decision the doc must enable:** "Yes, we can let this on our network" — or a precise objection IT can take back to Agilent. Every page exists to move that decision forward.

## 2. Tone

**Neutral-formal, technical-precise.** Closer to RFC / vendor security whitepaper than to marketing or blog.

- Make claims, then back them with the mechanism. (e.g. "The CID accepts no inbound connections from the internet, because the House NIC's firewall rules drop all unsolicited inbound traffic and only egress TLS sessions are permitted to traverse it.")
- Prefer concrete facts to qualifiers: a port number, a URL pattern, an AWS region, a duration, a code path. If a fact is uncertain, mark it explicitly (e.g. "current state: TLS 1.0+; OLAC-7395 will restrict to TLS 1.2+").
- No marketing language. No hedging filler ("we strive to", "industry-leading", "robust", "seamless", "best-in-class", "leverage", "synergy", "unparalleled"). Say what is, not what is aspired to.
- No defensiveness. If a feature is absent (MFA, SSO, on-premise Hub, BitLocker), state that plainly with the reason or the compensating control, then move on. IT reviewers respect candor; evasion is the disqualifier.

## 3. Voice

- **Active voice.** "The CID initiates the connection." Not "The connection is initiated by the CID."
- **Present tense** for product behavior. Future tense only when describing committed planned changes tied to a Jira story (e.g. "OLAC-7395 will restrict the listener to TLS 1.2+ in a future release").
- **Second person ("you", "your IT team")** when addressing the reader directly — e.g. configuration instructions, firewall planning, what to expect during activation.
- **Third person** for product behavior — e.g. "The CID Hub stores audit events for 7 years."
- **No first person plural ("we", "our")** in customer-facing prose. The doc is written by Agilent but speaks about the CID, not from Agilent.

## 4. Sentence and paragraph targets

- **Sentence length:** target 15–25 words; hard ceiling ~35. Break compound sentences into two when a comma is doing the work of a period.
- **Paragraph length:** 3–5 sentences for explanatory prose; 1–3 sentences for table intros or section openers.
- **Lists over prose** whenever you have ≥3 parallel items. Tables when each item has ≥2 attributes (e.g. URL + port + purpose + direction).
- **One idea per paragraph.** If a paragraph needs a "Furthermore," or "Additionally," start a new paragraph.

## 5. Canonical names and preferred terms

Use these forms consistently. The left column is what to write; the right column lists what **not** to write.

| Use | Do not use |
|---|---|
| **CID** (Connected Instrument Device) — spell out on first mention per page, then "CID" | "IoT box", "the device" (when CID works), "the appliance", "AC" |
| **CID Hub** — the customer-facing SaaS UI and its backing services | "CID Management Hub" (long form OK in headings/intros), "the cloud", "the portal", "AC server" |
| **OpenLab CDS** — the chromatography data system; spell out on first mention | "OpenLab" alone, "CDS" alone (on first mention) |
| **AIC** — Agilent Instrument Controller (the Windows-PC alternative); spell out on first mention | "the traditional setup", "regular AIC" |
| **House NIC**, **Instrument NIC** — capitalized as proper names | "house interface", "lan port" |
| **Embedded Windows VM** or **Windows VM** — the KVM-hosted Windows 10 IoT Enterprise LTSC guest | "the Windows side", "the AIC inside the CID" (the AIC software runs in the VM, but the VM is not "the AIC") |
| **Linux host** — the Oracle Linux 8 host OS on the CID | "the underlying OS", "the host" (ambiguous) |
| **X.509 certificate** — on first mention; "certificate" or "cert" OK thereafter within the same section | "key", "credential" (when "certificate" is meant) |
| **AWS IoT Core**, **AWS Secure Tunneling**, **Amazon Cognito**, **Amazon API Gateway** — full service names on first mention | "the IoT service", "tunneling", "the user pool" |
| **Active Directory** — spell out on first mention, then "AD" OK | "domain" alone when "AD" is meant |
| **MFA**, **SSO**, **SAML**, **OIDC**, **SIEM**, **TLS**, **PHI**, **PII**, **CVSS** — fine without expansion (audience knows these) | — |
| **CID Hub data store**, **CID Hub audit log**, **device shadow** — name the specific surface | "the database" (which one?), "the cloud" |
| **customer organization** or **tenant** — when describing multi-tenant isolation, define "tenant" on first use as "a single customer organization within the shared CID Hub" | "client" (ambiguous with HTTP/network sense) |

**Codenames that must never appear customer-facing:** `ac_agent`, `ac_server`, `ac_client`, `AC` (as a noun), `OLAC-####` Jira IDs (use them in working files and gap lists, not in published pages).

**Numbers and units:**
- TCP/UDP ports as bare integers (`443`, `123`), protocols uppercase (`HTTPS`, `NTP`, `TLS`).
- Durations in SI: "7 years", "3 days", "5 minutes" — not "7 yrs", "72 hrs".
- AWS regions as their AWS codes: `us-east-1`, `us-west-2`. Spell out "US East (N. Virginia)" only on first mention if useful.

## 5a. Docusaurus link conventions

Two rules that matter for the production build (`onBrokenLinks: 'throw'` is set):

- **Never include the `.md` extension in internal doc links.** Write `[Security model](./security/security-model)`, not `[…](./security/security-model.md)`. Docusaurus's link rewriter strips `.md` only when the link is inside plain markdown; **inside JSX such as `<mark>…</mark>` it leaves the `.md` literal**, the rendered URL ends in `.md`, and the broken-link checker fails the build. The extensionless form works in both contexts.
- **For pages with custom `slug:` frontmatter, link to the slug, not the file name.** `introduction.md` has `slug: /`, so link to it as `[Introduction](/)` (or omit the link and use page context), not `[Introduction](./introduction)`. The build resolves links against the page's *served URL*, not its file path.

These rules apply equally to links inside `<mark>` markers and to links inside admonitions.

## 6. Structure conventions

- **Page openers:** lead with one sentence stating what the page is and which IT question(s) it answers. No throat-clearing.
- **Headings:** sentence case, not title case. `## Outbound network traffic`, not `## Outbound Network Traffic`. Match existing docusaurus pages (`system-requirements.md` uses title case in some places — for new pages prefer sentence case; for augmented pages match the existing page's style).
- **Q&A format** for pages that map directly to IT questions: pose the question as an `H2`, answer in the body. The 30 IT questions from Phase 0.1 are the spine.
- **Cross-links over duplication.** If a fact is the canonical home of another page, link to it. Do not restate it. Drift between two copies of the same fact is the largest single failure mode for this doc.
- **Callouts** (Docusaurus `:::note`, `:::warning`, `:::info`) sparingly: only for compensating controls, gaps, or unusually consequential constraints. If every page has a warning, no page has one.

## 7. Handling absent features and gaps

The CID lacks several features IT reviewers will ask about (MFA, SSO, on-prem Hub, BitLocker, customer-runnable patch SLA, etc.). For each:

1. State the absence plainly in one sentence.
2. State the reason or compensating control in one or two sentences.
3. If a Jira story exists to change the situation, name it and what it will change.
4. Do not editorialize or apologize.

Example (good): "The CID Hub does not currently offer customer-side SSO/SAML/OIDC federation. All customer users authenticate against an Amazon Cognito user pool that the Hub provisions per organization, with password rules and account-lockout enforced by Cognito. SSO federation is on the Hub roadmap; no Jira story is committed at the time of writing."

Example (bad): "We are actively exploring next-generation identity integrations to provide our valued customers with the most seamless authentication experience possible."

## 8. Typography and color defaults (from Phase 0.3)

Captured here so they can be revisited before final publication. These are working defaults, not final brand:

- **Headings font:** Lato (or system sans-serif fallback).
- **Body font:** Source Sans Pro (or system sans-serif fallback).
- **Monospace:** the docusaurus default (typically Fira Mono / SFMono).
- **Accent color:** approximate Agilent blue `#0085AD` for trust-boundary callouts and section accents. Do not use it where it could imply official brand approval (large solid blocks, logo-adjacent placements) until brand sign-off.
- **Neutral palette:** site default; one accent only, no rainbow.
- **Logo:** omit until brand sign-off, or use a placeholder block. Do not place an unapproved Agilent logo on the doc.

Revisit before Phase 6 (final publishing).

## 9. What "done" looks like for a page

A page is ready for the Phase 2.3 cross-section consistency pass when:

- Every claim is either self-contained or links to its canonical home elsewhere in the site.
- Every canonical name in §5 above is used in its preferred form.
- No marketing-tone phrases (§2) remain.
- Voice is consistent: active, present, second person to reader / third person to product (§3).
- Sentence-length and paragraph-length targets (§4) are met.
- Every IT question the page is assigned (from `_outline-delta.md` §"Mapping") has a discernible answer on the page.
- All residual gaps (`_gap-list.md`) touching this page are either resolved, or are noted inline with a "current state / planned" framing tied to the relevant Jira story.

## 10. Accuracy-flag convention

When the SME (or any reviewer) corrects a factual claim during drafting, capture the correction in `_source-pack.md` as a **⚠️ Accuracy update** entry directly adjacent to the original source line. Format:

```
- ⚠️ **Accuracy update (YYYY-MM-DD, confirmed via engineering / Jira / code):**
  <one-paragraph correction stating the new fact, why the old source line is wrong or outdated,
  and any constraints on how customer-facing prose should phrase the corrected fact>
```

Rules:

- **Do not edit the original source quote.** PDF excerpts, code snippets, and Jira quotes are evidence; they record what was true at the moment they were captured. Adding an `⚠️ Accuracy update` line preserves the audit trail while preventing the wrong fact from leaking into customer-facing prose.
- **Cross-reference, don't duplicate.** If the same fact appears in multiple `_source-pack.md` sections, add a short `*(see §Xc for the corrected stance)*` italic note next to each old reference rather than restating the correction in full.
- **Then update prose.** After the `_source-pack.md` flag is in place, update any already-drafted page that repeated the old fact, and continue with new drafting using the corrected fact.
- **Naming-and-version transitions** (e.g. Windows 10 → Windows 11) are accuracy updates of this kind. Customer-facing prose uses the new name without "going forward" qualifiers; the source pack records the historical reference and the cut-over date.

This rule exists because PDF/code snippets carry false confidence — they look canonical, and silent edits to them lose the provenance that lets the next drafter trust the source pack at all.

## 11. How this brief is used

- Pinned to every AI prompt that drafts or revises a page. Paste it (or link to it) as system context.
- Updated when a new convention is decided during Phase 2.2 drafting. If you find yourself repeating a correction, the rule belongs here.
- Reviewed once at the end of Phase 2.3 (cross-section consistency) and once before Phase 6 (final publishing).
