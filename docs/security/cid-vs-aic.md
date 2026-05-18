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
| **Remote management** | Customer's tooling | CID Hub (SaaS) with AWS IoT and AWS Secure Tunneling |
| **Internet requirement** | Optional | Required for activation and maintenance; **not** required for CDS data acquisition |
| **Inbound from the internet** | Customer responsibility | None — outbound TLS only |
| **Hub deployment** | N/A | SaaS only; no on-premise or air-gapped Hub |
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

On a **CID**, all four channels are delivered through the CID Hub:

- **Linux host updates** — Agilent-published Linux package channel.
- **Windows VM updates** — Microsoft KB articles applied to the embedded Windows 11 VM, scheduled or pushed through the Hub.
- **Driver updates** — Agilent instrument drivers, version-controlled per CID via software templates.
- **CDS upgrades** — bundled and pushed centrally.

The Hub is the audit-trail source of truth for what was applied, when, and by whom. Patch policy, vulnerability-response cadence, and rollback posture are documented in [Audit & Compliance](./audit-and-compliance). The customer-facing procedures live under [How-to → Updates](../howto/updates/).

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
- **CID-management identity** (logging into the CID Hub to add a CID, change a network, approve a support session) — provided by **AWS Cognito**, per-tenant, with no SAML / OIDC federation against a customer IdP and no MFA. Details in [Security Model → User identity and authentication](./security-model#user-identity-and-authentication).

## Hub deployment options

The CID Hub is delivered as **SaaS only**. There is no on-premise CID Hub, no air-gapped CID Hub, and no customer-tenant data plane that lives in a customer-controlled cloud account.

If a customer's policy requires an air-gapped or fully on-premise instrument-controller fleet, the **AIC route is the appropriate choice** — the CID model fundamentally depends on the SaaS Hub for activation, patching, identity, and remote management.

For tenant isolation, region, and residency posture on the SaaS Hub side, see [CID Hub Architecture](./cid-hub-architecture).

## Validation and lifecycle

A **CID** ships as a single qualified bundle: Agilent has selected the hardware, hardened the Linux host, built the Windows VM image, installed and version-pinned OpenLab CDS, installed instrument drivers, and run the bundle through Agilent's qualification process. The customer's incoming-qualification surface is smaller — there is no customer-side OS install or driver install to qualify, and the per-device configuration is constrained by software templates managed in the Hub.

An **AIC** gives the customer full control of the OS image, driver versions, and update timing. That control is useful in regulated environments where the customer's own qualification process is the source of truth and changes must be deferred until validation completes; it also means the customer carries the qualification effort for the host stack.

Compliance scope for both deployments is shared with OpenLab CDS itself; the CID's relationship to 21 CFR Part 11, EU GMP Annex 11, SOC 2, and ISO 27001 is covered in [Audit & Compliance](./audit-and-compliance).

## When CID is the right choice

- The lab wants Agilent to own the hardware, OS, patching, and remote-management surface.
- Internet egress to the CID Hub is available (or can be opened to the documented allow-list).
- The instrument controller does not need to be on the customer's Active Directory domain.
- The customer is comfortable with a SaaS management plane (AWS, `us-east-1`).

## When AIC is the right choice

- Policy requires an on-premise or air-gapped instrument-controller fleet.
- The instrument controller must be domain-joined and managed by the customer's endpoint-management tooling.
- The customer prefers to own OS patching, antivirus, and validation cadence on the controller itself.
- Use cases that pre-date CID hardware availability and where re-qualification cost outweighs the operational savings.

The two models can coexist in a single lab: customers commonly run a mix of CIDs (for newer instruments) and AICs (for existing controllers) against the same OpenLab Server.

## See also

- [Security Model](./security-model) — trust boundaries, attack surface, device identity, user identity.
- [CID Hub Architecture](./cid-hub-architecture) — SaaS Hub AWS architecture, tenant isolation, region.
- [Data Flow & Privacy](./data-flow-and-privacy) — what crosses the CID ⇄ Hub boundary.
- [Audit & Compliance](./audit-and-compliance) — patch policy, audit retention, compliance posture.
- [System Requirements](../reference/system-requirements) — networking, internet, hardware, shared responsibility.
