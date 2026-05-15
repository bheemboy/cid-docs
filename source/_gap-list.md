# CID Security Rebuild — Residual Gap List

**Phase 1.3 is complete.** All 21 originally identified gaps have been answered and the answers folded into `_source-pack.md`. See `_source-pack.md` §12c for the full closed-gap → section cross-reference.

This file now tracks only the **residual chases** that block or qualify the security-doc rebuild, and the **in-flight Jira items** that will change documented behavior between now and the doc's first release.

---

## Residual chases

| ID | Topic | Where it surfaces in source pack | Owner | What's still needed |
|---|---|---|---|---|
| G-06 | Telemetry inventory + per-category retention | `_source-pack.md` §3f / §3f-i | **Alok** | Field-level inventory of CID→Hub telemetry (per direction), sensitivity classification per field, and per-category retention windows. The 9-row Data Types Summary Table is a category map, not a field-level inventory. |
| G-07 / G-17 | Lenovo-side attestations + hardware regulatory certifications | `_source-pack.md` §8a | **Edison → Bhavani** | Any OEM-side attestation documents (SOC 2 / ISO at Lenovo) plus CE / FCC / UL / RoHS / REACH / WEEE certificate numbers for the specific Lenovo SKU used as the CID. |
| G-18 | TPM 2.0 + measured-boot posture | `_source-pack.md` §8c | **Alok** | Confirm whether the CID hardware exposes TPM 2.0 and whether measured boot is used. (Secure Boot already confirmed **disabled**.) |
| G-20 | Modernized Hub VPC architecture diagrams | `_source-pack.md` §10 | **Sunil** | Re-author the four drawio diagrams in `~/projects/personal/cid-docs/source/` (`1.enterprise-overview.drawio`, `2.cid-internals.drawio`, `3.cid-archicture.drawio`, `4.aws-architecture.drawio`) in a current tool and produce publication-ready exports. |
| G-03 (sub) | Vulnerability-disclosure intake channel | `_source-pack.md` §7e | **PM / Security** | Documented address/channel for customers and third-party researchers to report suspected vulnerabilities, plus acknowledgement and response timelines. OLAC-5819 noted the broken "Contact Support" email; needs a working replacement. |
| G-13 (sub) | AWS-IoT-side cert detach/deactivate for offline or extracted-cert CIDs | `_source-pack.md` §6 | **PM / Security + AWS ops** | The `delete_ac` flow (verified in `ac_server/management_api/ac_api.py:1139`) relies on the CID self-wiping when it receives `desired.is_deleted=True` in the IoT shadow; it does not detach or deactivate the X.509 cert in AWS IoT Core. For lost/stolen devices that are offline (or whose cert+key was extracted), an out-of-band AWS-IoT-side detach/deactivate is required. Need a documented operational procedure (who runs it, expected time-to-revoke, audit trail). |

---

## Open Jira items that change documented behavior

These three stories were opened during the Phase 1.3 answer pass. Until they ship, the security doc should describe **both** today's state and the planned tightening so it stays accurate across the release window.

| Jira | Topic | Effect on doc |
|---|---|---|
| **OLAC-7392** | Unify CID outbound AWS URLs under `agilent.com` | Enables a narrowed, wildcard-free egress allow-list (closes G-08 in customer terms). |
| **OLAC-7394** | Migrate Linux yum repo from us-west-2 to us-east-1 | Collapses the production footprint to a single region (refines G-04 / G-12). |
| **OLAC-7395** | Restrict CID nginx to TLS 1.2+ | Drops TLSv1 / TLSv1.1 from the CID nginx listener (closes G-14 in scanner terms). |

---

## How this list is used

- New items get added here only if they (a) block the security-doc rebuild or (b) change documented CID behavior.
- When a residual chase is answered, fold the answer into the appropriate `_source-pack.md` section, add a row to §12c, and remove the row here.
- The canonical record of *closed* gaps lives in `_source-pack.md` §12c — do not re-expand this file with the full historical Q&A.
