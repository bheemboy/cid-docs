---
sidebar_position: 3
title: "CID Hub Architecture"
---

# <mark>CID Hub Architecture</mark>

The CID Hub is the Software-as-a-Service (SaaS) control plane that activates CIDs, distributes software and configuration, mediates Agilent-support tunnels, and stores the audit trail of administrative actions. Agilent hosts and operates the Hub as a fully managed service, and access is included with your CID purchase, so there is no Hub software for you to install, host, patch, or maintain. The Hub is not offered as installable software for on-premise or private-cloud deployment. This page describes the Hub's AWS service inventory, multi-tenant isolation model, and region / residency posture.

![CID Hub production service architecture, drawn bottom-up from the customer browser and CID up through the AWS services to the private-subnet data tier.](../img/hub-aws-architecture.svg)

## AWS service inventory

The Hub is composed of the following AWS services. All are managed by Agilent; customers do not provision or operate any of them.

| Service | Role in the Hub | Customer-visible endpoint |
|---|---|---|
| **Tunnel LB (internet-facing)** | Public entry point for browser-based remote console sessions. Terminates TLS, validates the session cookie, and forwards to the EC2 Tunnel Server in the private subnet. | `hub-ac-tunnel.cid.agilent.com` |
| **Amazon Cognito** | User directory and authentication for the Hub Web UI. One user pool per environment, partitioned per tenant at the application layer. | `hub-ac-login.cid.agilent.com` |
| **CloudFront / ALB** | Front-end hosting for the Hub Web UI and the content-delivery network (CDN) for software images and bundles delivered to CIDs. | `hub.cid.agilent.com`, `files.cid.agilent.com` |
| **Amazon API Gateway** | Front door for the Hub REST APIs, routing requests to the Lambda backend. | `*.aws.agilent.com` |
| **AWS IoT Core** | Message Queuing Telemetry Transport (MQTT) control plane for CIDs. CID ⇄ Hub commands, shadow state, status telemetry. | `*.iot.us-east-1.amazonaws.com` (see [System Requirements](../reference/system-requirements#internet-requirements) for the current hostname) |
| **S3 image buckets** | Origin storage behind CloudFront for the software images and bundles delivered to CIDs. | Behind CloudFront (`files.cid.agilent.com`) |
| **AWS Lambda (Hub backend)** | Serverless backend behind API Gateway: the Registration API (called by CIDs at activation) and the Management API (called by the Web UI). | Behind API Gateway (`*.aws.agilent.com`) |
| **AWS IoT Secure Tunneling** | On-demand support tunnels to Linux Cockpit / Windows console (Agilent-support approval required). | `data.tunneling.iot.us-east-1.amazonaws.com` (Hub-initiated, CID joins outbound) |
| **EC2 Tunnel Server** | Companion service for the support-tunnel join flow, in the private subnet. One instance per environment, reachable only through the Tunnel LB (browser sessions) and the Management API's internal load balancer; its security group permits only the load-balancer ports. It joins the CID's tunnel outbound via AWS IoT Secure Tunneling. | Internal only (private subnet) |
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
- **AWS IoT topic scoping.** IoT topic rules and message queues are scoped per environment. CID shadow updates are routed by the IoT Thing name, which is unique to each CID. Each CID record is linked in the Hub database to its owning customer account, so a CID's IoT traffic resolves to a single tenant.
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
