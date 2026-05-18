# CID Security Rebuild — Outline Delta vs Existing Docusaurus Site

**Strategy:** single source of truth. Augment existing pages where coverage is thin; add genuinely-new pages only for what doesn't exist today; the PDF deliverable is a curated/derived view of these pages, not a parallel duplicate.

This replaces the `~/projects/personal/cid-docs/docs/cid-security/` folder layout proposed in Phase 0.5 of the rebuild plan.

**Path convention:** Bare page paths in this document (e.g. `reference/system-requirements.md`, `howto/account/manage-users-and-roles.md`) are relative to `~/projects/personal/cid-docs/docs/`. New pages added under the Security category live at `~/projects/personal/cid-docs/docs/security/`. Working files (this delta, source pack, style brief, gap list) live in `~/projects/personal/cid-docs/source/` and are not published.

**Path refresh (2026-05-18):** Paths below were updated after the Diátaxis restructure (`reference/`, `howto/{account,monitoring,onboarding,operations,setup,updates}/`, `legal/`). The original mapping of IT questions to pages is unchanged; only file locations moved.

---

## Page-by-page delta

### Existing pages — augment in place

| Page | Current coverage | Additions needed | IT Qs addressed |
|---|---|---|---|
| `introduction.md` (14 lines) | What CID is, Hub invitation model | Add 2–3 lines: positions CID as **one** deployment option alongside AIC; lists where the security model is documented. ✅ Done 2026-05-15 (`<mark>` deployment-options paragraph added). | 1, 2 |
| `reference/system-requirements.md` §Networking | House/Instrument NICs, table of inbound/outbound, topology | Add: explicit "no inbound from internet" callout; V-NIC pass-through to Windows VM; why instrument LAN has no WAN exposure. Link to new security-model page. ✅ Done 2026-05-15 (three-bullet trust-boundary block added; corrected for Windows 11 and GC-only listener). | 12, 13, 14, 17 |
| `reference/system-requirements.md` §Internet Requirements | Outbound URL list (Agilent, AWS, Microsoft Update, NTP) | Add: direction column, port column (all 443 except NTP/123), purpose per URL, narrowing notes for `*.s3.amazonaws.com`, behavior when blocked, region picker for `*.iot.us-*`. Reconcile with PDF's `*.cid.agilent.com` + `Data.tunneling.iot.<region>.amazonaws.com`. Frame current-state vs OLAC-7392 (URL narrowing) vs OLAC-7395 (TLS 1.2+). ⏭ Next. | 12, 13, 14, 16, 22 |
| `reference/system-requirements.md` §SSL Certificates | ECM/OpenLab Server cert rules for CIDs to trust | No change. Already correctly framed. | — |
| `reference/system-requirements.md` §Shared Responsibility | Vendor/customer split | Expand: explicit list of what Agilent owns (Hub, patches, drivers, CID OS) vs customer (firewall, AD, screen locks, anti-malware for CDS clients). | 7, 8, 9 |
| `reference/system-requirements.md` §Hardware Specification | Form factor, CPU, RAM, ports | Add: BIOS/Secure Boot posture, disk encryption posture, hardware certifications (CE/FCC/RoHS), supply-chain provenance (Lenovo-sourced, Agilent-imaged). **Gap: confirm with hardware owner.** | implicit |
| `security/data-flow-and-privacy.md` ✅ Done | Data privacy stance, data-type table | Promoted out of draft. Opens with the customer Q&A; data-privacy stance clarifies admin emails live in Cognito (Hub-side), not on CID. Renders the 9-category Data Types Summary Table. Adds: telemetry inventory by direction (CID→Hub, Hub→CID, Portal→Hub), region/residency section (us-east-1 with us-west-2 yum-repo exception), retention summary (audit logs ≥7y, shadow latest-state only, registration for device lifetime, image artifacts version-tagged), and "what does not transit the Hub" closing block. Links to audit-and-compliance + view-activity-logs. | 15, 21, 22, 28 |
| `start/register-activate.md` | First-boot activation workflow | Add: X.509 cert generation moment, where the cert is stored on device, cert rotation policy. **Gap: rotation interval not documented.** | implicit |
| `howto/onboarding/activate-a-cid.md` | UI flow for activation | No structural change; cross-link to security-model. | — |
| `howto/account/manage-users-and-roles.md` | Roles, invites | Add: IdP integration status (Cognito-only today), MFA status, offboarding flow, what happens to active sessions on user removal. **Gap: MFA + SSO posture is the #1 IT blocker.** | 23, 24, 26 |
| `howto/operations/cid-administration.md` | Admin tasks | Add: Agilent support access approval flow — how request is initiated, who approves, audit trail, session termination. | 25 |
| `howto/monitoring/view-activity-logs.md` | Viewing logs in UI | Add: log model (events captured), retention (3-day minimum documented; max unknown — **gap**), tamper-evidence posture, export format for SIEM (**gap**). | 28 |
| `howto/updates/{install-os-updates,apply-updates,apply-cds-updates,apply-driver-updates}.md` | Update procedures | Framed by `howto/updates/patch-update-overview.md` (stub in place): who delivers, who validates, who decides timing, rollback, SLA targets. **Gap: SLA not documented.** | 9, 30 |
| `troubleshooting/cid-net-01..06` | Specific failure modes | No change. Cross-link from outgoing-endpoints section. | 16 |
| `troubleshooting/cid-boot-01-beep-codes-on-startup.md` | Boot-time beep codes (extracted from system-requirements during Diátaxis split) | Already cross-linked from `reference/system-requirements.md` §Internet Requirements via `<mark>` link to `/cid-boot-01`. | 16 |
| `reference/compatibility.md` | CDS version matrix | No change. | — |
| `legal/acceptable-use-policy.md` | Customer obligations | No change. | — |

