---
sidebar_position: 6
title: "Audit and compliance"
---

# <mark>Audit and compliance</mark>

This page describes how the CID Hub records administrative and operational events, how long those records are retained, what tamper-protection and export options exist, the patch and update audit surface, and the CID's relationship to laboratory-records compliance frameworks (21 CFR Part 11, EU GMP Annex 11).

An important scoping point: the **CID is a deployment model for OpenLab CDS, not a record store for laboratory data**. Sample data is staged transiently on the CID during acquisition and persisted to the **OpenLab CDS Server**, which is the canonical record store. The Part 11 / Annex 11 audit trails, e-signatures, and record retention that those frameworks require are properties of **OpenLab CDS**, not of the CID. The audit surface this page describes is the **Hub's administrative audit** (who activated, configured, patched, accessed, or decommissioned which CID) and is separate from CDS-layer record audit.

## Activity Log

The CID Hub records administrative and operational activity in an **Activity Log** that is the single authoritative source for "who did what, when, to which CID."

| Column | Notes |
|---|---|
| Date / Time | Start time to one-second precision; ordering preserved to millisecond. |
| User | Displayed as "Full Name (USERID)". |
| Description | Human-readable event description. |
| Reason | Mandatory free-text reason for changes to critical fields (see [Reason-for-change](#reason-for-change-on-critical-fields)). |
| Customer | Tenant the event belongs to. You see only events within your own tenant. |
| Event Category | One of: Additional Hubs, Authentication, CID Activation, CID Administration, CID Device, CID Networking, CID Software, CID Summary, Customer, OpenLab Server Software, OpenLab Server Summary, Software Library. |
| Level | Severity / classification of the event. |

Recorded event classes include:

- **Authentication.** Logins, explicit logouts, inactivity logouts, session-expiry logouts, sign-in via continue page.
- **User administration.** User add, remove, edit, password reset, invitation.
- **CID lifecycle.** Activation, registration, decommissioning, customer move.
- **CID configuration.** Network changes, certificate operations, credential rotation.
- **Software and patching.** Software downloads, installs, upgrades, removals. Each Windows KB article is logged as its own entry.
- **Remote access.** Agilent-support request, approval or rejection, session start, session termination, authorization expiry.
- **Failure / rollback.** Including the AIC-side rollback log entries when an update could not be applied.

Sensitive values (administrative credentials, service secrets, and connection keys) are **masked with `****`** in Activity Log views. DNS server addresses are similarly sanitized.

## Retention

The Activity Log is stored centrally in the Hub's database (RDS, encrypted at rest).

- **Online retention: at least 7 years.** The Hub-side Activity Log is retained online (searchable from the Hub UI) for a minimum of seven years.
- **Per-CID local logs** on the device itself are operational diagnostic logs, not the authoritative audit record; the Hub Activity Log is the source of truth.

## Activity Log export

You can search, filter, and view your tenant's Activity Log entries directly in the Hub UI.

When you need the Activity Log delivered as a file (for an audit, a regulatory request, or offline retention), **Agilent performs the export on demand** and delivers the tenant-scoped output. Place requests through standard Agilent support channels.

## Integrity of Activity Log entries

Activity Log entries are stored in the Hub's database (RDS, encrypted at rest, deployed in a private subnet that is not reachable from the public internet). The Hub UI and APIs expose Activity Log entries as **append-only** — entries can be searched and viewed but not edited or deleted. Access to the underlying database is restricted by AWS account controls and role-based permissions.

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

Privileges to import Windows updates into the Hub's update library and to push them to CIDs are gated by separate roles, both audit-logged.

## Patch policy and service availability

The contractual service level for the CID Hub is **99% annual System Availability**, defined in the CID Hub end-user licence agreement. Patch delivery follows the published release cadence: Linux host updates, Windows VM updates, driver updates, and CDS upgrades are released multiple times per year through the Hub.

The CID's exposure-reduction posture is structural: the device has no inbound internet exposure (see the [Attack surface](./security-model#attack-surface) section of Security model), the embedded Windows VM is an appliance OS with daily-rotated administrative credentials, and Agilent-support tunnel sessions require per-session approval (see the [AWS IoT Secure Tunneling](./remote-access#aws-iot-secure-tunneling) section of Remote access). Vulnerability reports for the CID or the CID Hub should be sent through standard **Agilent support channels**.

## Compliance posture

### 21 CFR Part 11 / EU GMP Annex 11

The CID does **not** alter the 21 CFR Part 11 / EU GMP Annex 11 posture of OpenLab CDS.

- **Laboratory records** (chromatograms, sequence runs, e-signatures on results, analyst attribution) live on the **OpenLab CDS Server**. The Part 11 / Annex 11 audit trails, e-signature, record-retention, and validation evidence that those frameworks require are properties of **OpenLab CDS**, governed by Agilent's existing regulatory-position documentation for OpenLab CDS.
- The CID itself is a **deployment model** for the CDS instrument-controller workload. Running CDS on a CID, rather than on a customer-owned AIC PC, does not change which system creates, signs, or stores the Part 11 records.
- The Hub-side **Activity Log** described above covers *administrative* events (who activated, patched, configured, or accessed the CID). It complements, but does not replace, the CDS-side Part 11 audit trail.

If you operate in a regulated market, continue to rely on Agilent's OpenLab CDS Part 11 / Annex 11 documentation for the laboratory-records compliance position, and use the Hub Activity Log as the administrative-controls audit surface for the instrument-controller layer.

### Security framework alignment

The CID Hub is delivered on AWS and inherits the controls of the underlying AWS services that host it. See [CID Hub Architecture](./cid-hub-architecture) for the service inventory and [Encryption posture](./cid-hub-architecture#encryption-posture) for the in-transit and at-rest controls.

If your procurement process requires a control mapping rather than a single certificate, this documentation set is structured to be mapped directly: trust boundaries and attack surface ([Security Model](./security-model)), identity and authentication ([Security Model → CID Hub user identity](./security-model#cid-hub-user-identity)), network exposure ([System Requirements → Networking](../reference/system-requirements#networking-requirements)), audit ([this page](#activity-log)), and remote-access governance ([Remote Access](./remote-access)).

### Where laboratory records are protected at rest

Laboratory records are protected at rest on the **OpenLab CDS Server**, which is the canonical store for analytical data, electronic records, and e-signatures. The CID stages sample data transiently to local disk during acquisition and then persists it to the CDS Server. The CDS Server is the appropriate point for at-rest protection of laboratory records under your existing CDS-side controls.

Hub-side data is encrypted at rest on AWS (RDS, S3, Cognito-managed credential material), as described in [CID Hub Architecture → Encryption posture](./cid-hub-architecture#encryption-posture).

## See also

- [Security Model](./security-model) — trust boundaries, attack surface, device and user identity.
- [CID Hub Architecture](./cid-hub-architecture) — where the Activity Log lives, encryption posture, region.
- [Data Flow & Privacy](./data-flow-and-privacy) — what crosses the CID ⇄ Hub boundary, including the audit-event stream.
- [Remote Access](./remote-access) — Agilent support session approval, termination, and audit-trail surface.
- [Security Model → Shared Responsibility](./security-model#shared-responsibility) — what stays a customer responsibility (CDS-side records, OpenLab Server, instrument LAN).
