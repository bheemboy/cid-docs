# CID Security Rebuild — Outline Delta vs Existing Docusaurus Site

**Strategy:** single source of truth. Augment existing pages where coverage is thin; add genuinely-new pages only for what doesn't exist today; the PDF deliverable is a curated/derived view of these pages, not a parallel duplicate.

This replaces the `~/projects/personal/cid-docs/docs/cid-security/` folder layout proposed in Phase 0.5 of the rebuild plan.

**Path convention:** Bare page paths in this document (e.g. `reference/system-requirements.md`, `howto/account/manage-users-and-roles.md`) are relative to `~/projects/personal/cid-docs/docs/`. New pages added under the Security category live at `~/projects/personal/cid-docs/docs/security/`. Working files (this delta, source pack, style brief, gap list) live in `~/projects/personal/cid-docs/source/` and are not published.

**Path refresh (2026-05-18):** Paths below were updated after the Diátaxis restructure (`reference/`, `howto/{account,monitoring,onboarding,operations,setup,updates}/`, `legal/`). The original mapping of IT questions to pages is unchanged; only file locations moved.

**Diátaxis split (2026-05-18):** Per `cid-knowledge/references/doc-style-guide.md` §1, every page is exactly one Diátaxis type. Three planned how-to augmentations mixed procedure with explanation; the explanation halves were re-routed to the Security category. Affected pages: `howto/account/manage-users-and-roles` (IdP/MFA posture → `security/security-model` §Identity), `howto/operations/cid-administration` (support-access trust model → `security/remote-access`), `howto/monitoring/view-activity-logs` (log model / retention / tamper / SIEM → `security/audit-and-compliance`), `howto/updates/patch-update-overview` (policy / SLA / rollback → `security/audit-and-compliance`). The how-to pages stay scoped to UI procedures and cross-link out.

---

## Page-by-page delta

### Existing pages — augment in place