### New pages — add to site

| New page | Why it doesn't fit an existing page | IT Qs addressed |
|---|---|---|
| `security-model.md` | No existing page describes trust boundaries, threat model, or why the V-NIC + Windows-VM-no-WAN-IP + reverse-proxy stack is the security story. This is the centerpiece of the rebuild. | 7, 8, 14, 17, 18 |
| `cid-vs-aic.md` | The PDF's Figure 1 + "functionally equivalent to AIC" framing has no home today. Needed as the decision aid for IT reviewers choosing deployment model. | 1, 2, 3, 4, 5, 6, 11 |
| `cid-hub-architecture.md` | Tenant isolation, AWS service inventory, Cognito posture, region/residency — no current page covers Hub-side architecture. (Companion to `security/data-flow-and-privacy.md`.) | 11, 20, 22 |
| `remote-access.md` | Windows Console + Linux Cockpit + Secure Tunnel + Agilent support approval flow — currently scattered across howto/. A consolidated "what remote access looks like, who can do it, how it's audited" page is needed. | 19, 25 |
| `audit-and-compliance.md` | Audit-log model, retention, tamper-evidence, SIEM export, vulnerability disclosure intake, patch SLA, Part 11/Annex 11/SOC 2/ISO posture (mostly pointers to companion FAQ, but the pointers need a home). | 27, 28, 29, 30 |

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
| 9 | Patching/AV/backup/updates | `patch-update-overview` (NEW) | `security-model` |
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
| 23 | IdP / SSO / SAML / OIDC | `howto/account/manage-users-and-roles` (aug.) | `cid-hub-architecture` |
| 24 | MFA | `howto/account/manage-users-and-roles` (aug.) | — |
| 25 | Agilent support access | `remote-access` (NEW) | `howto/operations/cid-administration` |
| 26 | Offboarding | `howto/account/manage-users-and-roles` (aug.) | — |
| 27 | SOC 2 / ISO 27001 | `audit-and-compliance` (NEW) | — |
| 28 | Audit logs / tamper / SIEM | `audit-and-compliance` (NEW) | `howto/monitoring/view-activity-logs` |
| 29 | 21 CFR Part 11 / Annex 11 | `audit-and-compliance` (NEW) | — |
| 30 | Vuln disclosure / patch SLA | `audit-and-compliance` (NEW) | `patch-update-overview` |

Every question has a home. No question's answer is split across pages without one of them being primary.
