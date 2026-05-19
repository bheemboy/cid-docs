---
sidebar_position: 2
title: "CID vs AIC"
---

# <mark>CID vs AIC</mark>

The CID and the Agilent Instrument Controller (AIC) are two ways to deploy the same OpenLab CDS workload. They are **functionally equivalent**: the CDS-client / OpenLab-Server / instrument-driver experience is the same on either. They differ in *how the instrument controller is delivered, managed, and secured*. This page is the decision aid for IT reviewers choosing between them.

## At a glance

| Trait | AIC (traditional) | CID |
|---|---|---|
| **Host hardware** | Customer-supplied Windows PC | Agilent-supplied fanless IoT appliance (Atom-class, 16 GB RAM, 1 TB SSD, 1:1 instrument-to-device) |
| **Host OS** | Customer-managed Windows | Linux host (Oracle Linux 8) + embedded Windows 11 IoT Enterprise LTSC VM |
| **Domain join (host running AIC software)** | Supported | Not supported on the embedded VM |
| **Patch management** | Customer IT | Agilent CID Hub (Linux host, embedded Windows VM, drivers, CDS) |
| **Remote management** | Customer's tooling | CID Hub (SaaS) with AWS IoT Core and AWS IoT Secure Tunneling |
| **Internet requirement** | Optional | Required for activation and maintenance; **not** required for CDS data acquisition |
| **Inbound from the internet** | Customer responsibility | None — outbound TLS only |
| **Software delivery** | Customer-managed channels (WSUS / SCCM / Intune; vendor media or download for drivers, CDS) | Agilent-operated SaaS Hub on AWS; single tested channel for OS, drivers, CDS |
| **Identity for the management plane** | Customer AD / IdP | AWS Cognito (per-tenant) |
| **Licensing** | Customer-purchased OpenLab CDS + connection licenses | CID Bundle includes OpenLab CDS (2.7+) and two instrument connection licenses |

The rest of this page expands each row.

## Hardware and host

An **AIC** runs on a customer-supplied Windows PC. The customer owns the BIOS, OS image, antivirus, patching cadence, and physical security; AIC is a software package installed on top.

A **CID** is a turnkey hardware appliance. Agilent ships a fanless IoT box with a 1 TB SSD, 16 GB RAM, two gigabit NICs, and a curated software bundle: Oracle Linux 8 host, KVM-hosted Windows 11 IoT Enterprise LTSC VM, OpenLab CDS, instrument drivers, ClamAV, and the CID agent. Each CID supports **one instrument** (1:1 hardware-to-instrument). Virtualization of the CID itself is **not supported**; production deployments must use the bundled hardware.

## Active Directory and Windows policy

