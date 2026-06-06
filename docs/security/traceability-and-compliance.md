---
sidebar_position: 6
title: "Traceability and compliance"
---

# <mark>Traceability and compliance</mark>

This page describes how the CID Hub records administrative and operational events, how long those records are retained, what tamper-protection and export options exist, the patch and update logging surface, and the CID's relationship to laboratory-records compliance frameworks (21 CFR Part 11, EU GMP Annex 11).

An important scoping point: the **CID is a deployment model for OpenLab CDS, not a record store for laboratory data**. Sample data is staged transiently on the CID during acquisition and persisted to the **OpenLab CDS Server**, which is the canonical record store. The Part 11 / Annex 11 audit trails, e-signatures, and record retention that those frameworks require are properties of **OpenLab CDS**, not of the CID. The traceability surface this page describes is the **Hub's administrative activity log** (who activated, configured, patched, accessed, or decommissioned which CID) and is separate from CDS-layer record traceability.

## Activity Log

The CID Hub records administrative and operational activity in an **Activity Log** that is the single authoritative source for "who did what, when, to which CID."

| Column | Notes |
|---|---|
| Date / Time | Start time to one-second precision; ordering preserved to millisecond. |
| User | Displayed as "Full Name (USERID)". |
| Description | Human-readable event description. |
| Reason | Mandatory free-text reason for changes to critical fields (see [Reason-for-change](#reason-for-change-on-critical-fields)). |
| Event Category | One of: Additional Hubs, Authentication, CID Activation, CID Administration, CID Device, CID Networking, CID Software, CID Summary, Customer, OpenLab Server Software, OpenLab Server Summary, Software Library. |
| Level | Severity / classification of the event. |

The Activity Log you see is scoped to your own account; every entry already belongs to it.

Recorded event classes include:

- **Authentication**. Logins, explicit logouts, inactivity logouts, session-expiry logouts, sign-in via continue page.
- **User administration**. User add, remove, edit, password reset, invitation.
- **CID lifecycle**. Activation, registration, decommissioning, account move.
- **CID configuration**. Network changes, certificate operations, credential rotation.
- **Software and patching**. Software downloads, installs, upgrades, removals. Each Windows KB article is logged as its own entry.
- **Remote access**. Agilent-support request, approval or rejection, session start, session termination, authorization expiry.
- **Failure / rollback**. Including the AIC-side rollback log entries when an update could not be applied.

Sensitive values (administrative credentials, service secrets, and connection keys) are **masked with `****`** in Activity Log views. DNS server addresses are similarly sanitized.

## Reason-for-change on critical fields

The Hub enforces a **mandatory reason-for-change** on administrative operations. Most actions on a CID's administration pages prompt you to enter a reason before the change is applied. Examples include:

- Editing a CID.
- Editing a registered OpenLab Server.
- Other administrative changes the Hub designates as critical for traceability.

The reason text is recorded alongside the user identity and timestamp in the Activity Log, supporting traceability requirements that compliant laboratories typically apply to administrative changes.

## Integrity of Activity Log entries

Activity Log entries are stored in the Hub's database (RDS, encrypted at rest, deployed in a private subnet that is not reachable from the public internet). The Hub UI and APIs expose Activity Log entries as **append-only** — entries can be searched and viewed but not edited or deleted. Access to the underlying database is restricted by AWS account controls and role-based permissions.

## Retention

The Activity Log is stored centrally in the Hub's database (RDS, encrypted at rest).

- **Online retention: at least 7 years**. The Hub-side Activity Log is retained online (searchable from the Hub UI) for a minimum of seven years.
- **Per-CID local logs** on the device itself are operational diagnostic logs, not the authoritative activity record; the Hub Activity Log is the source of truth.

## Activity Log export

You can search, filter, and view your tenant's Activity Log entries directly in the Hub UI.

When you need the Activity Log delivered as a file (for a compliance review, a regulatory request, or offline retention), **Agilent performs the export on demand** and delivers the tenant-scoped output. Place requests through standard Agilent support channels.

## Patch and update logging

Patching of the CID is mediated entirely by the Hub, and every step is captured in the Activity Log:

- **Windows VM updates**. Each KB article applied to the embedded Windows 11 IoT VM is logged as its own download entry and install entry, separately, so a reviewer can reconstruct exactly which KBs are present on a given CID at a given date.
- **Linux host updates**. Linux package updates delivered from the Agilent-published channel are logged at the update-bundle level.
- **Driver updates**. Driver installs initiated by the Hub (post-registration driver tasks and subsequent driver upgrades) are logged per driver and per CID.
- **CDS upgrades**. Bundle-level upgrades to OpenLab CDS on the CID are logged.

Privileges to import Windows updates into the Hub's update library and to push them to CIDs are gated by separate roles, both recorded in the Activity Log.

## Patch policy and service availability

The contractual service level for the CID Hub is **99% annual System Availability**, defined in the CID Hub end-user licence agreement. Patch delivery follows the published release cadence: Linux host updates, Windows VM updates, driver updates, and CDS upgrades are released multiple times per year through the Hub.

The CID's exposure-reduction posture is structural: the device has no inbound internet exposure (see the [Attack surface](./security-model#attack-surface) section of Security model), the embedded Windows VM is an appliance OS with daily-rotated administrative credentials, and Agilent-support tunnel sessions require per-session approval (see the [AWS IoT Secure Tunneling](./remote-access#aws-iot-secure-tunneling) section of Remote access). Vulnerability reports for the CID or the CID Hub should be sent through standard **Agilent support channels**.

## Compliance posture

### 21 CFR Part 11 / EU GMP Annex 11

The CID does **not** alter the 21 CFR Part 11 / EU GMP Annex 11 posture of OpenLab CDS.

- **Laboratory records** (chromatograms, sequence runs, e-signatures on results, analyst attribution) live on the **OpenLab CDS Server**. The Part 11 / Annex 11 audit trails, e-signature, record-retention, and validation evidence that those frameworks require are properties of **OpenLab CDS**, governed by Agilent's existing regulatory-position documentation for OpenLab CDS.
- The CID itself is a **deployment model** for the CDS instrument-controller workload. Running CDS on a CID, rather than on a customer-owned AIC PC, does not change which system creates, signs, or stores the Part 11 records.
- The Hub-side **Activity Log** described above covers *administrative* events (who activated, patched, configured, or accessed the CID). It complements, but does not replace, the CDS-side Part 11 audit trail.

If you operate in a regulated market, continue to rely on Agilent's OpenLab CDS Part 11 / Annex 11 documentation for the laboratory-records compliance position, and use the Hub Activity Log as the administrative-controls traceability surface for the instrument-controller layer.

### Security framework alignment

The CID Hub is delivered on AWS and inherits the controls of the underlying AWS services that host it. See [CID Hub architecture](./cid-hub-architecture) for the service inventory and the [Encryption posture](./cid-hub-architecture#encryption-posture) section for the in-transit and at-rest controls.

If your procurement process requires a control mapping rather than a single certificate, this documentation set is structured to be mapped directly: trust boundaries and attack surface ([Security model](./security-model)), identity and authentication (the [CID Hub user identity](./security-model#cid-hub-user-identity) section of Security model), network exposure (the [Networking requirements](../reference/system-requirements#networking-requirements) section of System requirements), traceability ([this page](#activity-log)), and remote-access governance ([Remote access](./remote-access)).

### Where laboratory records are protected at rest

Laboratory records are protected at rest on the **OpenLab CDS Server**, which is the canonical store for analytical data, electronic records, and e-signatures. The CID stages sample data transiently to local disk during acquisition and then persists it to the CDS Server. The CDS Server is the appropriate point for at-rest protection of laboratory records under your existing CDS-side controls.

Hub-side data is encrypted at rest on AWS (RDS, S3, Cognito-managed credential material), as described in the [Encryption posture](./cid-hub-architecture#encryption-posture) section of CID Hub architecture.

## See also

- [Security model](./security-model): trust boundaries, attack surface, device and user identity.
- [CID Hub architecture](./cid-hub-architecture): where the Activity Log lives, encryption posture, region.
- [Data flow and privacy](./data-flow-and-privacy): what crosses the CID ⇄ Hub boundary, including the activity-event stream.
- [Remote access](./remote-access): Agilent support session approval, termination, and activity-log surface.
- [Shared responsibility](./security-model#shared-responsibility): what stays your responsibility (CDS-side records, OpenLab Server, instrument LAN).
