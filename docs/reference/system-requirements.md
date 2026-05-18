---
sidebar_position: 1
title: "System Requirements"
---

# System Requirements

## <mark>Networking Requirements</mark>
![CID NICs](../img/cid-nics.jpg)

Each CID is equipped with two network interfaces:
- **House NIC** – Connects to the corporate LAN and provides access to the OpenLab Server and the internet.
- **Instrument NIC** – Connects to analytical instruments, either directly or via a dedicated instrument LAN/VLAN.

The 12-character MAC address for the "House" NIC and the 8-character PIN are printed on a QR code sticker attached to the device. The PIN is used to link the physical CID with its record in the CID Hub.

![QR code sticker](../img/qr-code.jpg)

<mark>The two-NIC topology is the foundation of the CID's network trust model. Three points an IT reviewer should note before reading the detailed table below:</mark>

- <mark>**No inbound from the internet on either NIC.** Neither NIC accepts unsolicited inbound connections *from the internet*. All CID Hub management and AWS connectivity happens over outbound TLS sessions the CID initiates (see [Internet Requirements](#internet-requirements) below). The House NIC does accept inbound connections from the *corporate intranet* — that is how OpenLab CDS clients reach the CID on TCP 443 (HTTPS / WSS) and how administrators reach the diagnostic UI — but no port on the CID is reachable from outside the customer's firewall.</mark>
- <mark>**The embedded Windows VM is hidden from the corporate LAN.** The OpenLab Instrument Controller software runs in a Windows 11 virtual machine on the CID's Linux host. Corporate clients (OpenLab CDS, browsers) connect to the CID's reverse proxy on TCP 443, which terminates TLS and forwards to the VM internally over the Linux host's KVM bridge. The VM reaches the internet through the Linux host via NAT and is not directly addressable from the House NIC.</mark>
- <mark>**The Instrument NIC is isolated from the WAN and the corporate LAN.** The Windows VM is bridged onto the Instrument NIC through a separate virtual NIC (V-NIC) on the Linux host, putting the VM directly on the instrument network. Most OpenLab drivers initiate the connection from the VM out to the instrument; **GC instrument drivers are an exception** — the GC initiates the connection back to a driver process listening on the V-NIC inside the Windows VM. In either case the Instrument NIC has no default gateway by design — the CID Hub UI labels the gateway field "Gateway Address (Not Recommended)" — so traffic on the instrument network cannot route to the corporate LAN or to the internet. The instrument network is intended to be either a direct cable to one instrument or a dedicated, isolated LAN/VLAN.</mark>

<mark>For the full trust-boundary diagram and threat model, see [Security model](../security/security-model).</mark>

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

---

## <mark>Internet Requirements</mark>

:::info[Firewall Configuration]
Your firewall must be configured to allow outbound communication from CIDs to the domains listed below.
:::

CIDs require an internet connection for activation, security updates, monitoring, and other maintenance activities. Even after initial activation, you must **ensure that the internet remains connected** for applying security updates, time syncing, syncing SSL certificate authorities, and other system maintenance.

**All internet traffic is outbound and CID-initiated.** Every domain listed below is contacted by the CID over an outbound TLS session that the CID opens; no port on the CID is reachable from the internet. (See the [Networking Requirements](#networking-requirements) section above for the full trust-boundary framing.)

### CID Hub and AWS services

| Domain | Direction | Port / Protocol | Purpose |
|---|---|---|---|
| `*.agilent.com` | Outbound | 443 / HTTPS, WSS | CID Hub frontend (`hub.cid.agilent.com`), the Health-page tool, the registration API, and the CloudFront distribution that serves CID images, driver packages, CDS installers, and release notes (`files.cid.agilent.com`). |
| `*.iot.us-east-1.amazonaws.com` | Outbound | 443 / HTTPS, WSS (MQTT-over-WSS) | AWS IoT Core endpoint — device shadow, command/job channel, and telemetry between the CID and the CID Hub. The specific host the CID connects to is `a3cb4mwmdz2oep-ats.iot.us-east-1.amazonaws.com`; customers who prefer a tighter allow-list can substitute that hostname for the wildcard. |
| `data.tunneling.iot.us-east-1.amazonaws.com` | Outbound | 443 / WSS | AWS Secure Tunneling data plane for on-demand remote access (Windows Console and Linux Cockpit), opened only when an authorized CID Hub user initiates a session and closed when that user leaves the CID page. See [Remote Access](../security/remote-access). |
| `agilent-aws-prd-51-ac-images.s3.amazonaws.com` | Outbound | 443 / HTTPS | Direct S3 access to the production image bucket. Required for CIDs running a Linux Update older than **2026.01.12**, which fetch images directly from S3 instead of through the CloudFront distribution served under `*.agilent.com`. |
| `*.s3.us-west-2.amazonaws.com` | Outbound | 443 / HTTPS | Linux package mirror used by the CID's Oracle Linux host (Agilent-hosted ClamAV antivirus definitions and the OL8 third-party RPM repository at `agilent-aws-sbx-51-yum-rpm-repo.s3.us-west-2.amazonaws.com`). |

**Single production region.** The CID Hub runs in **AWS `us-east-1`**, giving every CID and every CID Hub user a single, predictable region to reason about — one location for IoT Core, one location for Secure Tunneling, and a well-defined data-residency posture. The only outbound traffic that leaves `us-east-1` is the Linux package mirror in `us-west-2` (Agilent-hosted antivirus definitions and OL8 packages, listed separately above).

**Image delivery transitioned to CloudFront.** Linux Update **2026.01.12** introduced CloudFront-based image delivery: CIDs on this update or newer fetch CID images, drivers, CDS installers, and release notes through `files.cid.agilent.com` (covered by `*.agilent.com`). CIDs on an older Linux Update continue to fetch directly from the S3 bucket, which is why `agilent-aws-prd-51-ac-images.s3.amazonaws.com` is still listed and must remain reachable until every CID in the fleet is on 2026.01.12 or newer.

### Microsoft Windows Update

| Domain | Direction | Port / Protocol | Purpose |
|---|---|---|---|
| `*.microsoft.com` | Outbound | 443 / HTTPS | Windows Update service. |
| `*.cloudfront.net`, `*.trafficmanager.net`, `*.azurefd.net`, `*.blob.core.windows.net` | Outbound | 443 / HTTPS | CDN, traffic-management, and binary-blob endpoints used by Windows Update and the PowerShell Gallery. |
| `*.oneget.org`, `*.powershellgallery.com` | Outbound | 443 / HTTPS | PowerShell package sources used by the embedded Windows VM. |

The Windows VM reaches these endpoints through the Linux host via NAT on the House NIC; the VM has no separate egress path.

### Time synchronization

| Domain | Direction | Port / Protocol | Purpose |
|---|---|---|---|
| `*.pool.ntp.org` | Outbound | 123 / UDP (NTP) | Public NTP pool used by the CID's chrony service. Accurate time is required for TLS certificate validation, AWS IoT Core authentication, and audit-log timestamps. |

**Behavior when an endpoint is blocked.** The CID does not fail silently; the symptom depends on which endpoint is unreachable.

- **`*.agilent.com` unreachable at boot:** the CID emits boot-time beep codes — 2 beeps when the registration API cannot be reached, 4 beeps for an activated CID that cannot reach the API on bootup. See [**CID-BOOT-01** — Beep Codes on Startup](/cid-boot-01).
- **AWS IoT Core unreachable:** the CID Hub shows the device as **disconnected**. Hub-initiated commands and configuration changes cannot reach the CID until connectivity is restored. Local CDS data acquisition and processing continue unaffected.
- **AWS Secure Tunneling unreachable:** **Windows Console** and **Linux Cockpit** sessions initiated from the CID Hub cannot be opened (or fail mid-session). The device itself stays connected to IoT Core, and local CDS operation is unaffected.
- **S3 or CloudFront unreachable:** image, driver, and CDS package downloads fail with a network error surfaced in the Hub's job/activity log. The CID continues to run with the software it already has.
- **Microsoft Update endpoints blocked:** Windows Update fails inside the VM; the CID continues to run but stops receiving Windows security patches.
- **NTP blocked:** time drift accumulates; eventually TLS handshakes and IoT Core authentication start failing. See [`CID-NET-04` — NTP time-sync failure](/cid-net-04).

The full per-failure troubleshooting set lives under [Troubleshooting](../troubleshooting/cid-connectivity-tester) (`CID-NET-01..06`).

**NOTE: OpenLab CDS does not require internet access for core function of acquiring and processing data from instruments.**

See [Verify CID Internet Connectivity](../troubleshooting/cid-connectivity-tester) for testing connections from CIDs.

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

## <mark>Shared Responsibility for Data Security</mark>

Security is a shared responsibility between Agilent (the vendor) and the customer organization that operates the CID. Agilent secures the CID's software, firmware, network posture, and the CID Hub infrastructure. The customer secures the network in which CIDs and CDS clients operate, the identities used to access them, and the policies and tooling that protect non-CID systems on that network.

| Area | Agilent owns | Customer owns |
|---|---|---|
| **CID host OS, Windows VM, drivers** | OS hardening, image baseline, security patches (Linux Updates and Windows Updates), and driver delivery — all delivered centrally through CID Hub. | Authorizing when updates are applied and reviewing the activity log to confirm they landed. |
| **CID Hub (SaaS) infrastructure** | AWS infrastructure, infrastructure patching, TLS termination, infrastructure monitoring, encryption at rest and in transit, and multi-tenant isolation. | — |
| **Antivirus on the CID** | ClamAV pre-installed, signatures refreshed through the Linux Updates channel, weekly scheduled scans, and detections surfaced in the activity log. | — |
| **CID device identity** | X.509 certificate provisioned at activation, rotated on the Agilent-managed cadence, and revocable through the Hub. | — |
| **CID Hub user identity** | Amazon Cognito user pool per organization; password policy and account-lockout enforced by Cognito; audit logging of admin actions. | Inviting and removing users, assigning roles, and offboarding users when they leave the organization. |
| **Network firewall and segmentation** | — | Configuring the corporate firewall to permit the outbound domains under [Internet Requirements](#internet-requirements), and isolating the Instrument NIC's LAN/VLAN from the corporate WAN and the internet. |
| **Active Directory / corporate identity** | — | All AD or IdP configuration for CDS clients and customer-managed Windows PCs. The CID's embedded Windows VM does not join AD. |
| **CDS client PCs and traditional AICs** | — | OS patching, anti-malware, screen-lock policy, password-cache policy, accurate system clock, and physical access. CID Hub does not manage these systems. |
| **Sample data and lab records** | The CID stages sample data on local disk during acquisition; this copy is transient by design. | The canonical copy of sample data lives on the **OpenLab CDS Server**, which is customer-operated and customer-backed-up. Agilent does not back up CID-local CDS data. |
| **Vulnerability response and updates** | Triaging vulnerabilities affecting CID-delivered components and distributing fixes through Linux Updates, Windows Updates, and driver updates. | Applying delivered updates within the customer's own change-management window. |
| **Audit logs** | Generating and retaining audit records of Hub-side and CID-side actions; surfacing them through the activity-log UI. | Reviewing audit logs as part of the customer's own monitoring or SIEM workflow. |

---

## <mark>Hardware Specification</mark>

The Agilent CID Bundle for OpenLab CDS includes IoT hardware that has been fully tested and qualified to run OpenLab CDS 2.7 and later.

| Component                | CID IoT Hardware for Agilent OpenLab CDS  |
|--------------------------|-------------------------------------------|
| Form Factor              | Fanless IoT device (44 x 151 x 195 mm)    |
| Processor                | Intel Atom 1.9 GHz                        |
| Hard Disk                | 1 TB SSD                                  |
| Memory                   | 16 GB DDR4 3200 SoDIMM                    |
| Graphics                 | Integrated graphics                       |
| Instrument Configuration | 1:1 (one instrument per CID)              |
| Operating Temperature    | 0 to 50 °C                                |
| Power                    | 65 W (adapter included)                   |
| Physical Interfaces      | Dual Gigabit LAN ports (RJ45), 4x USB ports, DisplayPort, HDMI, Mic In, Audio Out, 2x Serial ports (DB9) |

**Manufacturing and provenance.** The CID hardware is currently manufactured by **Lenovo**, with additional qualified hardware suppliers possible over time as Agilent expands the CID program. Agilent builds and tests the gold disk image (Oracle Linux 8 host, the KVM-hosted Windows VM, OpenLab CDS, drivers, and the management agent), then transfers it securely to the manufacturing supplier, which applies the image and delivers the finished CID through Agilent's distribution channel. Customers do not install operating systems or boot media on the CID.

**Device security posture:**

- **Boot integrity is anchored by the Agilent-controlled gold image and the centralized Linux Update channel** rather than by the UEFI Secure Boot chain. The CID is a sealed appliance: the only paths to install or change software on the device are the Agilent-signed update bundles delivered through CID Hub, which gives every CID in the fleet a single, auditable provenance for what is running. UEFI Secure Boot itself is not enabled on the device.
- **Full-disk encryption is not applied on the CID.** The CID is not used as a long-term record store — sample data is staged transiently during acquisition and persisted to the **OpenLab CDS Server** (customer-operated, customer-backed-up), which remains the canonical store and the appropriate point for at-rest protection of laboratory records. On the CID's fanless Atom-class hardware profile, full-disk encryption was also evaluated and not adopted because the encryption overhead would compete with real-time instrument-acquisition throughput. Data-at-rest protection on the CID itself relies on physical security of the device and on the customer's network and access controls; neither the Oracle Linux 8 host nor the embedded Windows VM uses LUKS or BitLocker. See [Shared Responsibility for Data Security](#shared-responsibility-for-data-security).
- **The CID is delivered exclusively as the bundled IoT hardware** configured through CID Hub. Running the CID software on customer-supplied hardware or in a customer-managed hypervisor is not a supported configuration; the qualification, patching, and support model assumes the Agilent-supplied device.

---

## Software Compatibility
The CID Bundle for OpenLab CDS includes IoT hardware from Lenovo that has been fully tested and qualified to run OpenLab CDS 2.7 and later. The CID solution requires the deployment of the bundled IoT hardware as configured within the CID Hub. 
Reference: [Software Compatibility](./compatibility.md)

**Delivery**: CID Hub only (manual installation not supported).

**Virtualization**: Virtualization of CIDs is not supported.

---

## Licensing
The CID Bundle for OpenLab CDS includes the following licensing:
- OpenLab CDS Software (2.7 and later)
- Instrument connection licenses (2)
  - Agilent physical instrument (LC or GC), or
  - Agilent 3D UV/DAD instrument, or
  - Agilent LC/MS or GC/MS

---

## Summary
The Agilent CID provides a standardized, secure, and resilient solution for OpenLab CDS client/server systems. With dual NICs for clear separation of corporate and instrument networks, centralized software configuration via CID Hub, and tested hardware/software bundles, it simplifies deployment while ensuring compliance with enterprise IT and laboratory requirements.