The embedded Windows VM on a CID **is not joined to a customer Active Directory domain**, and Group Policy is not applied to it. The VM is an appliance OS, not a productivity desktop, and its administrative credentials are rotated daily by the CID agent (see [Security Model → Posture vs a domain-controlled lab PC](./security-model#posture-vs-a-domain-controlled-lab-pc)).

This applies only to the embedded VM on the CID. It does **not** affect:

- Other (non-CID) instrument controllers a customer chooses to deploy alongside CIDs.
- CDS-client machines, which remain customer-owned and can be domain-joined.
- OpenLab CDS user authentication at the CDS layer (OpenLab Server can still authenticate CDS users against the customer's Active Directory).

An AIC, by contrast, sits on a Windows PC that the customer can domain-join, apply Group Policy to, and manage with the customer's standard endpoint-management tooling.

## Patch management

On an **AIC**, OS patching, antivirus, Windows Update, driver updates, and CDS-version upgrades are the customer's responsibility, using whatever WSUS / SCCM / Intune / endpoint-management tooling the customer already operates.

On a **CID**, all four channels are **made available** through the CID Hub. Nothing is auto-applied or scheduled by Agilent — updates are downloaded onto the CID so the install itself is fast and low-bandwidth, but they are held until an authorized customer user initiates the install from the Hub:

- **Linux host updates** — Agilent-published Linux package channel.
- **Windows VM updates** — Microsoft KB articles for the embedded Windows 11 VM are downloaded to the CID and held for the customer to apply.
- **Driver updates** — Agilent instrument drivers are published per CID via software templates and applied when the customer selects them.
- **CDS upgrades** — released CDS bundles are made available in the Hub for the customer to select and apply.

Because every install is customer-initiated through the Hub, the Hub is the audit-trail source of truth for what was applied, when, and by whom. And because every update is tested by Agilent against the CID's well-known and largely immutable hardware-plus-software stack — rather than against the open universe of custom PC configurations an AIC has to tolerate — the chance of an update breaking a working CID is reduced. Patch policy and rollback posture are documented in [Audit & Compliance](./audit-and-compliance). The customer-facing procedures live under [How-to → Updates](../howto/updates/).

## Network exposure and internet dependency

An **AIC** behaves on the network the way the underlying Windows PC behaves. Inbound exposure, listening services, and firewall configuration are whatever the customer's image makes them; the AIC software itself does not require internet access.

A **CID** has a single, narrow internet posture:

- **No inbound from the public internet** is required or accepted on either NIC.
- **Outbound TLS** to a known set of AWS and Agilent endpoints (`*.agilent.com`, `*.iot.us-east-1.amazonaws.com`, `*.s3.*.amazonaws.com`, Windows-Update endpoints, NTP). The full firewall allow-list is in [System Requirements → Internet Requirements](../reference/system-requirements#internet-requirements).
- **Internet connectivity is required for activation, security updates, and remote management.** CDS data acquisition itself runs entirely on the customer's local network and continues working if the internet path is interrupted — only Hub-mediated functions (updates, support tunnels, status reporting) become unavailable.

## Identity

For an **AIC**, identity is whatever the customer's PC stack provides — typically AD-backed Windows logon plus OpenLab CDS user accounts (which themselves can be AD-backed at the OpenLab Server layer).

For a **CID**, there are two distinct identity planes:

- **CDS-workflow identity** (logging into OpenLab CDS to run samples) — unchanged from AIC; provided by OpenLab Server and can be AD-backed.
- **CID-management identity** (logging into the CID Hub to add a CID, change a network, approve a support session) — provided by **AWS Cognito**, per-tenant. Details in [Security Model → User identity and authentication](./security-model#user-identity-and-authentication).

## Software delivery

For an **AIC**, software arrives through whatever channels the customer's PC operations team already runs. Microsoft and third-party OS updates come through WSUS, SCCM, Intune, or the customer's standard endpoint-management tooling; OpenLab CDS releases and instrument drivers come from Agilent as installable media or downloads and are staged and rolled out by the customer on their own cadence. The customer is the integrator, choosing what to qualify together and when.

For a **CID**, all four streams — Linux host, Windows VM, instrument drivers, and OpenLab CDS — converge into a single channel: the **Agilent-operated SaaS Hub on AWS**. Agilent assembles, tests, and publishes each payload against the CID's known hardware-plus-software target; the customer selects what to apply and when from a single console. The Hub itself is SaaS-only — there is no on-premise or air-gapped Hub option — which is what makes a single tested channel possible across the installed base.

What flows through that channel, and the testing posture behind it, is described in [CID Hub Architecture → Software delivery from the Hub](./cid-hub-architecture#software-delivery-from-the-hub). The customer-side install flow — customer-initiated, audited, never auto-applied — is in [Patch management](#patch-management) above.

## When CID is the right choice

- The lab wants Agilent to provision the hardware and provide a tested, centrally managed software stack — potentially shifting day-to-day controller administration from customer IT to the lab manager rather than to a domain-management team.
- Internet egress to the CID Hub is available (or can be opened to the documented allow-list).
- The instrument controller does not need to be on the customer's Active Directory domain.
- The customer is comfortable with a SaaS management plane (AWS, `us-east-1`).

## When AIC is the right choice

- Policy requires an on-premise or air-gapped instrument-controller fleet.
- The instrument controller must be domain-joined and managed by the customer's endpoint-management tooling.
- The customer prefers to own OS patching, antivirus, and validation cadence on the controller itself.

The two models can coexist in a single lab: customers commonly run a mix of CIDs (for newer instruments) and AICs (for existing controllers) against the same OpenLab Server.

## See also

- [Security Model](./security-model) — trust boundaries, attack surface, device identity, user identity.
- [CID Hub Architecture](./cid-hub-architecture) — SaaS Hub AWS architecture, tenant isolation, region.
- [Data Flow & Privacy](./data-flow-and-privacy) — what crosses the CID ⇄ Hub boundary.
- [Audit & Compliance](./audit-and-compliance) — patch policy, audit retention, compliance posture.
- [System Requirements](../reference/system-requirements) — networking, internet, hardware, shared responsibility.
