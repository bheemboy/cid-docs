# CID Security Rebuild — Outline Delta vs Existing Docusaurus Site

**Strategy:** single source of truth. Augment existing pages where coverage is thin; add genuinely-new pages only for what doesn't exist today; the PDF deliverable is a curated/derived view of these pages, not a parallel duplicate.

This replaces the `~/projects/personal/cid-docs/docs/cid-security/` folder layout proposed in Phase 0.5 of the rebuild plan.

**Path convention:** Bare page paths in this document (e.g. `system-requirements.md`, `howto/manage-users-and-roles.md`) are relative to `~/projects/personal/cid-docs/docs/`. New pages added under the Security category live at `~/projects/personal/cid-docs/docs/security/`. Working files (this delta, source pack, style brief, gap list) live in `~/projects/personal/cid-docs/source/` and are not published.

---

## Page-by-page delta

### Existing pages — augment in place

| Page | Current coverage | Additions needed | IT Qs addressed |
|---|---|---|---|
| `introduction.md` (14 lines) | What CID is, Hub invitation model | Add 2–3 lines: positions CID as **one** deployment option alongside AIC; lists where the security model is documented. | 1, 2 |
| `system-requirements.md` §Networking | House/Instrument NICs, table of inbound/outbound, topology | Add: explicit "no inbound from internet" callout; V-NIC pass-through to Windows VM; why instrument LAN has no WAN exposure. Link to new security-model page. | 12, 13, 14, 17 |
| `system-requirements.md` §Internet Requirements | Outbound URL list (Agilent, AWS, Microsoft Update, NTP) | Add: direction column, port column (all 443 except NTP/123), purpose per URL, narrowing notes for `*.s3.amazonaws.com`, behavior when blocked, region picker for `*.iot.us-*`. Reconcile with PDF's `*.cid.agilent.com` + `Data.tunneling.iot.<region>.amazonaws.com`. | 12, 13, 14, 16, 22 |
| `system-requirements.md` §SSL Certificates | ECM/OpenLab Server cert rules for CIDs to trust | No change. Already correctly framed. | — |
| `system-requirements.md` §Shared Responsibility | Vendor/customer split | Expand: explicit list of what Agilent owns (Hub, patches, drivers, CID OS) vs customer (firewall, AD, screen locks, anti-malware for CDS clients). | 7, 8, 9 |
| `system-requirements.md` §Hardware Specification | Form factor, CPU, RAM, ports | Add: BIOS/Secure Boot posture, disk encryption posture, hardware certifications (CE/FCC/RoHS), supply-chain provenance (Lenovo-sourced, Agilent-imaged). **Gap: confirm with hardware owner.** | implicit |
| `cid-data-flow.md` (draft, 33 lines) | Data privacy stance, data-type table | Promote out of draft. Open with the customer-facing Q&A "What is the high-level data flow between a CID device and the CID Management Hub?" — answer states **no PHI**, **no PII beyond admin user names/emails**, **no laboratory data/results**, then renders the Data Types Summary Table (9 categories, see `_source-pack.md` §3f-i and `data-types-summary-table.png`). Add: telemetry inventory (what fields per direction), retention per category, AWS region per data category, link to audit-log page. | 15, 21, 22, 28 |
| `start/register-activate.md` | First-boot activation workflow | Add: X.509 cert generation moment, where the cert is stored on device, cert rotation policy. **Gap: rotation interval not documented.** | implicit |
| `howto/activate-a-cid.md` | UI flow for activation | No structural change; cross-link to security-model. | — |
| `howto/manage-users-and-roles.md` | Roles, invites | Add: IdP integration status (Cognito-only today), MFA status, offboarding flow, what happens to active sessions on user removal. **Gap: MFA + SSO posture is the #1 IT blocker.** | 23, 24, 26 |
| `howto/cid-administration.md` | Admin tasks | Add: Agilent support access approval flow — how request is initiated, who approves, audit trail, session termination. | 25 |
| `howto/view-activity-logs.md` | Viewing logs in UI | Add: log model (events captured), retention (3-day minimum documented; max unknown — **gap**), tamper-evidence posture, export format for SIEM (**gap**). | 28 |
| `howto/install-os-updates.md` + `howto/apply-updates.md` + `howto/apply-cds-updates.md` + `howto/apply-driver-updates.md` | Update procedures | Add a single "Patch & Update Model" overview page that frames these: who delivers, who validates, who decides timing, rollback, SLA targets. **Gap: SLA not documented.** | 9, 30 |
| `troubleshooting/cid-net-01..06` | Specific failure modes | No change. Cross-link from outgoing-endpoints section. | 16 |
| `compatibility.md` | CDS version matrix | No change. | — |
| `acceptable-use-policy.md` | Customer obligations | No change. | — |

### New pages — add to site