| Page | Current coverage | Additions needed | IT Qs addressed |
|---|---|---|---|
| `introduction.md` (14 lines) | What CID is, Hub invitation model | Add 2–3 lines: positions CID as **one** deployment option alongside AIC; lists where the security model is documented. ✅ Done 2026-05-15 (`<mark>` deployment-options paragraph added). | 1, 2 |
| `reference/system-requirements.md` §Networking | House/Instrument NICs, table of inbound/outbound, topology | Add: explicit "no inbound from internet" callout; V-NIC pass-through to Windows VM; why instrument LAN has no WAN exposure. Link to new security-model page. ✅ Done 2026-05-15 (three-bullet trust-boundary block added; corrected for Windows 11 and GC-only listener). | 12, 13, 14, 17 |
| `reference/system-requirements.md` §Internet Requirements ✅ Done | Outbound URL list (Agilent, AWS, Microsoft Update, NTP) | Replaced with three tables (CID Hub + AWS services, Microsoft Windows Update, Time synchronization). Added: direction, port, purpose per URL; `*.agilent.com` merged with the former `*.cid.agilent.com`; specific AWS IoT endpoint `a3cb4mwmdz2oep-ats.iot.us-east-1.amazonaws.com` called out; `us-east-1` framed positively as single production region with `us-west-2` Linux-yum-repo exception; CloudFront image delivery from Linux Update 2026.01.12; behavior-when-blocked block split AWS IoT Core vs Secure Tunneling; `:::info[Firewall Configuration]` placed directly under the section title. | 12, 13, 14, 16, 22 |
| `reference/system-requirements.md` §SSL Certificates | ECM/OpenLab Server cert rules for CIDs to trust | No change. Already correctly framed. | — |
| `reference/system-requirements.md` §Shared Responsibility ✅ Done | Vendor/customer split | First-person prose replaced with 11-row table (Area · Agilent owns · Customer owns) covering Hub platform, OS/firmware/drivers, identity, network egress, AD/screen locks, anti-malware on CDS clients, audit retention, instrument LAN policy. | 7, 8, 9 |
| `reference/system-requirements.md` §Hardware Specification ✅ Done | Form factor, CPU, RAM, ports | Hardware table cleaned (operating temperature, one-instrument-per-CID). Added: Manufacturing/provenance (currently Lenovo, additional qualified suppliers possible over time); Device security posture (Agilent gold-image + Linux Update channel for boot integrity, positively framed; full-disk encryption rationale leading with not-a-long-term-record-store, performance secondary); bundled-IoT-hardware framing. **Remaining gap (G-07/G-17):** Lenovo regulatory certificate numbers (CE/FCC/UL/RoHS/REACH/WEEE) — owner Edison → Bhavani. | implicit |
| `security/data-flow-and-privacy.md` ✅ Done | Data privacy stance, data-type table | Promoted out of draft. Opens with the customer Q&A; data-privacy stance clarifies admin emails live in Cognito (Hub-side), not on CID. Renders the 9-category Data Types Summary Table. Adds: telemetry inventory by direction (CID→Hub, Hub→CID, Portal→Hub), region/residency section (us-east-1 with us-west-2 yum-repo exception), retention summary (audit logs ≥7y, shadow latest-state only, registration for device lifetime, image artifacts version-tagged), and "what does not transit the Hub" closing block. Links to audit-and-compliance + view-activity-logs. | 15, 21, 22, 28 |
| `start/register-activate.md` | First-boot activation workflow | No augmentation. The X.509 / cert-storage / rotation / decommissioning content is reference/explanation material for IT reviewers, not quick-start procedure — it belongs in the Security category (planned home: `security/security-model.md` "Device identity" section). Rotation-interval gap is closed in source-pack §6 and ready to drop into security-model when that page is drafted: AWS-IoT-issued ~50-year lifetime, 7-day-cadence renewal check, non-disruptive rotation, Hub-delete → self-factory-reset, offline-revocation via Agilent Support. | implicit |
| `howto/onboarding/activate-a-cid.md` ✅ Done | UI flow for activation | Added "See also" section at page bottom (marked H2) linking to `security/security-model` for the PIN→X.509 identity exchange / cert storage / post-activation identity, and to `security/data-flow-and-privacy` for what flows during activation. No procedure changes. | — |
| `howto/account/manage-users-and-roles.md` | Roles, invites | **How-to scope only** (post-Diátaxis split, 2026-05-18): keep procedural steps for inviting users, changing roles, and offboarding (including the UI consequence of removal on active sessions). Cross-link to `security/security-model` for the *posture* questions. Explanation content (Cognito-only IdP, no SAML/OIDC, no MFA today, session-revocation model) moved to `security/security-model` §Identity. | 26 (here); 23, 24 routed to `security/security-model` |
| `howto/operations/cid-administration.md` | Admin tasks | **How-to scope only** (post-Diátaxis split): keep procedural steps for the day-to-day admin tasks including the UI flow to approve or deny an Agilent support access request. Cross-link to `security/remote-access` for the trust model, who-approves-what, audit-trail surface, and session-termination posture. | implicit (here); 25 routed to `security/remote-access` |
| `howto/monitoring/view-activity-logs.md` | Viewing logs in UI | **How-to scope only** (post-Diátaxis split): keep procedural steps for finding, filtering, and exporting the activity log in the UI. Cross-link to `security/audit-and-compliance` for the explanation content (log model / events captured, retention, tamper-evidence posture, SIEM export format). | implicit (here); 28 routed to `security/audit-and-compliance` |
| `howto/updates/{install-os-updates,apply-updates,apply-cds-updates,apply-driver-updates}.md` | Update procedures | **How-to scope only.** Each apply-* page stays a how-to. The `howto/updates/patch-update-overview.md` stub becomes a lean landing index that links to the apply-* pages (no policy/SLA content). Explanation content (who delivers, who validates, who decides timing, rollback policy, patch SLA, vuln disclosure) moves to `security/audit-and-compliance`. **Gap: patch SLA still not documented.** | 9 (apply-*); 30 routed to `security/audit-and-compliance` |
| `troubleshooting/cid-net-01..06` | Specific failure modes | No change. Cross-link from outgoing-endpoints section. | 16 |
| `troubleshooting/cid-boot-01-beep-codes-on-startup.md` | Boot-time beep codes (extracted from system-requirements during Diátaxis split) | Already cross-linked from `reference/system-requirements.md` §Internet Requirements via `<mark>` link to `/cid-boot-01`. | 16 |
| `reference/compatibility.md` | CDS version matrix | No change. | — |
| `legal/acceptable-use-policy.md` | Customer obligations | No change. | — |

