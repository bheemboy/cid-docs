---
sidebar_position: 1
title: "System Requirements"
---

# System Requirements

## Networking Requirements
![CID NICs](../img/cid-nics.jpg)

Each CID is equipped with two network interfaces:
- **House NIC** – Connects to the corporate LAN and provides access to the OpenLab Server and the internet.
- **Instrument NIC** – Connects to analytical instruments, either directly or via a dedicated instrument LAN/VLAN.

The 12-character MAC address for the "House" NIC and the 8-character PIN are printed on a QR code sticker attached to the device. The PIN is used to link the physical CID with its record in the CID Hub.

![QR code sticker](../img/qr-code.jpg)

| Component	| CID Networking |
| --- | --- |
| **House NIC** | **Connects to corporate LAN and internet** |
| - *Internet outbound* |	See “[Internet Requirements](#internet-requirements)” section below. |
|	- *Internet inbound* | No inbound communication from the internet is required. |
| - *Intranet outbound*	| DHCP, DNS, HTTPS, ICMP (to OLSS, OpenLab Server), HTTP/HTTPS (to ECM 3.x), and SMB (optional). |
| - *Intranet inbound* | ICMP, HTTPS (for various services like Acquisition Server and diagnostics), and SSH (for troubleshooting). |
| **Instrument NIC** | **Connects to Instrument** |
| - *Internet outbound* | No outbound communication to the internet is required. |
| - *Internet inbound* | No inbound communication from the internet is required. |
| - *Intranet outbound* | Acquisition Server to Instrument communication (instrument-specific port requirements); isolated and unrestricted communication is recommended. |
| - *Intranet inbound* | Instrument to Acquisition Server communication (instrument-specific port requirements); isolated and unrestricted communication is recommended. |

*Also see [Security model → Two-NIC trust topology](../security/security-model#two-nic-trust-topology).*

---

## <mark>Internet Requirements</mark>

:::info[Firewall Configuration]
Your firewall must be configured to allow outbound communication from CIDs to the domains listed below.
:::

CIDs require an internet connection for activation, security updates, monitoring, and other maintenance activities. Even after initial activation, you must **ensure that the internet remains connected** for applying security updates, time syncing, syncing SSL certificate authorities, and other system maintenance. That said, **OpenLab CDS does not require internet access for its core function of acquiring and processing data from instruments** — if the internet path is interrupted, local CDS acquisition and processing continue; only Hub-mediated functions (updates, support tunnels, status reporting) become unavailable.

**All internet traffic is outbound and CID-initiated.** Every domain listed below is contacted by the CID over an outbound TLS session that the CID opens; no inbound internet connection is required for the CID to function.

### CID Hub and AWS services

| Domain | Direction | Port (Protocol) | Purpose |
|---|---|---|---|
| `*.agilent.com` | Outbound | **443** (HTTPS, WSS) | Registration API contacted by the CID at activation, and the CloudFront distribution at `files.cid.agilent.com` from which the CID fetches CID images, driver packages, and CDS installers. |
| `*.iot.us-east-1.amazonaws.com` | Outbound | **443** (HTTPS, WSS / MQTT-over-WSS) | AWS IoT Core endpoint — device shadow, command/job channel, and telemetry between the CID and the CID Hub. The CID currently connects to `a3cb4mwmdz2oep-ats.iot.us-east-1.amazonaws.com`; because this specific hostname is subject to change over time, we recommend allow-listing the `*.iot.us-east-1.amazonaws.com` wildcard for a stable, long-lived rule. |
| `data.tunneling.iot.us-east-1.amazonaws.com` | Outbound | **443** (WSS) | AWS Secure Tunneling data plane. The CID joins as the tunnel destination endpoint when a Hub user starts a Windows Console or Linux Cockpit session, and disconnects when the session ends. See [Remote Access](../security/remote-access). |
| `agilent-aws-prd-51-ac-images.s3.amazonaws.com` | Outbound | **443** (HTTPS) | Legacy image fetch path. CIDs running a Linux Update older than **2026.01.12** download CID images from this S3 bucket. Newer CIDs use CloudFront distribution under `*.agilent.com` endpoint. |
| `*.s3.us-west-2.amazonaws.com` | Outbound | **443** (HTTPS) | Linux package mirror used by the CID's Oracle Linux host — Agilent-hosted ClamAV antivirus definitions and the OL8 third-party RPM repository. The repository currently lives at `agilent-aws-sbx-51-yum-rpm-repo.s3.us-west-2.amazonaws.com`; because this specific hostname is subject to change over time, we recommend allow-listing the `*.s3.us-west-2.amazonaws.com` wildcard for a stable, long-lived rule. |

**Single production region.** The CID Hub runs in AWS `us-east-1`, giving every CID and every CID Hub user a single, predictable region to reason about — one location for IoT Core, one location for Secure Tunneling, and a well-defined data-residency posture. The only outbound traffic that leaves `us-east-1` is the Linux package mirror in `us-west-2` (Agilent-hosted antivirus definitions and OL8 packages, listed separately above).

**Image delivery transitioned to CloudFront.** Linux Update **2026.01.12** introduced CloudFront-based image delivery: CIDs on this update or newer fetch CID images, drivers, and CDS installers through `files.cid.agilent.com` (covered by `*.agilent.com`). If your fleet includes any CID still on a Linux Update older than 2026.01.12, also keep `agilent-aws-prd-51-ac-images.s3.amazonaws.com` reachable so those CIDs can continue to fetch images.

### Microsoft Windows Update

| Domain | Direction | Port (Protocol) | Purpose |
|---|---|---|---|
| `*.microsoft.com` | Outbound | **443** (HTTPS) | Windows Update service. |
| `*.cloudfront.net`, `*.trafficmanager.net`, `*.azurefd.net`, `*.blob.core.windows.net` | Outbound | **443** (HTTPS) | CDN, traffic-management, and binary-blob endpoints used by Windows Update and the PowerShell Gallery. |
| `*.oneget.org`, `*.powershellgallery.com` | Outbound | **443** (HTTPS) | PowerShell package sources used by the embedded Windows VM. |

The Windows VM reaches these endpoints through the Linux host via NAT on the House NIC; the VM has no separate egress path.

### Time synchronization

| Domain | Direction | Port (Protocol) | Purpose |
|---|---|---|---|
| `*.pool.ntp.org` | Outbound | **123** (NTP, UDP) | Public NTP pool used by the CID's chrony service. Accurate time is required for TLS certificate validation, AWS IoT Core authentication, and audit-log timestamps. |

### Behavior when an endpoint is blocked

The CID does not fail silently; the symptom depends on which endpoint is unreachable.

- **`*.agilent.com` unreachable at boot:** the CID emits boot-time beep codes — 2 beeps when the registration API cannot be reached, 4 beeps for an activated CID that cannot reach the API on bootup. See [**CID-BOOT-01** — Beep Codes on Startup](/cid-boot-01).
- **AWS IoT Core unreachable:** the CID Hub shows the device as **disconnected**. Hub-initiated commands and configuration changes cannot reach the CID until connectivity is restored. Local CDS data acquisition and processing continue unaffected.
- **AWS Secure Tunneling unreachable:** **Windows Console** and **Linux Cockpit** sessions initiated from the CID Hub cannot be opened (or fail mid-session). The device itself stays connected to IoT Core, and local CDS operation is unaffected.
- **S3 or CloudFront unreachable:** image, driver, and CDS package downloads fail with a network error surfaced in the Hub's job/activity log. The CID continues to run with the software it already has.
- **Microsoft Update endpoints blocked:** Windows Update fails inside the VM; the CID continues to run but stops receiving Windows security patches.
- **NTP blocked:** time drift accumulates; eventually TLS handshakes, IoT Core authentication, and CDS client/server setup against the OpenLab Server start failing. See [`CID-NET-04` — NTP time-sync failure](/cid-net-04).

For symptoms and connectivity tests, see [Troubleshooting → Verify CID Internet Connectivity](../troubleshooting/cid-connectivity-tester) (`CID-NET-01..06`).

---

## DHCP and DNS Requirements
-  **House Network**
    -  When first connected, CID's **house** network uses DHCP to acquire an IP address, DNS servers, and DNS search strings. After activation, a static configuration can be applied to house network.
    -  Upon activation, the CID updates its hostname from the factory default (`agilent-cid`) to the name specified in the CID Hub, then reboots.
    -  If your DHCP servers support dynamic DNS registration (RFC 2136) for Linux systems, DHCP server will register the CID hostname automatically with the DNS server.
    -  Otherwise, the desired CID hostnames must be explicitly registered in DHCP and DNS using the device's "house" MAC address (printed on the QR code label).
    -  During activation, the CID validates name resolution using `nslookup 'hostname'`.
    -  CDS clients **must** resolve CID hostnames to their IP addresses for proper operation.
-  **Instrument Network**
    -  By default instrument networks are also configured to use DHCP. After activation, a static configuration can be applied to the instrument network.

---

## SSL Certificate Requirements for HTTPS

### ECM 3.x
To successfully run an ECM 3.x server over HTTPS in an environment with CIDs, you must use a **publicly trusted SSL certificate**.
Certificates issued by internal, corporate, or self-signed certificate authorities (CAs) are not recognized by CIDs.

### ECM XT / OpenLab Server
Certificates issued by internal, corporate, or self-signed certificate authorities (CAs), as well as publicly trusted certificates, may be used for running ECM XT / OpenLab Servers over HTTPS in an environment with CIDs.

:::info[Note]
1. Self-generated certificates (internal/corporate CAs and self-signed) must include the Authority Information Access (AIA) extension with URLs that provide access to the root and any intermediate certificates. Self-generated certificates without proper AIA configuration may not function correctly.
2. Enterprise PKI infrastructure such as Microsoft AD CS, commercial PKI management platforms (e.g., Venafi, DigiCert), or cloud-based solutions (e.g., AWS ACM Private CA) can be configured to include AIA extensions automatically.
3. Publicly trusted certificates do not require AIA as their roots are pre-installed in CID’s trust stores.
:::

---

## Optional Network Share
CIDs optionally support using an SMB (Server Message Block) share accessible over the local LAN. In environments with many CIDs, this helps optimize performance and reduce internet bandwidth requirements.
This SMB share must be reachable from the device with at least read permissions to fetch required files. 
If write access is granted as well, the device can automatically copy downloaded files into the share, making them available for other devices, thus helping to avoid repeated downloads.
- CIDs can access a shared SMB folder over the LAN.
- **Full access (recommended)**: Cache downloaded CDS VM images for other CIDs to use.
- **Read access**: Use cached CDS VM images from the network share instead of downloading them from the CID Hub.
- This is configurable during OpenLab Server registration or later via the CID Hub.

:::info[Note]
1. After making changes to server settings, CIDs must be rebooted for the changes to take effect.
2. The User Principal Name (UPN) format is recommended for usernames (e.g., `username@domain.com`).
:::


---

## Supported Topologies

### 1. Direct Instrument Connection
- The Corporate NIC connects to the corporate LAN.
- The Instrument NIC connects directly to the instrument.
- Example: The instrument is set to a static IP of `192.168.1.2`, and the CID Instrument NIC is set to `192.168.1.3`.

![Direct instrument connection](../img/direct-instrument-connection.jpg)

### 2. Instrument LAN/VLAN Connection
- The Corporate NIC connects to the corporate LAN.
- Instruments and the CID are placed on a dedicated LAN or VLAN.
- Instrument IP assignment may be DHCP or static.

![Instrument LAN/VLAN Connection](../img/instrument-lan-connection.jpg)

---

## <mark>Security Requirements</mark>

Security on a CID deployment is a shared responsibility between Agilent and the customer. The list below is the customer-facing half — the concrete security obligations a customer organization must satisfy for the deployment to be sound. For the full Agilent-owns / customer-owns split and the reasoning behind it, see [Security Model → Shared Responsibility](../security/security-model#shared-responsibility).

- **Network firewall and segmentation.** Configure the corporate firewall to permit the outbound domains under [Internet Requirements](#internet-requirements), and isolate the Instrument NIC's LAN/VLAN from the corporate WAN and the internet.
- **Physical security of the CID.** Restrict physical access to the device. Full-disk encryption is not applied on the CID, so physical and network controls are the primary at-rest protection on the device itself.
- **Hub user lifecycle.** Invite and remove CID Hub users, assign roles, and offboard users when they leave the organization.
- **Active Directory / corporate identity.** Manage AD or IdP configuration for CDS clients and other customer-managed Windows PCs. The CID's embedded Windows VM does not join AD.
- **Update authorization.** Authorize when Agilent-delivered updates (Linux, Windows, drivers, CDS) are applied within your change-management window, and confirm via the activity log that they landed.
- **CDS client PCs and traditional AICs.** OS patching, anti-malware, screen-lock policy, password-cache policy, accurate system clock, and physical access — CID Hub does not manage these systems.
- **Sample-data retention and backup.** The true record of sample data lives on the **OpenLab CDS Server**, which is customer-operated and customer-backed-up. Agilent does not back up CID-local CDS data.
- **Audit-log review.** Incorporate the CID Hub activity log into your own monitoring, review, or SIEM workflow.
- **Approval of Agilent support requests.** When an Agilent engineer requests remote access to a CID for troubleshooting, a Hub user at the customer site must approve or decline the request and close the session when work is complete.

