---
sidebar_position: 6
title: "Traceability and compliance"
---

# Traceability and compliance

This page describes how the CID Hub records administrative and operational events, how long those records are retained, what tamper-protection exists, and how software changes are logged across their lifecycle. The page also discusses how the CID relates to laboratory-records compliance frameworks.

## Activity Log

The CID Hub records administrative and operational activity in an Activity Log that is the single authoritative source for "who did what, when, to which CID."

Logging is automatic and not optional. Every change a user or the system makes is recorded as it happens; there is no setting that turns logging off and no action that bypasses it. When a user modifies an existing entity in the Hub or performs an administrative action on a CID, the Hub also requires a reason for the change before it is applied.

Each entry captures the event timestamp, the acting user, a description of the event, a reason for changes to critical fields, an event category, and a severity level. Together these make every recorded action attributable, time-ordered, and explainable. For the on-screen columns, the full set of category and severity values, and how to view, sort, and filter them, see [View activity logs](../howto/monitoring/view-activity-logs).

Logging spans every class of administrative and operational event:

- **Authentication**. Logins, logouts, inactivity logouts, and session-expiry logouts.
- **User and account administration**. User add, remove, edit, password reset, and account edits.
- **CID activation and lifecycle**. Activation, registration, deletion, factory reset, and CID summary changes.
- **CID administration**. **Allow Changes** toggling, software-inheritance changes, and other administrative actions on a CID.
- **CID networking**. NIC settings (IP, gateway, DNS, subnet) changes.
- **Certificate authorities**. Certificate Authority operations (adding, updating, and removing trusted certificate authorities).
- **Software and patching**. Changes to OS, CDS version, driver, and add-on selections. Software downloads, installs, upgrades, and removals on the CID.
- **OpenLab Server**. Registration and editing of OpenLab Servers.
- **Remote access**. Agilent-support request, approval or rejection, session start, and session termination.
- **Failure and rollback**. Failed downloads, installs, removals, and commands, including the rollback entries on the Analytical Instrument Controller (AIC) when an update could not be applied.

Sensitive values (administrative credentials, service secrets, and connection keys) are masked with `****` in Activity Log views.

### Reason for change

The Hub requires a reason whenever a user changes a critical field of an existing entity or performs an administrative action on a CID. The Hub prompts for the reason before the change is applied, and the change does not proceed until one is entered. Examples include:

- Editing CID configuration.
- Editing a registered OpenLab Server.
- Accessing the Linux Cockpit or the OpenLab CDS Desktop.
- Administrative actions such as rebooting the CID.

The reason text is recorded alongside the user identity and timestamp in the Activity Log, so any administrative change can later be traced to who made it and why. Events the system generates on its own, such as authentication events, carry a system-generated reason rather than a user-entered one.

### Integrity

Activity Log entries are stored in the Hub's database (RDS, encrypted at rest, deployed in a private subnet that is not reachable from the public internet). The Hub UI and APIs expose Activity Log entries as *append-only*: entries can be searched and viewed but not edited or deleted. Access to the underlying database is restricted by AWS account controls and role-based permissions.

### Retention

The Activity Log is stored centrally in the Hub's database (RDS, encrypted at rest).

- **Online retention**. The Hub-side Activity Log is retained online (searchable from the Hub UI) for a minimum of 7 years.
- **Per-CID local logs**. The logs on the device itself are operational diagnostic logs, not the authoritative activity record; the Hub Activity Log is the source of truth.

### Logging across the software-change lifecycle

Most administrative actions, such as editing CID configuration, toggling **Allow Changes**, or rebooting a CID, produce a single Activity Log entry at the moment they happen. Software changes are different: they unfold over time and are logged at each stage, so one change to a CID's software produces a sequence of related entries rather than a single record.

Each stage is recorded in the Activity Log:

1. **Change request**. Administrator selects a software version. Recorded with the acting user, the timestamp, and a description of the action.
2. **Download**. The CID downloads the bits from the Hub. The completed download is recorded automatically as a system-generated entry, and failed download attempts are logged as well.
3. **Install request**. Administrator initiates the installation when ready. Recorded with the acting user, the timestamp, and a description of the action.
4. **Install**. The CID installs the component. On success, the active version on the Software page is updated. The installation is recorded automatically as a system-generated entry.
5. **Failure and rollback**. A failed step is logged, followed by a rollback entry that restores the previously active version.

Because each stage is timestamped and attributable, a reviewer can reconstruct exactly which software versions were selected, applied, or rolled back on a given CID, and when.

## Compliance posture

A CID hosts the OpenLab CDS AIC software in a managed Windows VM, the same software a traditional AIC PC runs. Since a CID runs the identical OpenLab CDS AIC software over the same acquisition-to-server path, deploying CDS on a CID does not change the documented CDS Part 11 / Annex 11 posture.

### 21 CFR Part 11 / EU GMP Annex 11

The regulated records and the controls around them are properties of OpenLab CDS:

- The AIC controls instruments and acquires data; it is not where the regulated laboratory records live. As soon as they are ready, acquired data is transferred to the OpenLab CDS Server, which holds the central records that 21 CFR Part 11 and EU GMP Annex 11 govern.
- The Part 11 / Annex 11 audit trails, e-signature, record-retention, and validation evidence that those frameworks require are properties of OpenLab CDS, governed by Agilent's existing regulatory-position documentation for OpenLab CDS.
- The CID is designed as a drop-in AIC replacement: it runs the same OpenLab CDS software and passes the same instrument-controller validation tests recommended for an AIC, so your established CDS validation and compliance approach continues to apply unchanged.
- The Hub-side Activity Log described above covers *administrative* events (who activated, patched, configured, or accessed the CID). It complements, but does not replace, the CDS-side Part 11 audit trail.

As with any AIC, validating your deployed analytical system remains your organization's responsibility.

## See also

- [Security model](./security-model): trust boundaries, attack surface, device and user identity.
- [CID Hub architecture](./cid-hub-architecture): where the Activity Log lives, encryption posture, region.
- [Data flow and privacy](./data-flow-and-privacy): what crosses between the CID and the Hub, including the activity-event stream.
- [Remote access](./remote-access): Agilent support session approval, termination, and <mark>Activity Log</mark> surface.
- [Shared responsibility](./security-model#shared-responsibility): what stays your responsibility (CDS-side records, OpenLab Server, instrument LAN).