### New pages — add to site

| New page | Why it doesn't fit an existing page | IT Qs addressed |
|---|---|---|
| `security-model.md` | No existing page describes trust boundaries, threat model, or why the V-NIC + Windows-VM-no-WAN-IP + reverse-proxy stack is the security story. This is the centerpiece of the rebuild. **Absorbs** the device-identity / X.509 / cert-rotation / decommissioning content (queued from `start/register-activate.md` Diátaxis pull-out) **and** the identity-posture content (Cognito-only IdP, no SAML/OIDC, no MFA, session-revocation model) pulled out of `howto/account/manage-users-and-roles.md`. | 4, 7, 8, 14, 17, 18, 23, 24 |
| `cid-vs-aic.md` | The PDF's Figure 1 + "functionally equivalent to AIC" framing has no home today. Needed as the decision aid for IT reviewers choosing deployment model. | 1, 2, 3, 5, 6, 11 |
| `cid-hub-architecture.md` | Tenant isolation, AWS service inventory, Cognito posture, region/residency — no current page covers Hub-side architecture. (Companion to `security/data-flow-and-privacy.md`.) | 11, 20, 22 |
| `remote-access.md` | Windows Console + Linux Cockpit + Secure Tunnel + Agilent support approval flow — currently scattered across howto/. A consolidated "what remote access looks like, who can do it, how it's audited" page is needed. **Absorbs** the trust-model + audit-trail + session-termination posture for Agilent support access pulled out of `howto/operations/cid-administration.md`. | 19, 25 |
| `audit-and-compliance.md` | Audit-log model, retention, tamper-evidence, SIEM export, vulnerability disclosure intake, patch SLA, Part 11/Annex 11/SOC 2/ISO posture. **Absorbs** the log-model/retention/tamper/SIEM explanation pulled out of `howto/monitoring/view-activity-logs.md` **and** the patch-policy/SLA/rollback explanation pulled out of `howto/updates/patch-update-overview.md`. | 9, 27, 28, 29, 30 |

### Pages NOT created (deliberately)

- `deployment-model.md`, `network-architecture.md`, `outgoing-endpoints.md`, `operational-interfaces.md`, `identity-and-auth.md`, `device-registration.md`, `patch-management.md`, `hardware.md`, `quick-reference.md` from the original Phase 0.5 plan — all subsumed by augmenting existing pages or by the 5 new pages above.

---

## Site reorganization

Current sidebar (as of 2026-05-18, after Diátaxis restructure):

```
Introduction
Getting Started
├── Getting Started
└── Register & Activate          (augmented)

How-to
├── account/
│   ├── manage-account-settings
│   └── manage-users-and-roles   (augmented)
├── monitoring/
│   ├── view-activity-logs       (augmented)
│   ├── view-cids
│   ├── view-devices
│   └── view-software-library
├── onboarding/
│   ├── activate-a-cid
│   ├── configure-instrument
│   └── configure-network-cards
├── operations/
│   ├── cid-administration       (augmented)
│   └── perform-cds-failover
├── setup/
│   ├── configure-software-exceptions
│   ├── define-software-template
│   └── register-a-server
└── updates/
    ├── patch-update-overview    (NEW — frames the apply-* pages)
    ├── install-os-updates
    ├── apply-driver-updates
    ├── apply-cds-updates
    └── apply-updates

Security                         (NEW category)
├── Security Model               (NEW)
├── CID vs AIC                   (NEW — decision aid)
├── CID Hub Architecture         (NEW)
├── Remote Access                (NEW)
└── Audit & Compliance           (NEW)

Reference
├── System Requirements          (augmented — networking + internet + hardware + shared-responsibility)
├── Compatibility
└── Release Notes

Legal
├── Acceptable Use Policy
└── EULA

Troubleshooting
└── (unchanged — cid-boot-01, cid-connectivity-tester, cid-net-01..06)
```

`security/data-flow-and-privacy.md` was moved from `docs/cid-data-flow.md` into the Security category on 2026-05-18. Diátaxis classification: explanation (helps an IT reviewer understand what does and does not cross the CID ⇄ Hub boundary; the 9-category table is evidence inside the explanation, not a standalone reference lookup). Security sidebar order is: 1) Security Model, 2) CID vs AIC, 3) CID Hub Architecture, 4) Data Flow & Privacy, 5) Remote Access, 6) Audit & Compliance.