| New page | Why it doesn't fit an existing page | IT Qs addressed |
|---|---|---|
| `security-model.md` | No existing page describes trust boundaries, threat model, or why the V-NIC + Windows-VM-no-WAN-IP + reverse-proxy stack is the security story. This is the centerpiece of the rebuild. | 7, 8, 14, 17, 18 |
| `cid-vs-aic.md` | The PDF's Figure 1 + "functionally equivalent to AIC" framing has no home today. Needed as the decision aid for IT reviewers choosing deployment model. | 1, 2, 3, 4, 5, 6, 11 |
| `cid-hub-architecture.md` | Tenant isolation, AWS service inventory, Cognito posture, region/residency — no current page covers Hub-side architecture. (Companion to `cid-data-flow.md`.) | 11, 20, 22 |
| `remote-access.md` | Windows Console + Linux Cockpit + Secure Tunnel + Agilent support approval flow — currently scattered across howto/. A consolidated "what remote access looks like, who can do it, how it's audited" page is needed. | 19, 25 |
| `audit-and-compliance.md` | Audit-log model, retention, tamper-evidence, SIEM export, vulnerability disclosure intake, patch SLA, Part 11/Annex 11/SOC 2/ISO posture (mostly pointers to companion FAQ, but the pointers need a home). | 27, 28, 29, 30 |

### Pages NOT created (deliberately)

- `deployment-model.md`, `network-architecture.md`, `outgoing-endpoints.md`, `operational-interfaces.md`, `identity-and-auth.md`, `device-registration.md`, `patch-management.md`, `hardware.md`, `quick-reference.md` from the original Phase 0.5 plan — all subsumed by augmenting existing pages or by the 5 new pages above.

---

## Site reorganization

Proposed sidebar (additions and rearrangement only):

```
Introduction
System Requirements
Compatibility
Acceptable Use Policy
EULA
Release Notes

Security
├── Security Model               (NEW)
├── CID vs AIC                   (NEW — decision aid)
├── CID Hub Architecture         (NEW)
├── Data Flow & Privacy          (promote from draft)
├── Remote Access                (NEW)
└── Audit & Compliance           (NEW)

Getting Started
├── Getting Started
└── Register & Activate          (augmented)

How-to
├── (existing, augmented per delta table)
└── Patch & Update Overview      (NEW — frames the existing apply-* pages)

Troubleshooting
└── (unchanged)
```

The new "Security" category gives IT reviewers a single landing point. Each page in it is the canonical home for that topic; other pages link in rather than duplicate.

---

## The PDF deliverable

After site changes are complete and reviewed (Phase 5), the PDF is generated by:
1. Selecting a curated subset of pages: `introduction`, `system-requirements`, `security-model`, `cid-vs-aic`, `cid-hub-architecture`, `cid-data-flow`, `remote-access`, `audit-and-compliance`, `patch-update-overview`.
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
| 10 | Internet required? | `system-requirements` §Internet (aug.) | `security-model` |
| 11 | On-premise / air-gapped Hub? | `cid-vs-aic` | `cid-hub-architecture` |
| 12 | URL whitelist + narrowing | `system-requirements` §Internet (aug.) | — |
| 13 | Ports/protocols per path | `system-requirements` §Networking (aug.) | `cid-data-flow` |
| 14 | Connection direction | `system-requirements` §Networking (aug.) | `security-model` |
| 15 | Data transit through Hub? | `cid-data-flow` | — |
| 16 | Firewall blocks one URL? | `troubleshooting/cid-net-*` | `system-requirements` §Internet |
| 17 | Instrument LAN isolated? | `system-requirements` §Networking (aug.) | `security-model` |
| 18 | Attack surface | `security-model` | — |
| 19 | Tunnel persistent/on-demand? | `remote-access` (NEW) | `security-model` |
| 20 | AWS shared vs dedicated? | `cid-hub-architecture` (NEW) | — |
| 21 | Telemetry collection? | `cid-data-flow` (aug.) | — |
| 22 | Data residency? | `cid-hub-architecture` (NEW) | `cid-data-flow` |
| 23 | IdP / SSO / SAML / OIDC | `howto/manage-users-and-roles` (aug.) | `cid-hub-architecture` |
| 24 | MFA | `howto/manage-users-and-roles` (aug.) | — |
| 25 | Agilent support access | `remote-access` (NEW) | `howto/cid-administration` |
| 26 | Offboarding | `howto/manage-users-and-roles` (aug.) | — |
| 27 | SOC 2 / ISO 27001 | `audit-and-compliance` (NEW) | — |
| 28 | Audit logs / tamper / SIEM | `audit-and-compliance` (NEW) | `howto/view-activity-logs` |
| 29 | 21 CFR Part 11 / Annex 11 | `audit-and-compliance` (NEW) | — |
| 30 | Vuln disclosure / patch SLA | `audit-and-compliance` (NEW) | `patch-update-overview` |

Every question has a home. No question's answer is split across pages without one of them being primary.
