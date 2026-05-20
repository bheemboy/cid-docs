---
sidebar_position: 6
title: "Audit & Compliance"
---

# <mark>Audit & Compliance</mark>

This page describes how the CID Hub records administrative and operational events, how long those records are retained, what tamper-protection and export options exist, the patch and update audit surface, and the CID's relationship to the laboratory-records compliance frameworks that IT teams typically need to map (21 CFR Part 11, EU GMP Annex 11).

A scoping point up front: the **CID is a deployment model for OpenLab CDS, not a record store for laboratory data**. Sample data is staged transiently on the CID during acquisition and persisted to the **OpenLab CDS Server**, which is the canonical record store. The Part 11 / Annex 11 audit trails, e-signatures, and record retention that those frameworks require are properties of **OpenLab CDS**, not of the CID. The audit surface this page describes is the **Hub's administrative audit** — who activated, configured, patched, accessed, or decommissioned which CID — and is separate from CDS-layer record audit.

## Activity Log

The CID Hub records administrative and operational activity in an **Activity Log** that is the single authoritative source for "who did what, when, to which CID."

| Column | Notes |
|---|---|
| Date / Time | Start time to one-second precision; ordering preserved to millisecond. |
| User | Displayed as "Full Name (USERID)". |
| Description | Human-readable event description. |
| Reason | Mandatory free-text reason for changes to critical fields (see [Reason-for-change](#reason-for-change-on-critical-fields)). |
| Customer | Tenant the event belongs to. Customer users see only their own tenant; Agilent users with the appropriate privilege see all tenants. |
| Event Category | One of: Additional Hubs, Authentication, CID Activation, CID Administration, CID Device, CID Networking, CID Software, CID Summary, Customer, OpenLab Server Software, OpenLab Server Summary, Software Library. |
| Level | Severity / classification of the event. |

Recorded event classes include:

- **Authentication.** Logins, explicit logouts, inactivity logouts, session-expiry logouts, sign-in via continue page.
- **User administration.** User add, remove, edit, password reset, invitation.
- **CID lifecycle.** Activation, registration, decommissioning, customer move.
- **CID configuration.** Network changes, certificate operations, credential rotation.
- **Software & patching.** Software downloads, installs, upgrades, removals — each Windows KB article is logged as its own entry.
- **Remote access.** Agilent-support request, approval or rejection, session start, session termination, authorization expiry.
- **Failure / rollback.** Including the AIC-side rollback log entries when an update could not be applied.

Sensitive values (rotated `agilentac` passwords, OpenLab Server credentials, custom-CA secrets, MQ admin password, CloudWatch keys) are **masked with `****`** in Activity Log views and in shadow-JSON dumps. DNS server addresses are similarly sanitized in log views.

## Retention

The Activity Log is stored centrally in the Hub's PostgreSQL database (RDS, encrypted at rest).

- **Online retention: at least 7 years.** The Hub-side Activity Log is retained online — searchable from the Hub UI — for a minimum of seven years.
- **Per-CID local logs** on the device itself are operational diagnostic logs, not the authoritative audit record; the Hub Activity Log is the source of truth.

## Activity Log export

Customer users can search, filter, and view their tenant's Activity Log entries directly in the Hub UI.

When a customer needs the Activity Log delivered as a file — for an audit, a regulatory request, or offline retention — **Agilent performs the export on demand** through internal tooling and delivers the tenant-scoped output. Requests are placed through standard Agilent support channels.

## Integrity of Activity Log entries

Activity Log entries are stored in the Hub's PostgreSQL database (RDS, encrypted at rest, deployed in a private subnet that is not reachable from the public internet). The Hub UI and APIs expose Activity Log entries as **append-only** from a customer perspective — entries can be searched and viewed but not edited or deleted. Access to the underlying database is restricted to Agilent operations staff under AWS account and IAM controls.

## Reason-for-change on critical fields

The Hub enforces a **mandatory reason-for-change** on critical configuration operations. Examples include:

- Customer account create / edit / delete.
- Add or remove a CID or OpenLab Server from a customer account.
- Changes to fields the Hub designates as critical for traceability.

The reason text is recorded alongside the user identity and timestamp in the Activity Log, supporting traceability requirements that compliant laboratories typically apply to administrative changes.

## Patch and update audit

Patching of the CID is mediated entirely by the Hub, and every step is captured in the Activity Log:

- **Windows VM updates.** Each KB article applied to the embedded Windows 11 IoT VM is logged as its own download entry and install entry, separately, so an auditor can reconstruct exactly which KBs are present on a given CID at a given date.
- **Linux host updates.** Linux package updates delivered from the Agilent-published channel are logged at the update-bundle level.
- **Driver updates.** Driver installs initiated by the Hub (post-registration driver tasks and subsequent driver upgrades) are logged per driver and per CID.
- **CDS upgrades.** Bundle-level upgrades to OpenLab CDS on the CID are logged.

Privileges to import Windows updates into the Hub's update library and to push them to CIDs are gated by separate Hub roles, both audit-logged.

## Patch policy and service availability

The contractual service level for the CID Hub is **99% annual System Availability**, defined in the CID Hub end-user licence agreement. Patch delivery follows the published release cadence — Linux host updates, Windows VM updates, driver updates, and CDS upgrades are released multiple times per year through the Hub.

The CID's exposure-reduction posture is structural: the device has no inbound internet exposure (see [Security Model → Attack surface](./security-model#attack-surface)), the embedded Windows VM is an appliance OS with daily-rotated administrative credentials, and AWS IoT Secure Tunneling sessions require per-session customer approval (see [Remote Access → Agilent support approval flow](./remote-access#agilent-support-approval-flow)). Vulnerability reports for the CID or the CID Hub should be sent through standard **Agilent support channels**.

## Compliance posture

### 21 CFR Part 11 / EU GMP Annex 11

The CID does **not** alter the 21 CFR Part 11 / EU GMP Annex 11 posture of OpenLab CDS.

- **Laboratory records** (chromatograms, sequence runs, e-signatures on results, analyst attribution) live on the **OpenLab CDS Server**. The Part 11 / Annex 11 audit trails, e-signature, record-retention, and validation evidence that those frameworks require are properties of **OpenLab CDS**, governed by Agilent's existing regulatory-position documentation for OpenLab CDS.
- The CID itself is a **deployment model** for the CDS instrument-controller workload. Running CDS on a CID, rather than on a customer-owned AIC PC, does not change which system creates, signs, or stores the Part 11 records.
- The Hub-side **Activity Log** described above covers *administrative* events (who activated, patched, configured, or accessed the CID). It complements — but does not replace — the CDS-side Part 11 audit trail.

Customers operating in regulated markets should continue to rely on Agilent's OpenLab CDS Part 11 / Annex 11 documentation for the laboratory-records compliance position, and use the Hub Activity Log as the administrative-controls audit surface for the instrument-controller layer.

### Security framework alignment

The CID Hub is delivered on AWS and inherits the controls of the underlying AWS services that host it — see [CID Hub Architecture](./cid-hub-architecture) for the service inventory and [Encryption posture](./cid-hub-architecture#encryption-posture) for the in-transit and at-rest controls.

For procurement processes that need a control mapping rather than a single certificate, this documentation set is structured to be mapped directly: trust boundaries and attack surface ([Security Model](./security-model)), identity and authentication ([Security Model → User identity](./security-model#user-identity-and-authentication)), network exposure ([System Requirements → Networking](../reference/system-requirements#networking-requirements)), audit ([this page](#activity-log)), and remote-access governance ([Remote Access](./remote-access)).

### Where laboratory records are protected at rest

Laboratory records are protected at rest on the **OpenLab CDS Server**, which is the canonical store for analytical data, electronic records, and e-signatures. The CID stages sample data transiently to local disk during acquisition and then persists it to the CDS Server; the CDS Server is the appropriate point for at-rest protection of laboratory records under the customer's existing CDS-side controls.

Hub-side data is encrypted at rest on AWS (RDS, S3, Cognito-managed credential material), as described in [CID Hub Architecture → Encryption posture](./cid-hub-architecture#encryption-posture).

## See also

- [Security Model](./security-model) — trust boundaries, attack surface, device and user identity.
- [CID Hub Architecture](./cid-hub-architecture) — where the Activity Log lives, encryption posture, region.
- [Data Flow & Privacy](./data-flow-and-privacy) — what crosses the CID ⇄ Hub boundary, including the audit-event stream.
- [Remote Access](./remote-access) — Agilent support session approval, termination, and audit-trail surface.
- [System Requirements → Shared Responsibility for Data Security](../reference/system-requirements#shared-responsibility-for-data-security) — what stays a customer responsibility (CDS-side records, OpenLab Server, instrument LAN).