The Security category gives IT reviewers a single landing point. Each page in it is the canonical home for that topic; other pages link in rather than duplicate.

---

## The PDF deliverable

After site changes are complete and reviewed (Phase 5), the PDF is generated by:
1. Selecting a curated subset of pages: `introduction`, `reference/system-requirements`, `security/security-model`, `security/cid-vs-aic`, `security/cid-hub-architecture`, `security/data-flow-and-privacy`, `security/remote-access`, `security/audit-and-compliance`, `howto/updates/patch-update-overview`.
2. Running them through a Docusaurus → PDF pipeline (decision deferred to Phase 4 per just-in-time toolchain rule).
3. The PDF is a snapshot artifact; the site remains the source of truth.

This replaces the previous Phase 4 plan of typesetting standalone Markdown files in Quarto.

---

## Mapping: 30 IT questions → page that answers each

| IT Q | Topic | Primary page | Secondary |
|---|---|---|---|
| 1 | IoT box mandatory? | `introduction` (augmented) | `cid-vs-aic` |
| 2 | Replaces PCs entirely? | `cid-vs-aic` | `introduction` |
| 3 | Operate on validated Windows PCs? | `cid-vs-aic` | — |
| 4 | AD authentication? | `cid-vs-aic` | `security-model` |
| 5 | Validated system boundary? | `cid-vs-aic` | — |
| 6 | Reduces validation effort? | `cid-vs-aic` | — |
| 7 | Cyber advantages vs PCs | `security-model` | `cid-vs-aic` |
| 8 | Limitations vs PCs | `security-model` | `cid-vs-aic` |
| 9 | Patching/AV/backup/updates | `security/audit-and-compliance` (patch policy/SLA) | `howto/updates/*` (procedure), `security/security-model` |
| 10 | Internet required? | `reference/system-requirements` §Internet (aug.) | `security-model` |
| 11 | On-premise / air-gapped Hub? | `cid-vs-aic` | `cid-hub-architecture` |
| 12 | URL whitelist + narrowing | `reference/system-requirements` §Internet (aug.) | — |
| 13 | Ports/protocols per path | `reference/system-requirements` §Networking (aug.) | `security/data-flow-and-privacy` |
| 14 | Connection direction | `reference/system-requirements` §Networking (aug.) | `security-model` |
| 15 | Data transit through Hub? | `security/data-flow-and-privacy` | — |
| 16 | Firewall blocks one URL? | `troubleshooting/cid-net-*` | `reference/system-requirements` §Internet |
| 17 | Instrument LAN isolated? | `reference/system-requirements` §Networking (aug.) | `security-model` |
| 18 | Attack surface | `security-model` | — |
| 19 | Tunnel persistent/on-demand? | `remote-access` (NEW) | `security-model` |
| 20 | AWS shared vs dedicated? | `cid-hub-architecture` (NEW) | — |
| 21 | Telemetry collection? | `security/data-flow-and-privacy` (aug.) | — |
| 22 | Data residency? | `cid-hub-architecture` (NEW) | `security/data-flow-and-privacy` |
| 23 | IdP / SSO / SAML / OIDC | `security/security-model` §Identity (NEW) | `cid-hub-architecture` |
| 24 | MFA | `security/security-model` §Identity (NEW) | — |
| 25 | Agilent support access | `security/remote-access` (NEW) | `howto/operations/cid-administration` (procedure only) |
| 26 | Offboarding | `howto/account/manage-users-and-roles` (procedure) | `security/security-model` §Identity (session-revocation model) |
| 27 | SOC 2 / ISO 27001 | `security/audit-and-compliance` (NEW) | — |
| 28 | Audit logs / tamper / SIEM | `security/audit-and-compliance` (NEW) | `howto/monitoring/view-activity-logs` (procedure only) |
| 29 | 21 CFR Part 11 / Annex 11 | `security/audit-and-compliance` (NEW) | — |
| 30 | Vuln disclosure / patch SLA | `security/audit-and-compliance` (NEW) | `howto/updates/patch-update-overview` (procedure index only) |

Every question has a home. No question's answer is split across pages without one of them being primary.
