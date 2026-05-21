---
sidebar_position: 3
title: "CID Hub Architecture"
---

# <mark>CID Hub Architecture</mark>

The CID Hub is the Software-as-a-Service (SaaS) control plane that activates CIDs, distributes software and configuration, mediates Agilent-support tunnels, and stores the audit trail of administrative actions. It is delivered exclusively as SaaS on AWS; there is no on-premise or air-gapped Hub. This page describes the Hub's AWS service inventory, multi-tenant isolation model, and region / residency posture. See the [How-to](../howto/onboarding/activate-a-cid) pages for the customer-facing Hub experience (Web UI, APIs). See [Data Flow & Privacy](./data-flow-and-privacy) for the data that crosses the CID ⇄ Hub boundary.

:::note[Diagram placeholder — `hub-aws-architecture.svg`]
Show the production Hub at a service level: customer browser → CloudFront / ALB → API Gateway → Hub backend (Registration API, Management API) → PostgreSQL RDS (private subnet) and AWS IoT Core. Side panel: Cognito user pool, S3 image buckets (origin behind CloudFront for `files.cid.agilent.com`), AWS IoT Secure Tunneling, Tunnel Server EC2 in private subnet. All in `us-east-1`. Source: `source/4.aws-architecture.drawio` (to be modernized).
:::

## AWS service inventory

The Hub is composed of the following AWS services. All are managed by Agilent; customers do not provision or operate any of them.

