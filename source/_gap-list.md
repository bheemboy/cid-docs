# CID Security Rebuild — Residual Gap List

**Phase 1.3 is complete.** All 21 originally identified gaps have been answered and the answers folded into `_source-pack.md`. See `_source-pack.md` §12c for the full closed-gap → section cross-reference.

This file now tracks only the **residual chases** that block or qualify the security-doc rebuild, and the **in-flight Jira items** that will change documented behavior between now and the doc's first release.

---

## 2026-06-03 update — manufacturing + architect feedback

A round of feedback landed in `~/projects/personal/cid-docs/source/`: the manufacturing team's reply on Lenovo hardware, the architect's telemetry inventory (`cid-telemetry-inventory.md`), and the OEM datasheet (`ThinkEdge SE10n Gen 2 Datasheet.pdf`). Net effect on the chase list:

- **G-06 — RESOLVED & FOLDED (2026-06-03).** `cid-telemetry-inventory.md` supplies the full field-level inventory, per-field sensitivity, the sanitized-field list, retention, and PII/sample-data confirmation. Folded into `_source-pack.md` §3f-ii (with §12c cross-reference) and removed from the residual-chase table below. `cid-telemetry-inventory.md` is now the canonical telemetry artifact.
- **G-18 — mostly resolved.** Datasheet and manufacturing email both confirm **TPM 2.0** (Discrete, TCG-certified). With Secure Boot already confirmed disabled, only **measured boot** remains unstated. Datasheet also surfaces additional hardware security features for §8c: NIST-compliant BIOS, BitLocker capability (note: not enabled — G-19 confirms no disk encryption at rest), ThinkShield Secure Wipe, Tamper Switch, Smart USB Protection, Kensington Lock.
- **G-17 — partially resolved.** Datasheet + email give the certification *list* (CE, FCC Class B, RoHS, REACH, WEEE, MIL-STD-810H, BSMI, CCC, CB, ErP Lot 6, Low Halogen, TED). Still missing: **specific certificate numbers / Declaration-of-Conformity documents**, and note **UL is not on the list** (BSMI / CCC / CB instead).
- **G-07 — still open.** Manufacturing did not provide Lenovo org-level security attestations (SOC 2 / ISO 27001). Edison → Bhavani chase continues.
- **New hardware-lifecycle fact (affects §8a + docs Hardware section):** the current SE10 reaches **end of life June 2026**; the **SE10n Gen 2** is its named replacement. **Caveat:** the datasheet's security/certification specs describe the **Gen 2 replacement**, not necessarily the SE10 currently in the field. Before publishing, confirm whether the fielded SE10 carries the same TPM 2.0 + certification set, or whether the Hardware section should be written against the Gen 2 going forward.
- **G-20, G-03 (sub), G-13 (sub) — unchanged**, not addressed by this feedback.

---

## Residual chases

| ID | Topic | Where it surfaces in source pack | Owner | Status / what's still needed |
|---|---|---|---|---|
| G-07 | Lenovo-side OEM security attestations | `_source-pack.md` §8a | **Edison → Bhavani** | 🔴 **Open.** Manufacturing's 2026-06-03 reply did not cover org-level attestations (SOC 2 / ISO 27001 at Lenovo). Still chasing. |
| G-17 | Hardware regulatory certifications | `_source-pack.md` §8a | **Edison → Bhavani** | 🟡 **Partially resolved 2026-06-03.** Cert *list* confirmed from datasheet (CE, FCC Class B, RoHS, REACH, WEEE, MIL-STD-810H, BSMI, CCC, CB, ErP Lot 6, Low Halogen, TED). Still missing: specific certificate numbers / DoC documents. Note: UL not listed. |
| G-18 | TPM 2.0 + measured-boot posture | `_source-pack.md` §8c | **Alok** | 🟡 **Mostly resolved 2026-06-03.** TPM 2.0 (Discrete, TCG-certified) confirmed by datasheet + manufacturing; Secure Boot confirmed **disabled**. Residual: confirm whether **measured boot** is used. |
| G-20 | Modernized Hub VPC architecture diagrams | `_source-pack.md` §10 | **Sunil** | 🔴 **Open.** Re-author the four drawio diagrams in `~/projects/personal/cid-docs/source/` (`1.enterprise-overview.drawio`, `2.cid-internals.drawio`, `3.cid-archicture.drawio`, `4.aws-architecture.drawio`) in a current tool and produce publication-ready exports. |
| G-03 (sub) | Vulnerability-disclosure intake channel | `_source-pack.md` §7e | **PM / Security** | 🔴 **Open.** Documented address/channel for customers and third-party researchers to report suspected vulnerabilities, plus acknowledgement and response timelines. OLAC-5819 noted the broken "Contact Support" email; needs a working replacement. |
| G-13 (sub) | AWS-IoT-side cert detach/deactivate for offline or extracted-cert CIDs | `_source-pack.md` §6 | **PM / Security + AWS ops** | 🔴 **Open.** The `delete_ac` flow (verified in `ac_server/management_api/ac_api.py:1139`) relies on the CID self-wiping when it receives `desired.is_deleted=True` in the IoT shadow; it does not detach or deactivate the X.509 cert in AWS IoT Core. For lost/stolen devices that are offline (or whose cert+key was extracted), an out-of-band AWS-IoT-side detach/deactivate is required. Need a documented operational procedure (who runs it, expected time-to-revoke, audit trail). |

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