| Service | Role in the Hub | Customer-visible endpoint |
|---|---|---|
| **AWS Cognito** | User directory and authentication for the Hub Web UI. One user pool per environment, partitioned per tenant at the application layer. | `hub-ac-login.cid.agilent.com` |
| **API Gateway + Lambda / ECS backends** | Registration API (called by CIDs at activation) and Management API (called by the Web UI). | `*.aws.agilent.com` |
| **CloudFront + S3** | Frontend hosting for the Hub Web UI, image / software-bundle distribution to CIDs. | `hub.cid.agilent.com`, `files.cid.agilent.com` |
| **AWS IoT Core** | Message Queuing Telemetry Transport (MQTT) control plane for CIDs. CID ⇄ Hub commands, shadow state, status telemetry. | `*.iot.us-east-1.amazonaws.com` (see [System Requirements](../reference/system-requirements#internet-requirements) for the current hostname) |
| **AWS IoT Secure Tunneling** | On-demand support tunnels to Linux Cockpit / Windows console (Agilent-support approval required). | `data.tunneling.iot.us-east-1.amazonaws.com` (Hub-initiated, CID joins outbound) |
| **EC2 Tunnel Server** | Companion service for the support-tunnel join flow. One instance per environment, fronted by an Application Load Balancer (ALB); security group permits only the ALB ports. | `hub-ac-tunnel.cid.agilent.com` |
| **PostgreSQL on RDS** | Authoritative store for Hub state: customer accounts, users, CID records, software templates, and Activity Log. Encrypted at rest, deployed in a private subnet, not reachable from the public internet. | Internal only |

The corresponding firewall allow-list for CIDs is in [System Requirements → Internet Requirements](../reference/system-requirements#internet-requirements).

## Software delivery from the Hub

Beyond identity, control, and audit, the Hub is the channel through which Agilent delivers a tested software stack to every CID in the field. Updates are produced and validated centrally and then made available to customers through the Hub:

- **Linux and Windows OS updates.** Microsoft KB articles for the embedded Windows 11 VM and Linux package updates for the Oracle Linux host are vetted by Agilent against the CID stack. Approved updates are published to customer environments through the Hub.
- **OpenLab CDS releases.** New CDS releases are published through the Hub after testing against the CID hardware and Windows VM image.
- **Instrument drivers and add-ons.** Drivers and CDS add-ons are version-controlled in software templates and published after compatibility testing.

Each update is tested against the same hardware-plus-software target the customer is running. Customers benefit from a delivery channel where every payload has already been exercised on the device stack it will land on. See [How-to → Apply Software Updates](../howto/updates/apply-updates) for the customer-initiated install flow. See [Audit & Compliance](./audit-and-compliance) for the audit trail and rollback posture.

## Multi-tenancy and isolation

The Hub is a **multi-tenant SaaS**. Each customer organization is a separate **customer account** (tenant) on a shared set of AWS services, with isolation enforced at the application layer:

- **Database scoping.** Every business object (users, CIDs, software templates, audit-log entries) carries a tenant identifier linked to the owning customer account. Backend APIs and the Web UI scope every query by the authenticated user's tenant; queries return only the calling tenant's data.
- **AWS IoT topic scoping.** IoT topic rules and message queues are scoped per environment. CID shadow updates are routed by the IoT Thing name, which embeds the CID's tenant-scoped identifier.
- **Cognito.** A single user pool per environment is partitioned per tenant by a tenant attribute on the user record. A user from one tenant cannot enumerate, view, or act on resources in another tenant.
- **Agilent-internal roles.** A dedicated internal role exists for Agilent support staff. Agilent users have **view-only** access across tenants, **cannot register CIDs or servers on a customer's behalf**, and **cannot approve their own remote-access requests**. Approval requires a customer user.
- **Activity Log scoping.** Customer users see only their own tenant's Activity Log. Agilent users with the appropriate privilege see a global view, also recorded.

The CID device itself does not hold customer-account identifiers in cleartext beyond the operational metadata needed for registration and authentication. User names and emails live on the Hub side in Cognito. See [Data Flow & Privacy](./data-flow-and-privacy) for the device-side data inventory.

## Region and data residency

The production CID Hub is hosted in a single AWS region:

- **Primary region: `us-east-1` (N. Virginia).** All Hub services that touch customer or device data (Cognito, IoT Core, IoT Secure Tunneling, Registration API, Management API, the PostgreSQL data store, the Tunnel Server EC2, and the image bucket origin) run in `us-east-1`.
- **Linux package mirror: `us-west-2` (Oregon).** The CID Linux update channel is served from an S3 bucket in `us-west-2`. This bucket carries only Agilent-built OS packages; it does not hold any customer or device data.
- **Image delivery via CloudFront.** Software images and the Web UI are fronted by Amazon CloudFront (`files.cid.agilent.com`); the origin remains `us-east-1`.

All production CID ⇄ Hub traffic terminates in `us-east-1`.

The CID's network reach is constrained to these endpoints by the firewall allow-list in [System Requirements → Internet Requirements](../reference/system-requirements#internet-requirements). See [Data Flow & Privacy](./data-flow-and-privacy) for the categories of data that travel each path.

## Encryption posture

- **Data in transit.** All CID ⇄ Hub traffic is TLS-encrypted: HTTPS for REST and file transfer, MQTT-over-TLS for the IoT control plane, TLS for IoT Secure Tunneling. CDS-client traffic to the CID is HTTPS / WebSocket Secure (WSS) on the corporate LAN, terminated at the CID's reverse proxy.
- **Data at rest.** The PostgreSQL RDS instance is encrypted at rest. S3 buckets behind CloudFront use server-side encryption. Cognito stores its credential material under AWS-managed encryption.
- **Sensitive fields.** Hub-managed sensitive values (OpenLab Server passwords, rotated device credentials) are encrypted end-to-end: at rest, in the AWS IoT shadow, and in transit. They are masked (`****`) in management-API responses and audit-log views.

## Operational boundary

The Hub services above are **Agilent-operated**. Customers do not deploy, patch, scale, or back up the Hub. AWS account ownership, Identity and Access Management (IAM), networking, OS patching of EC2 (Tunnel Server), and database administration are inside Agilent's operational boundary. The customer-side responsibilities (corporate-firewall egress, CDS clients, OpenLab Server, instrument LAN) are summarized in [Security Model → Shared Responsibility](./security-model#shared-responsibility).

## See also

- [Security Model](./security-model) — trust boundaries between corporate LAN, CID, and Hub; device identity (X.509) and user identity (Cognito).
- [Data Flow & Privacy](./data-flow-and-privacy) — nine-category inventory of what crosses the CID ⇄ Hub boundary, retention, and what does not transit the Hub.
- [Remote Access](./remote-access) — Windows console, Linux Cockpit, and the Agilent-support tunnel flow that uses AWS IoT Secure Tunneling.
- [Audit & Compliance](./audit-and-compliance) — Activity Log retention, integrity, and the CID's relationship to 21 CFR Part 11 and EU GMP Annex 11.
- [System Requirements](../reference/system-requirements) — the customer-facing firewall allow-list and the shared-responsibility table.
