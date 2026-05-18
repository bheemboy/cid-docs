# CID Security Doc — Source Pack
Generated: 2026-05-13
Purpose: raw inputs for the rebuild of Agilent pub 5994-7490EN ("Security and Hardware Features: Agilent Connected Instrument Device (CID) for OpenLab CDS", May 2024). Cited by file path. Verbatim quotes use `>` blockquotes; paraphrases are prefixed with `—`. Source-of-truth feed to Phase 2.2 prose drafting; section structure mirrors the target document outline.

---

## 0. Original document (verbatim)

Reproduced from `/tmp/security-pdf.txt` (184 lines). Light formatting only; line breaks may differ from the typeset PDF.

> **Technical Overview — Security and Hardware Features: Agilent Connected Instrument Device (CID) for OpenLab CDS**
>
> **Authors:** Alok Mishra, Sunil Rehman, Mike Kicinski, Edison X Cerda — Agilent Technologies, Inc.
>
> **Abstract**
> The Agilent Connected Instrument Device (CID) solution and the CID Hub offers a new deployment model for client-server configurations running OpenLab CDS AICs. The solutions delivers an IoT device with pre-installed software & drivers (i.e. CID) and a SaaS-based multitenant web application (i.e. CID Hub) that centralizes the deployment, management, and troubleshooting of the AICs in the client-server configuration. Additionally, the solution includes security features that simplify IT management workflows and offer resiliency & redundancy benefits for instrument control and data acquisition.
>
> The Agilent Connected Instrument Device (CID) for Agilent OpenLab CDS is an instrument control device that allows analytical instruments to be controlled by the OpenLab CDS clients, and can be managed remotely. The CDS clients access the device over the customer's intranet to operate the instruments controlled by the device.
>
> This technical overview addresses the security measures built into the CID in support of both its operation of instruments under control of a CDS client and its remote (cloud) management and deployment features.
>
> **Network deployment diagram**
>
> The CID is a component of a client-server OpenLab CDS deployment. It is functionally equivalent to the Agilent OpenLab Analytical Instrument Controller (AIC). Rather than installing software on a Microsoft Windows PC, the CID is a turnkey Internet of Things (IoT) device that can be managed remotely and deployed using an Agilent-hosted cloud-based CID Hub. Figure 1 shows a distributed OpenLab CDS deployment including both a CID and an AIC. Although CIDs and AICs have many similarities, only CIDs have the connectivity features that make it visible and accessible in the Agilent CID Hub.
>
> As shown in Figure 1, CIDs have two network interfaces: one connected to the corporate Wide Area Network (WAN) and CID Management Hub (via the internet), the other connected to a private lab/instrument Local Area Network (LAN) or directly to an instrument.
>
> A detailed network connectivity diagram including components and interfaces described in subsequent sections of this document is described here.
>
> **Outgoing endpoints**
>
> The following URL(s) will need to be whitelisted in the local network for CIDs to be able to connect to the CID Hub:
>
> 1. `*.cid.agilent.com`
>    - Registration APIs are used by CIDs to communicate with the Hub and query for its configuration and settings information. CIDs also update their status on the Hub using these APIs.
>    - IoT commands and tasks issued to CIDs from the Hub webpages (like "install a driver") are sent to the corresponding CID via the Agilent AWS IoT core service. CIDs connect to the IoT Core Service to look for messages.
>    - The Agilent AWS S3 bucket stores installation files and release notes related to CDS, drivers, and both Microsoft Windows and Linux updates.
> 2. `Data.tunneling.iot.AWS_REGION.amazonaws.com`, i.e. `Data.tunneling.iot.us-west-2.amazonaws.com`
>    - Secure tunneling proxy service to establish bidirectional communication to CID over a secure connection that is managed by AWS IoT.
>    - `AWS_REGION` can be found at `https://hub.cid.agilent.com/health` under the IOT section.
>
> **Operational interfaces**
>
> All incoming and outgoing connections to the CID from CDS clients are on TCP port 443 and are standard HTTPs or Secure Web Socket (WSS) connections. These are shown as dashed black lines in Figure 2. These are the same operational interfaces exposed by an AIC running in Windows, but the CID is not a Windows PC. Instead, the CID is an IoT device that natively runs a version of Linux. A network scan of the CID shows only a single (Linux) IP address with only port 443 open. CDS client connections are served by an embedded Windows virtual machine (VM) that does not have an IP address visible to the corporate WAN. The CID Reverse Proxy component (shown in Figure 1) acts as a firewall, shielding the Windows VM from all incoming network traffic except connections from CDS clients. Outbound network connections from the CID to the backend CDS components use a reverse proxy mechanism which makes the source IP address for these connections be the IP address of the Linux system. The operating system (OS) for the Windows VM is Windows 10 IoT Enterprise LTSC, which is Microsoft's OS for IoT appliances that do not require domain policies, and where no Windows updates are required to be managed by IT. This can be centrally handled by the Agilent CID Hub Management system. Running the Windows system as a VM that does not have an IP address visible to the corporate network adds a layer of protection.
>
> Network connections from the Windows VM to instruments use a separate virtual network interface card (V-NIC) in the Windows VM which is passed through the Linux OS to the instrument network. This arrangement directly exposes the Windows VM's IP address for this network to instruments, but this network interface is meant to be either directly connected to an instrument or to an instrument network that has no external exposure (i.e. no internet access).
>
> **Connected Instrument Device (CID) Hub for OpenLab CDS**
>
> Agilent CID Hub is a multitenant cloud web application where each tenant has a separate and isolated account. Users log into their account on the website to manage CIDs and additional users. Agilent CID support personnel have only view access to CIDs in the account. Logins to the account are authenticated using AWS's Cognito service.
>
> The CID Hub website also registers and activates CID devices. When a CID connects to the internet for the first time, it attempts to register with the CID Hub using REST APIs. As part of the registration process, a unique X.509 IoT device certificate is generated and downloaded to the device. This certificate is then used to connect to the CID Hub, which uses the AWS IoT infrastructure. Only standard HTTPs and Secure Web Socket outbound connections are made from the CID to the CID Management hub. If the corporate firewall restricts outbound connections to these endpoints, the CID will not be able to connect, and will not be able to be managed using the CID Hub. All connections from the device to the Hub are TLS encrypted. Please refer to the section on outgoing endpoints for additional information. CIDs do not require any inbound communication from the CID Hub and are not exposed to the internet.
>
> This IoT connection from the CID to the CID Hub is not necessary for using CDS (i.e., instrument control, running samples, etc.). The IoT connection is required for managing CIDs from the CID Hub. These connections are shown as green dashed lines in Figure 2.
>
> **Window Virtual Machine Console**
>
> The CID Hub supports the ability for users to access the Windows console of the embedded Windows virtual machine for troubleshooting purposes and in cases when CDS failover is required. Users can access the Windows desktop of the virtual machine by logging in using the user ID and password provided on the CID Hub. The password for this user is automatically recycled once per day (this process is executed only if the CID is connected to the CID Hub).
>
> When a user is within the same network as the CID, they can access the Windows console from the CID Hub via the local network, using a web browser. They can also access it by typing the following URL into a browser: `https://CID-FQDN-or-ip-address/aic-windows-desktop`. To log into Windows, the user still needs to retrieve the Windows user ID and password from the Hub and to enter it in the Windows login dialog box.
>
> When a user is not within the same network as the CID, the CID Hub provides access to the Windows console via IoT tunneling. Once the IoT tunnel is active, the user can access the Windows console of the embedded Windows VM after logging in with the local Windows username and password.
>
> If Agilent support needs to access the Windows console, they initiate a request from the CID Hub which then needs to be explicitly approved or rejected by an authorized user in your account. Agilent support can access the Windows console only when approved by an authorized user.
>
> Only authorized users as mentioned above are allowed to initiate and access the console, which is only accessible while they remain logged in and on the CID page (CID from which the session is initiated) on the CID management hub. These IoT connections are shown as red dashed lines in Figure 2. These connections are Secure Web Socket connections established from the CID to the CID Hub. Technical details about AWS Secure Tunneling are available at `https://docs.aws.amazon.com/iot/latest/developerguide/secure-tunneling.html`. Users can see if IoT connections are active from the CID Hub, and can terminate any active connection.
>
> **Linux Cockpit**
>
> Linux Cockpit (`https://cockpit-project.org/`) is a web-based management interface to the Linux OS of the CID, and is provided for troubleshooting purposes. This interface can be accessed only by administrators in your account. Agilent support can also access it after initiating a request from the CID Hub and getting approval from an administrator in your account. Linux Cockpit also requires a user ID and password, which is provided on the CID Hub. This password also is recycled once per day.
>
> When an administrator is within the same network as the CID, they can access Linux Cockpit from the CID Hub via the local network using a web browser. They can also access it by typing the following URL into a browser: `https://CID-FQDN-or-ip-address/ac-cockpit`. To log in, the administrator still needs to retrieve the user ID and password from the Hub and use it to log into Cockpit.
>
> When the administrator is not within the same network as the CID, the CID Hub provides access to Linux Cockpit via IoT tunneling. Once the IoT tunnel is active, the administrator can access the Linux Cockpit after logging in with the user ID and password retrieved from the CID Hub.
>
> Only authorized users as mentioned above are allowed to initiate and access Linux cockpit, which is only accessible while they remain logged in and on the CID page (CID from which the session is initiated) on the CID management hub.
>
> **Connected Instrument Device (CID) Hub Health Page**
>
> The CID Hub Health page is a network connectivity and performance assessment tool and is accessible at `https://hub.cid.agilent.com/health`. This tool attempts to connect to the CID hub and reports if connections are "OK" or there are any connectivity issues. It also measures network performance and reports whether or not the performance is acceptable.
>
> **Connected Instrument Device (CID) Hardware**
>
> The CID hardware is an IoT device that comes ready for instrument connectivity with pre-installed Operating System (OS) and OpenLab CDS software. For more details, contact your local Agilent sales representative.
>
> **Publication details:** DE36839239 — © Agilent Technologies, Inc. 2024 — Printed in the USA, May 24, 2024 — `5994-7490EN`.

---

## 1. Deployment model (IT Qs 1–6)

### 1a. CID vs AIC parallels and differences

- `/tmp/security-pdf.txt:37-48` — "The CID is a component of a client-server OpenLab CDS deployment. It is functionally equivalent to the Agilent OpenLab Analytical Instrument Controller (AIC). Rather than installing software on a Microsoft Windows PC, the CID is a turnkey Internet of Things (IoT) device that can be managed remotely and deployed using an Agilent-hosted cloud-based CID Hub… only CIDs have the connectivity features that make it visible and accessible in the Agilent CID Hub."
- `notes/device-base-system-hardware.md:127-146` (DEV-EN-005, CID Hardware Specification) — "Form Factor: Fanless IoT device (44 x 151 x 195 mm); Processor: Intel Atom 1.9 GHz; Hard Disk: 1 TB SSD; Memory: 16 GB DDR4 3200 SoDIMM; Instrument Configuration: 1:1 (one instrument per CID); Power: 65 W; Physical Interfaces: Dual Gigabit LAN (RJ45), 4x USB, DisplayPort, HDMI, Mic In, Audio Out, 2x Serial (DB9)."
- `notes/device-base-system-hardware.md:115-122` (DEV-EN-004) — "SE10: 12 GB RAM allocated to Windows KVM (customer-facing hardware); 1 TB SSD required for the qualified customer-facing CID bundle."
- `notes/device-base-system-hardware.md:742-751` (DEV-BR-035, CID Licensing Bundle) — "The CID Bundle for OpenLab CDS includes OpenLab CDS Software (2.7 and later) and two instrument connection licenses for Agilent physical instruments (LC or GC), Agilent 3D UV/DAD instruments, or Agilent LC/MS or GC/MS."

### 1b. Mandatory vs optional / hardware constraint

- `notes/device-base-system-hardware.md:728-739` (DEV-BR-034, CID Virtualization Not Supported) — "Virtualization of CIDs is not supported. The CID solution requires deployment of the bundled IoT hardware." Customer-facing production must use the bundled IoT hardware; VM-based CID instances exist only in dev/QA.
- Plan-supplied policy note (`proposals/security-doc-rebuild-plan.md:74-75`) — "On-premise / air-gapped Hub: not supported for CID. Frame neutrally — CID is one deployment option, not the only one. Customers who require on-premise control, AD domain membership, or full network isolation can choose the traditional AIC route (Windows PCs with AIC software)."

### 1c. Windows / Active Directory integration posture

- `/tmp/security-pdf.txt:91-98` — "The operating system (OS) for the Windows VM is Windows 10 IoT Enterprise LTSC, which is Microsoft's OS for IoT appliances that do not require domain policies, and where no Windows updates are required to be managed by IT. This can be centrally handled by the Agilent CID Hub Management system."
- ⚠️ **Accuracy update (2026-05-15, confirmed via engineering):** The Windows VM guest OS is being migrated to **Windows 11**; all new CID ghost images and going-forward production builds use Windows 11. The Windows 10 IoT Enterprise LTSC reference above is from the May 2024 PDF and is historical. Documentation prose must say "Windows 11" without qualifying it as a transition, since CIDs already shipping use it. Domain-membership and Group-Policy posture (below) is unchanged across the OS transition.
- **Confirmed stance (answered via Phase 1.3 G-10):** The embedded Windows VM on the CID **must not be joined to a customer Active Directory domain**, and Group Policy is not applied to it. This is a deliberate Agilent posture, not an implementation gap.
- This does **not** preclude the customer from running other (non-CID) CDS systems joined to AD, nor does it prevent **OpenLab CDS user authentication from being backed by AD** at the CDS layer. Identity for the CDS workflow comes from OpenLab CDS itself (OLSS server); CID-Hub identity is independent (Cognito for customer users; see §5).

### 1d. Validation boundary and lifecycle simplification

- `notes/device-base-system-hardware.md:714-722` (DEV-BR-033, Internet Connection Required for Maintenance) — "CIDs require an internet connection for activation, security updates, monitoring, and other maintenance activities… OpenLab CDS does not require internet access for the core function of acquiring and processing data from instruments."
- `notes/device-base-system-hardware.md:657-670` (DEV-BR-030, Ghost Images Include Current Linux Update) — Pre-built FR1.2+ ghost images ship with current Linux update embedded → reduces post-manufacturing update need.
- — Paraphrase: CID is purpose-built; the OS, Linux host hardening, OpenLab CDS install, drivers, AIC virtual machine, and antivirus are all delivered as a single qualified bundle from Agilent, removing customer-side OS install/qualification effort. See `notes/cid-activation-registration.md:325-393` (CAR-P-007, CAR-P-008) for the binding of *hardware* → *Hub record* → *activation*.

### 1e. AIC vs CID compact comparison (synthesized for the AIC-vs-CID table)

| Trait | AIC (traditional) | CID |
|---|---|---|
| Host hardware | Customer Windows PC | Agilent-supplied Atom-class fanless IoT box (SE10) |
| Host OS | Customer-managed Windows + AIC software | Linux host (Oracle Linux 8) + KVM-hosted Windows 11 for AIC (was Windows 10 IoT Enterprise LTSC in earlier builds; see §1c) |
| AD domain membership | Supported | Not supported on embedded VM |
| Patch management | Customer IT | Agilent CID Hub (Linux updates, Windows IoT LTSC updates) |
| Remote management | Customer's tooling | CID Hub (SaaS), AWS IoT + AWS Secure Tunneling |
| Internet required | Optional | Required for activation and maintenance; not required for CDS data acquisition |
| Inbound from internet | Customer responsibility | None — no inbound; outbound TLS only |
| Identity | Customer AD/IdP | Cognito (customer users) or Okta (Agilent internal); see §5 |

---

## 2. Security posture vs PCs (IT Qs 7–9)

### 2a. Cybersecurity advantages over domain-controlled Windows PCs

- `/tmp/security-pdf.txt:69-78` — "A network scan of the CID shows only a single (Linux) IP address with only port 443 open. CDS client connections are served by an embedded Windows virtual machine (VM) that does not have an IP address visible to the corporate WAN. The CID Reverse Proxy component… acts as a firewall, shielding the Windows VM from all incoming network traffic except connections from CDS clients."
- `notes/networking-connectivity.md:513-521` (NET-BR-008, Corporate Network Port Restriction) — "All connections from the corporate network to the CID must be on port 443 or port 22. Port 22 is for non-productive systems only. Running a network scanner (such as nmap) against the corporate-facing IP address must show only ports 443 and 22 open." Source: OLAC-1611.
- `notes/cid-activation-registration.md:1057-1071` (CAR-BR-043, HTTPS-Only for CID Installation) — Installation uses HTTPS only.
- — Paraphrase: Compared with a domain-controlled PC, the CID exposes a smaller attack surface (single IP, port 443 only; Windows VM hidden behind reverse proxy on a non-routable virtual network), ships a Microsoft IoT SKU specifically designed for appliances (no end-user productivity software), is patched centrally by Agilent via the Hub, and uses unique per-CID credentials (see AUR-BR-004, AUR-BR-005) so a compromise of one CID does not propagate.

### 2b. Limitations vs domain-controlled PC

- — No AD authentication on embedded VM (see 1c).
- — No customer-managed antivirus product; CID ships ClamAV (DEV-BR-036, DEV-T-009) with weekly scans and on-demand scans via IoT command.
- — User accounts on the embedded VM are local; only the rotated `agilentac`-style admin credentials are exposed for Console/Cockpit (see RAT-EN-001).
- `notes/accounts-users-roles.md:1116-1121` (AUR-BR-043) — SYSTEM (Agilent) account cannot register CIDs/servers; can only view in customer accounts.

### 2c. Patching, antivirus, backups, security updates

- `/tmp/security-pdf.txt:91-98` — Windows VM uses Windows 10 IoT Enterprise LTSC; Windows updates "centrally handled by the Agilent CID Hub Management system." *(Historical: see §1c — going-forward production VM OS is Windows 11.)*
- `notes/device-base-system-hardware.md:760-772` (DEV-BR-036) — Antivirus scan IoT command supports `schedule` and `run` modes. ClamAV weekly scans (DEV-T-009 implied).
- `notes/activity-log-audit.md:734-744` (ALA-BR-052) — Windows Update download and install are logged separately per KB article ("Downloading KB5040427" → "Installing KB5040427").
- `notes/cid-activation-registration.md:474-501` (CAR-P-012) — Activation process installs latest Linux update, antivirus definitions, CDS VM, Windows Updates, drivers, and scheduled antivirus scans before bringing the CID to Ready.
- `notes/activity-log-audit.md:747-758` (ALA-BR-053) — Manual Windows update additions/edits via Software Library are logged.
- Jira: **OLAC-4294** (Story, FR1 / DEC'23) — Apply Linux updates.
- Jira: **OLAC-4949** (Story, AC1 FR1) — Release NOV'23 Windows Update.
- Jira: **OLAC-5575** (Story, AC1 FR1) — Add/update Windows updates.
- Jira: **OLAC-6645** (Story, FR1.2) — Release FR 1.2 Linux Update.
- Jira: **OLAC-7105** (Story, FR1.4) — [CPE] Release Linux update v2026.02.01.
- **CDS sample-data backups** (answered via Phase 1.3 G-15): CDS collects sample data on the CID's local disk and transfers it to the central CDS Server. The **true copy of sample data lives on the CDS Server**, which is the customer's responsibility to back up. The CID's local copy is transient by design; Agilent does not back up CID-local CDS data.
- **Antivirus quarantine + visibility** (answered via Phase 1.3 G-16): The CID runs **ClamAV**, scheduled weekly. Signature updates are delivered as part of the Linux Updates channel for the CID. Detections are quarantined to a `clamav-quarantine` path on the CID; these quarantine actions appear in the CID's Remote Access (RA) logs and are surfaced to customer admins through the standard activity-log path. See §7e for patch-SLA stance.

---

## 3. Network architecture & internet exposure (IT Qs 10–22)

### 3a. Two-NIC topology, V-NIC, instrument LAN isolation

- `/tmp/security-pdf.txt:49-54` — "CIDs have two network interfaces: one connected to the corporate Wide Area Network (WAN) and CID Management Hub (via the internet), the other connected to a private lab/instrument Local Area Network (LAN) or directly to an instrument."
- `/tmp/security-pdf.txt:100-107` — "Network connections from the Windows VM to instruments use a separate virtual network interface card (V-NIC) in the Windows VM which is passed through the Linux OS to the instrument network. This arrangement directly exposes the Windows VM's IP address for this network to instruments, but this network interface is meant to be either directly connected to an instrument or to an instrument network that has no external exposure (i.e. no internet access)."
- `notes/networking-connectivity.md:158-176` (NET-EN-006, CID Dual-NIC Network Architecture):
  > Lab LAN NIC: connects CID to internet and CID Hub; referred to as "customer" NIC in IoT commands. Instrument LAN NIC: private network with no internet connection; referred to as "instrument" NIC in IoT commands. AIC Windows VM is hidden from the Lab LAN; it communicates with the internet through the CID host via NAT. AIC Windows VM has two virtual NICs: one connected to the CID host's default KVM bridge (for Lab LAN access via NAT) and one for the Instrument LAN (via `instrument-br0` bridge).
- `notes/networking-connectivity.md:846-861` (NET-BR-034, Instrument NIC Isolation Recommended) — "Gateway should not be set on the Instrument NIC. The instrument network should remain isolated to prevent unwanted routing behavior and traffic leakage into corporate networks. In the UI, the gateway field is labeled 'Gateway Address (Not Recommended)'…"
- `notes/networking-connectivity.md:1267-1281` (NET-BR-060, Instrument NIC Communication Requirements) — "Internet outbound: None. Internet inbound: None. Intranet outbound: Acquisition Server to Instrument communication (instrument-specific ports); isolated and unrestricted communication recommended."
- ⚠️ **Accuracy update (2026-05-15, confirmed via engineering):** Direction of flows on the Instrument NIC is **driver-family-dependent**. Most OpenLab drivers (LC, LC/MS, GC/MS, UV/DAD) initiate the connection from the Windows VM *outbound* to the instrument. **GC instrument drivers are the exception** — the GC initiates the connection back to a driver process listening on the V-NIC inside the Windows VM. Customer-facing prose must not generalize "the VM listens for instrument connections" beyond GC, nor generalize "the VM initiates" beyond non-GC.
- `notes/networking-connectivity.md:466-478` (NET-BR-004) — Single default gateway; must be on customer network NIC only.
- Jira: **OLAC-575** (Story, AC 1.0) — "Windows VM must not be reachable from the corporate N/W" (formal requirement source).
- Jira: **OLAC-4614** (Story, FR1) — Beep codes for activation failure include swapped NIC cable detection.

### 3b. Outbound URLs, ports, protocols, direction

**Authoritative endpoint lists** (multiple, partially overlapping):

- `notes/networking-connectivity.md:1232-1245` (NET-BR-058, Firewall Configuration for CID Internet Access):
  > Firewalls must be configured to allow outbound communication from CIDs to specific domains:
  > - CID Hub and services: `*.agilent.com`, `*.s3.amazonaws.com`, `*.s3.us-east-1.amazonaws.com`, `*.s3.us-west-2.amazonaws.com`, `*.iot.us-east-1.amazonaws.com` (HTTPS)
  > - Microsoft Windows Updates: `*.microsoft.com`, `*.cloudfront.net`, `*.oneget.org`, `*.trafficmanager.net`, `*.blob.core.windows.net`, `*.azurefd.net`, `*.powershellgallery.com` (HTTPS)
  > - NTP Server: `*.pool.ntp.org` (NTP)
  > No inbound communication from the internet is required for either NIC.
- `notes/networking-connectivity.md:1249-1263` (NET-BR-059, House NIC Communication Requirements):
  > Internet outbound: Specified domains (NET-BR-058). Internet inbound: None required. Intranet outbound: DHCP, DNS, HTTPS, ICMP (to OLSS, OpenLab Server), HTTP/HTTPS (to ECM 3.x), SMB (optional). Intranet inbound: ICMP, HTTPS (for Acquisition Server and diagnostics), SSH (for troubleshooting).
- `notes/networking-connectivity.md:747-769` (NET-BR-028, CID Connectivity Tester Tests Required Network Endpoints) — current authoritative 12-endpoint list used by the on-CID Connectivity Tester:
  - `hub-ac-registration-api.prd-51.aws.agilent.com` (CID Hub registration API)
  - `a3cb4mwmdz2oep-ats.iot.us-east-1.amazonaws.com` (AWS IoT endpoint)
  - `agilent-aws-sbx-51-ac-images.s3.amazonaws.com` (dev image bucket — fallback)
  - `hub.cid.agilent.com` (CID Hub frontend)
  - `agilent-aws-prd-51-ac-images.s3.amazonaws.com` (prod image bucket — fallback)
  - `files.cid.agilent.com` (CID files service)
  - `powershellgallery.com`
  - `psg-prod-eastus.azureedge.net`
  - `onegetcdn.azureedge.net`
  - `microsoft.com`
  - `devopsgallerystorage.blob.core.windows.net`
  - `pool.ntp.org` (NTP, tested via chronyc, not NMAP)
  - **FR1.4 update**: image-delivery checks shift to CloudFront distribution URLs as primary, with the two S3 URLs retained as fallback only.
- `notes/networking-connectivity.md:1147-1175` (NET-BR-054, Dev Tools Connectivity Test Endpoints) — 13 endpoints checked by dev-tools console connectivity test, including `data.tunneling.iot.us-east-1.amazonaws.com` and `agilent-aws-sbx-51-yum-rpm-repo.s3.us-west-2.amazonaws.com` (Linux YUM repo).
- `/tmp/security-pdf.txt:40-72` — Documented (May 2024) outbound URL whitelist:
  - `*.cid.agilent.com` (registration APIs, IoT, S3)
  - `Data.tunneling.iot.<AWS_REGION>.amazonaws.com` (secure tunneling)
- **URL allow-list narrowing** (answered via Phase 1.3 G-08): A minimum, fully-qualified, wildcard-free allow-list is **not yet published**. Customers narrowing egress today must rely on the Internet Requirements list above, which still contains wildcards (`*.s3.amazonaws.com`, `*.iot.us-east-1.amazonaws.com`, etc.). **Jira OLAC-7392** ("Unify CID outbound AWS URLs under agilent.com for narrow customer allow-listing") tracks the work to bring all outbound AWS endpoints under `*.agilent.com` so that customers can configure egress firewalls without broad AWS wildcards.

**Port profile (Corporate NIC):**
- `notes/networking-connectivity.md:513-521` (NET-BR-008) — Only ports 443 and 22 open on corporate-facing IP; port 22 for non-productive systems only.
- `/tmp/security-pdf.txt:62-66` — "All incoming and outgoing connections to the CID from CDS clients are on TCP port 443 and are standard HTTPs or Secure Web Socket (WSS) connections."
- `~/projects/work/ac_agent/nginx.conf` — CID reverse proxy listens on `5400` and `443 ssl http2`; routes:
  - `/` → `https://aic` (Windows VM at `192.168.122.11:443`, NAT-bridged)
  - `/aic-windows-desktop/` → `http://aic_console_manager` (port 5000), with websockify on port 5800
  - `/ac-cockpit` → `https://cockpit` (port 9090)
  - `/ac-console/` → `gotty` (port 9091)
  - `/cidconnectivity`, `/connectivity_test`, `/download_test`, `/https_test` → `127.0.0.1:8081`
  - TLS protocols configured today: `TLSv1.2 TLSv1.1 TLSv1`. Answered via Phase 1.3 G-14: TLS 1.0 and above are currently enabled on the CID nginx. **Jira OLAC-7395** has been added to restrict the listener to **TLS 1.2 and above**. Until OLAC-7395 ships, customer vulnerability scanners will flag the legacy protocols; the documentation should describe both the current state and the planned tightening.
  - SSL certificate "will be replaced by the OpenLab certificate copied from the AIC Windows VM by the `ac_manager.update_nginx_config` function in the Agent" — see RAT-BR-025 below.
- `notes/networking-connectivity.md:1299-1309` (NET-BR-062) — CID Connectivity Tester listens on port 8081 bound to all interfaces.

**Connection direction summary:**
- CID → Hub: outbound, TLS 443, HTTPS + WSS. No inbound from Hub.
- CID → AWS IoT Core: outbound (MQTT over TLS 8883 or WSS 443; current build uses HTTPS/WSS per pub).
- CID → AWS S3 (CloudFront/CDN delivery): outbound TLS 443.
- CDS Client (intranet) → CID: inbound TLS 443 over corporate LAN (HTTPS/WSS).
- CDS Client → instrument (via CID instrument NIC): inbound from CID-side V-NIC only.
- Browser (intranet) → CID: HTTPS 443 to `https://<CID-FQDN-or-IP>/aic-windows-desktop` or `/ac-cockpit`.
- Browser (anywhere) → Hub: HTTPS 443 to `https://hub.cid.agilent.com`.
- Hub-initiated tunnel: opened *outbound* from CID to AWS Secure Tunnel; the Hub side joins through Secure Tunneling. No inbound port exposed on CID for tunneling.

### 3c. AWS services (IoT Core, S3, API Gateway, Secure Tunnel, Cognito) — shared vs dedicated, regions

- Plan-supplied note: All AWS services are *shared infrastructure*. Each customer's data is partitioned by tenant. See §10.
- **Production region** (`~/projects/work/ac_aws/ac_ops/terraform/environments/hub-prd-51/hub-prd-51.tf:1-99`):
  - `aws_region = "us-east-1"`, account `agilent-aws-prd-51` (account id 768955942055).
  - Production hosted zone: `Z08876863QUH2RM59DUXI` for `cid.agilent.com`.
  - Production portal FQDN: `hub.cid.agilent.com`; login: `hub-ac-login.cid.agilent.com`.
  - Registration API: `hub-ac-registration-api.prd-51.aws.agilent.com`.
  - Management API: `hub-ac-management-api.prd-51.aws.agilent.com`.
  - Cognito region: `us-east-1`. Authentication mode: `cognito`.
  - Tunnel server: EC2 instance, `t3.small`, Oracle Linux 8 update 9 AMI, private subnet, ALB front-end. FQDN `hub-ac-tunnel.cid.agilent.com`.
  - Database engine: PostgreSQL 16, encrypted at rest, private subnet.
- **EU environment** (`ac_ops/terraform/environments/qaeu/qaeu.tf:1-60`): `aws_region = "eu-central-1"` (Frankfurt). Jira **OLAC-2804** ("[DevOps] Create a jenkins job to deploy the AC portal to EU (Frankfurt) region") confirms an EU deployment pipeline exists.
- **Data residency** (answered via Phase 1.3 G-04 / G-12): Production CID Hub is hosted statically in **us-east-1** (everything except Linux package distribution) and **us-west-2** (Linux yum repo for CID updates). There is no dynamic routing of EU customers to `eu-central-1`; the EU Terraform environment (`qaeu`) is a non-production deployment. **Jira OLAC-7394** tracks migrating the Linux yum repo from us-west-2 to us-east-1 so all production data lands in a single region. Contractual region-pinning beyond this static posture is **not offered today**.
- `notes/networking-connectivity.md:1232-1245` lists IoT and S3 by US region — confirms US-East-1 (IoT) and US-East-1/US-West-2 (S3) for production endpoints.
- `~/projects/work/ac_aws/ac_ops/terraform/modules/iot_v2/iot_v2.tf` — IoT topic rules SELECT by topic prefix `${var.environment_name}-` for AC connected/disconnected and shadow-update events → environment-scoped routing; SQS queues per environment.
- `~/projects/work/ac_aws/ac_ops/terraform/modules/cognito/cognito.tf:63-149` — Single Cognito user pool per environment (multi-tenant, partitioned in app); `admin_create_user_config.allow_admin_create_user_only = true` (no self-signup); account recovery via verified email only; access_token validity 15 min, id_token 15 min, refresh_token 8 hours; OAuth scopes `email openid profile aws.cognito.signin.user.admin`.
- `~/projects/work/ac_aws/ac_ops/terraform/modules/tunnel_server_v2/tunnel_server_v2.tf:1-90` — Tunnel server is a single EC2 host per environment behind ALB; security group permits 5000 (internal LB) and 5100 (external LB) only; outbound unrestricted; SSH on 22 only when explicitly enabled (`ec2_tunnel_server_allow_ssh_port`).

### 3d. Reverse proxy, attack surface, port-scan posture

- `/tmp/security-pdf.txt:85-98` — CID Reverse Proxy acts as a firewall shielding the Windows VM from all inbound traffic except CDS client connections.
- `~/projects/work/ac_agent/nginx.conf:80-95` — Nginx config explicitly serves a default self-signed certificate, replaced at runtime by the OpenLab certificate from the AIC Windows VM (RAT-BR-025 below). All upstreams are `127.0.0.1` or the local KVM IP `192.168.122.11`.
- `notes/remote-access-tunneling.md:558-571` (RAT-BR-025, CID nginx Proxy SSL Certificate Replaced by OpenLab Certificate) — at runtime the CID's nginx proxy SSL cert is replaced by the OpenLab cert copied from the AIC VM, so corporate WAN clients see the OpenLab-issued certificate.
- `notes/cid-activation-registration.md:1057-1071` (CAR-BR-043) — HTTPS-only for CID installation.
- Jira: **OLAC-1216** (Defect, vulnerability assessment) — "#7 ClickJacking" — fix evidence (note that CID Hub has been through customer vuln assessments).

### 3e. Air-gap / no-internet failure modes

- `notes/device-base-system-hardware.md:714-722` (DEV-BR-033) — CIDs require internet for activation/maintenance; "OpenLab CDS does not require internet access for the core function of acquiring and processing data from instruments."
- `notes/networking-connectivity.md:1232-1245` (NET-BR-058) — Firewall must allow specified outbound; without it the CID cannot register/update.
- `notes/cid-activation-registration.md:451-470` (CAR-P-011) — Beep code patterns indicate connectivity/registration failures audibly:
  - Beep(1) — no DHCP/network on NIC1
  - Beep(2) — cannot contact any hub's registration API
  - Beep(3) — MAC found in hub but no linked CID record
  - Beep(4) — cannot connect to registration API of activated hub (continuous for unregistered, single for registered)
- `notes/networking-connectivity.md:885-897` (NET-BR-036) — Connectivity Tester is available *before* registration (factory default password) so a customer can diagnose firewall issues without activation.
- — Failure mode summary: Activation blocked → audible beep + Recent Activity error logged once connectivity returns. CDS data acquisition continues uninterrupted on local network.
- **Hub-side offline-CID notification** (answered via Phase 1.3 G-09): The Hub does **not proactively notify** customer administrators (no email, webhook, SNMP trap, or monitoring-tool integration) when a CID loses connectivity. The Hub *does* detect offline CIDs and renders them as **offline** in the web UI; operators must observe this by logging in to the Hub dashboard.

### 3f. Data flow — what transits the Hub vs stays on intranet

- `/tmp/security-pdf.txt:109-137` — "All connections from the device to the Hub are TLS encrypted… CIDs do not require any inbound communication from the CID Hub and are not exposed to the internet. This IoT connection from the CID to the CID Hub is not necessary for using CDS (i.e., instrument control, running samples, etc.)."
- — Sample/chromatography/result data: never transits the Hub. The Hub does not see CDS sample data, instrument results, or analytical files. It sees: CID metadata (name, IP, MAC, FQDN, hardware platform), shadow/state telemetry, software version selections, command audit, activity log entries, and credentials for *its own* Hub-managed surfaces (Cockpit/Console passwords).
- `notes/device-base-system-hardware.md:1096-1106` (DEV-BR-059, IoT Shadow Reported State Capped at 6000 Characters) — explicit bound on what CID reports to AWS IoT shadow.
- `notes/networking-connectivity.md:733-744` (NET-BR-027) — AIC Instrument NIC hides connection metadata in Hub by design (only what's user-friendly).

#### 3f-i. Customer Q&A — high-level data flow and privacy stance

**Q (RFP / customer IT):** What is the high-level data flow between a CID device and the CID Management Hub?

**A (canonical framing — to be reproduced verbatim on `cid-data-flow.md`):**

The CID exchanges only operational metadata, configuration, and credentials with the CID Management Hub. Customer laboratory data never traverses the Hub.

Data-privacy stance:

- **No PHI (Protected Health Information)** is transmitted between the CID and the Hub.
- **No PII (Personally Identifiable Information)** is transmitted beyond the names and email addresses of the internal users a customer chooses to invite to administer their tenant.
- **No laboratory data, sample data, chromatograms, or analytical results** are transmitted to the Hub. Those remain on the customer's local network, handled by OpenLab CDS.
- ⚠️ **Accuracy update (2026-05-18, confirmed via `ac_client/datastore.py:55-105`):** the admin user names and email addresses described above live in **Cognito on the Hub side**, not on the CID. The CID's persisted state (`data.json`) holds only: `agent` slot info, `aic` OLSS server/username, `registration` (cert paths, MQTT endpoint, Hub URL, thing name), `windows_vm` slot info, and `worker` command. There is no admin email field on the CID. Customer-facing prose must not claim admin emails are stored on the device — that is a Hub-side fact, not a CID-side fact.

The categories that *do* flow between CID and Hub are summarized in the **Data Types Summary Table** (see `data-types-summary-table.png`):

| Data Category | Direction | Contains Sensitive Data | Encryption | Customer Visible |
|---|---|---|---|---|
| Device Registration | CID → Hub | No | HTTPS/TLS | Yes (Portal) |
| IoT Credentials | Hub → CID | Yes (certificates) | HTTPS/TLS | No |
| Agent Reported State | CID → Hub | No | HTTPS/TLS | Yes (Portal) |
| Hub Commands | Hub → CID | Sometimes (config) | MQTT/TLS | Yes (Portal) |
| Software Downloads | Hub → CID | No | HTTPS/TLS | Yes (Portal) |
| Password Updates | Hub → CID | Yes | MQTT/TLS | No |
| Activity Logs | CID → Hub | No | HTTPS/TLS | Yes (Portal) |
| Configuration Data | Both | Partial (IPs/hosts) | HTTPS/MQTT/TLS | Yes (Portal) |
| User Actions | Portal → Hub | No | HTTPS/TLS | Yes (Portal) |

This table is the authoritative inventory of what crosses the boundary and is what IT reviewers should be pointed at for IT Qs 15 and 21 (data transit through Hub, telemetry inventory).

---

## 4. Operational interfaces

### 4a. Windows VM console (local + tunneled, approvals, password recycling)

- `/tmp/security-pdf.txt:91-141` — Verbatim coverage (see §0).
- `notes/remote-access-tunneling.md:65-81` (RAT-EN-003, Windows Console):
  - Web-based remote desktop via VNC/websockify.
  - Single-user exclusive session.
  - Keep-alive heartbeat (30-second intervals).
  - Auto-logout within 60 seconds if browser tab closed without explicit logout.
  - Routed via `/aic-windows-desktop` nginx location.
- `notes/remote-access-tunneling.md:600-613` (RAT-BR-028) — Windows console auto-activates login screen on connect.
- `notes/remote-access-tunneling.md:614-627` (RAT-BR-029) — Windows console reconnection available after disconnect.
- `notes/remote-access-tunneling.md:422-430` (RAT-BR-014) — Windows desktop concurrent access limit (one).
- `notes/remote-access-tunneling.md:546-557` (RAT-BR-024) — Remote CDS Desktop requires CID Hub for password.
- `notes/remote-access-tunneling.md:572-585` (RAT-BR-026, Credential Update 24-Hour Cooldown) and `notes/remote-access-tunneling.md:586-598` (RAT-BR-027, Password Complexity for Generated Credentials):
  - 24-hour cooldown between credential updates.
  - Password complexity matches the agilentac rules (10 chars, mixed case, numbers, special chars).
- `notes/remote-access-tunneling.md:31-40` (RAT-EN-001, agilentac Cockpit User) — Daily password rotation; complexity: 10 chars, mixed case, numbers, special chars.

### 4b. Linux Cockpit

- `/tmp/security-pdf.txt:143-167` — Verbatim coverage (see §0).
- `notes/remote-access-tunneling.md:139-160` (RAT-EN-006, Cockpit Service Configuration):
  - Listens on `127.0.0.1:9090` via systemd socket override.
  - Login title: "CID Dashboard".
  - Allowed origins: tunnel server FQDN and CID's `customer-br0` IP.
  - `ProtocolHeader: X-Forwarded-Proto`.
- `notes/remote-access-tunneling.md:228-243` (RAT-P-004, Access Cockpit for Activated CID) — Admin retrieves daily-rotated `agilentac` password from CID Hub Administration tab.
- `notes/remote-access-tunneling.md:246-259` (RAT-P-005, Access Cockpit for Unactivated CID) — Pre-activation access uses factory default password from Agilent support.
- `notes/remote-access-tunneling.md:475-499` (RAT-BR-020) — Linux Cockpit opens to login page.
- `notes/remote-access-tunneling.md:523-557` (RAT-BR-023) — CID modification via Linux Cockpit not supported (config changes must go through Hub for audit).

### 4c. CID Hub web UI

- `~/projects/work/ac_aws/ac_ops/terraform/modules/cognito/cognito.tf:117-149`:
  - OAuth flow: code (PKCE) only.
  - Allowed flows: `ALLOW_CUSTOM_AUTH`, `ALLOW_REFRESH_TOKEN_AUTH`, `ALLOW_USER_SRP_AUTH`.
  - Token lifetimes: access 15 min, id 15 min, refresh 8 hours.
  - Identity provider: COGNITO only (no SAML/external IdP federation configured).
- `notes/accounts-users-roles.md:398-419` (AUR-EN-018, Cognito Authentication Flow) — Auth code flow → ID token used for authorization header (Cognito does not support access tokens here).
- `notes/accounts-users-roles.md:867-888` (AUR-BR-015, AUR-BR-016, AUR-BR-017):
  - Access token 15 min; refresh token 8 hours.
  - Backend auth monitor: every 60s, revokes refresh tokens for users not active >16 min and creates `User logged out due to session expiry` activity log entry.
- `notes/accounts-users-roles.md:954-960` (AUR-BR-025, Inactivity Warning Modal) — 10-minute inactivity → 30-second countdown modal → logout.
- `notes/accounts-users-roles.md:2015-2028` (AUR-BR-109, CID Hub Invitation-Only Access) — Users must be invited; no self-signup.

### 4d. Health page

- `/tmp/security-pdf.txt:144-167` (in PDF Health Page block) — `https://hub.cid.agilent.com/health` reachable without login (NET-BR-010 below).
- `notes/networking-connectivity.md:94-117` (NET-EN-004, CID Hub Health and Connectivity Page) — Public; tests 8 endpoints sequentially from the browser; color-coded reachability/throughput/HTTP response time.
- `notes/networking-connectivity.md:541-547` (NET-BR-010) — Health Page does not require login (designed for pre-deployment verification from a customer laptop).
- `notes/networking-connectivity.md:584-592` (NET-BR-015) — Health Page traffic-light gates customer deployment qualification (green/yellow/red).
- `notes/networking-connectivity.md:577-582` (NET-BR-014) — Page measures HTTP response time, not ICMP ping latency.
- Jira **OLAC-289** (D/N items 3, 10.4 — referenced in NET-BR-010, NET-BR-011) — origin of design.

---

## 5. Identity, authentication, credential lifecycle (IT Qs 23–26)

### 5a. Cognito, user accounts, roles

- `/tmp/security-pdf.txt:118-119` — "Logins to the account are authenticated using AWS's Cognito service."
- `~/projects/work/ac_aws/ac_ops/terraform/modules/cognito/cognito.tf:63-115`:
  > `admin_create_user_config { allow_admin_create_user_only = true }`
  > Invite email subject: "Connected Instrument Device Hub for OpenLab CDS: Your Temporary Password"
  > `account_recovery_setting { recovery_mechanism { name = "verified_email" priority = 1 } }`
  > `email_sending_account = "DEVELOPER"`, custom SES source.
- `notes/accounts-users-roles.md:1957-1969` (AUR-BR-105) — Cognito custom domain limit (4/region) — drives the prefix-domain fallback for non-prod.
- `notes/accounts-users-roles.md:1971-1982` (AUR-BR-106) — Cognito account recovery via verified email only.
- `notes/accounts-users-roles.md:1985-1996` (AUR-BR-107) — Admin-only user creation (Cognito setting).
- `notes/accounts-users-roles.md:1999-2014` (AUR-BR-108) — Email sender format `CID Hub <no-reply@hub.cid.agilent.com>` (prod).
- `notes/accounts-users-roles.md:65-99` (AUR-EN-002 Role, AUR-EN-003 SYSTEM Account) — Two account types: Customer (tenant) and SYSTEM (Agilent cross-tenant). System roles can hold only system privileges; customer roles only customer privileges (AUR-BR-019, AUR-BR-020).
- `notes/accounts-users-roles.md:189-212` (AUR-EN-009, AUR-EN-010) — Customer Administrator and Customer User privilege sets.

### 5b. MFA / SSO / SAML / OIDC support status

- `~/projects/work/ac_aws/ac_ops/terraform/modules/cognito/cognito.tf:135` — `supported_identity_providers = ["COGNITO"]` — **no SAML/external OIDC federation is configured in the Cognito User Pool Client.**
- `notes/accounts-users-roles.md:350-371` (AUR-EN-016, Authentication Mode Selection):
  > The system supports two authentication modes: Cognito (for customer users) and Okta (for Agilent internal users). The mode is determined at deployment time through environment configuration.
- `notes/accounts-users-roles.md:374-394` (AUR-EN-017, Agilent Okta Authentication Flow):
  > A two-server authentication architecture for Agilent internal users. The flow involves first checking the Enterprise IT App session, then the Okta Server session, redirecting to login pages as needed. Supports single sign-on for Agilent employees.
  - PKCE flow; ID token; cannot silently refresh (must redirect to session timeout page).
- — Conclusion (answered via Phase 1.3 G-01 / G-02):
  - **Customer SSO / SAML / OIDC federation is not offered.** Customers must use IDs created in CID Hub (backed by AWS Cognito User Pool, `supported_identity_providers = ["COGNITO"]`). Agilent-internal Okta-OIDC is only for Agilent support users.
  - **MFA is not offered.** Users authenticate with username and password only. Cognito supports MFA natively but it is not enabled in the production Terraform module. There is no per-tenant opt-in.

### 5c. Agilent support access — approval flow

- `/tmp/security-pdf.txt:117-120` — "Agilent CID support personnel have only view access to CIDs in the account."
- `/tmp/security-pdf.txt:121-141` (Windows Console section, Agilent support paragraph) — "If Agilent support needs to access the Windows console, they initiate a request from the CID Hub which then needs to be explicitly approved or rejected by an authorized user in your account. Agilent support can access the Windows console only when approved by an authorized user."
- `notes/remote-access-tunneling.md:44-61` (RAT-EN-002, Remote Access Request Flow):
  > Initiated by Agilent user requesting remote access. Requires customer user approval or rejection. Approval enables Cockpit session launch. Customer can terminate session at any time. Agilent user can close their own session. Session closure automatically expires authorization. Re-access requires new approval cycle.
- `notes/remote-access-tunneling.md:184-204` (RAT-P-002) — Full process steps.
- `notes/remote-access-tunneling.md:328-339` (RAT-BR-006, Agilent Remote Access Requires Customer Approval).
- `notes/remote-access-tunneling.md:340-350` (RAT-BR-007, Remote Access Session Termination Rights) — Both customer and Agilent can terminate.
- `notes/remote-access-tunneling.md:351-361` (RAT-BR-008, Remote Access Session Closure Expires Authorization).
- `notes/remote-access-tunneling.md:386-398` (RAT-BR-010, Cockpit Tunnel Authentication Uses CID Hub Login).
- `notes/remote-access-tunneling.md:399-407` (RAT-BR-012) — SYSTEM (Agilent) users cannot approve remote access requests.
- `notes/remote-access-tunneling.md:319-326` (RAT-BR-005, Tunnel Server Session Limit) — Max 10 concurrent sessions across all CIDs; stale cleanup hourly.
- `notes/remote-access-tunneling.md:823-835` (RAT-BR-043, AIC Remote Session Password Display).
- `notes/remote-access-tunneling.md:824-836` (RAT-BR-044, Tunnel Session Recreation Cooldown — 90 seconds).

### 5d. Password recycling, credential rotation

- `notes/remote-access-tunneling.md:31-40` (RAT-EN-001) — agilentac Cockpit user: daily password rotation; 10 chars, mixed case + numbers + special chars.
- `/tmp/security-pdf.txt:97-100, 152-154` — Both Windows console and Linux Cockpit passwords "recycled once per day".
- `notes/accounts-users-roles.md:513-528` (AUR-P-003, CID Root Credential Rotation) and `notes/accounts-users-roles.md:532-547` (AUR-P-004, AIC Credential Rotation) — `update_ac_credentials_command` and `update_aic_credentials_command` IoT commands rotate root + SSH keypair; new SSH keypair replaces old (old is invalidated).
- `notes/accounts-users-roles.md:578-602` (AUR-P-006, Credentials Slot Rotation for Update) — Zero-downtime A/B credential slot rotation; old slot becomes inactive once new is finished.
- `notes/accounts-users-roles.md:798-803` (AUR-BR-005) — Unique SSH keys and passwords per AC.
- `notes/accounts-users-roles.md:789-794` (AUR-BR-004) — Unique SSH keys and passwords per AIC. → A compromise of one CID's keys does not expose others.
- `notes/accounts-users-roles.md:1080-1086` (AUR-BR-039, OpenLab Password End-to-End Encryption) — OLSS passwords encrypted at rest, in IoT shadow, and in transit.
- `notes/accounts-users-roles.md:1297-1310` (AUR-BR-061) — Sensitive data and passwords must be encrypted at rest and in transit.
- `notes/accounts-users-roles.md:1384-1395` (AUR-BR-067) — Sensitive data masking in IoT shadow.
- `notes/accounts-users-roles.md:764-777` (AUR-BR-002) — Credential masking in Management API responses (`**` stars for `mq_admin_password`, `olss_password`, `cw_secret_key`).

### 5e. Offboarding / user removal

- `notes/accounts-users-roles.md:729-744` (AUR-P-013) — Admin clicks Delete (trash) in Users page → user immediately removed and can no longer log in.
- `notes/accounts-users-roles.md:1204-1209` (AUR-BR-052) — No user can delete their own account.
- `notes/accounts-users-roles.md:1213-1230` (AUR-BR-053, AUR-BR-054) — Anti-lockout rules.
- `notes/accounts-users-roles.md:884-889` (AUR-BR-017) — Backend auth monitor invalidates refresh tokens for inactive users.
- `notes/accounts-users-roles.md:750-761` (AUR-BR-001) — Email can be re-used after account deletion (no permanent block).
- — Note: an access token issued before deletion remains valid for up to 15 minutes (AUR-BR-015: tokens cannot be revoked once issued; only refresh tokens can be invalidated).

---

## 6. Device identity & registration (X.509, Cognito-backed activation)

- `/tmp/security-pdf.txt:121-135` — "When a CID connects to the internet for the first time, it attempts to register with the CID Hub using REST APIs. As part of the registration process, a unique X.509 IoT device certificate is generated and downloaded to the device. This certificate is then used to connect to the CID Hub, which uses the AWS IoT infrastructure."
- `notes/device-base-system-hardware.md:150-167` (DEV-EN-006, AWS IoT Thing):
  > Thing name: `{stage_name}-ac-{ac_id}`; associated policy and X.509 certificate; shadow document with desired/reported state.
- `notes/device-base-system-hardware.md:780-790` (DEV-BR-037) — Thing name format: `{stage_name}-ac-{ac_id}`, underscores → hyphens, truncated to 63 chars; doubles as the CID hostname.
- `notes/device-base-system-hardware.md:295-318` (DEV-P-002, IoT Certificate Renewal Process):
  - Old cert detached & marked INACTIVE → new cert+keypair created (ACTIVE) → attached to existing policy and IoT Thing → old cert deleted.
  - On failure: re-attach old, return `update_required:true` so CID retries.
- `notes/device-base-system-hardware.md:522-527` (DEV-BR-019, Auto-Renewal Triggers) — Renew when cert expiring within window, expired, or deleted; weekly cadence; not auto-renewed if revoked/disabled (intentional manual action).
- `notes/device-base-system-hardware.md:558-573` (DEV-BR-023, IoT Certificate Check Interval):
  - Synchronous check at agent startup; periodic check every 7 days (`DAY_WINDOW`); 5-min retry on failure.
  - "AWS IoT certificate lifetime ≈ 50 years (18 262.5 days)" per code comment — application does not configure lifetime itself.
- `notes/device-base-system-hardware.md:615-625` (DEV-BR-027, IoT Certificate Renewal Requires Network Connectivity) — If CID is offline through the renewal window and cert expires, device cannot renew until SSB / reboot recovery (workaround documented).
- `notes/device-base-system-hardware.md:540-545` (DEV-BR-021, CID Receives Updated Certificate Without Service Interruption).
- `notes/cid-activation-registration.md:35-50` (CAR-EN-001, Registration Code) — 8-char alphanumeric PIN on QR sticker.
- `notes/cid-activation-registration.md:354-393` (CAR-P-008, CID Activation on Boot) — Boot contact loop; matches MAC; receives activation info; saves to `/opt/data/data.json` and `/opt/data/certs/downloaded`.
- `notes/cid-activation-registration.md:560-578` (CAR-P-015) — Legacy PIN flow [DEPRECATED].
- Jira **OLAC-363** (Story, FR1) — Original "Deal with device certificate expiration" requirement; produced rules DEV-BR-019…DEV-BR-022.
- Jira **OLAC-6176** (Defect) — IoT Certificate error after 9 days disconnected; source of DEV-BR-027.
- — **Cert lifetime + rotation** (answered via Phase 1.3 G-13): Device certificates are AWS IoT Core–issued and carry the AWS default validity of ~50 years (≈18,262.5 days per DEV-BR-023). 50 years is the AWS-issued maximum and is not customer-configurable. The CID auto-renews any certificate within 7 days of expiry (DEV-BR-019, DEV-BR-023).
- — **Revocation on lost/stolen device** (answered via Phase 1.3 G-13, verified against code): The admin deletes the CID's record from the Hub. The server-side handler (`ac_server/management_api/ac_api.py::delete_ac`) does three things:
  1. Soft-deletes the AC row (the CID's subsequent Registration API calls are rejected because `is_deleted=True`).
  2. Soft-deletes the `CidRegistrationInfo` association and flips the `CidDevice` row back to `NEW` so the hardware can be re-associated.
  3. Sets `desired.is_deleted = True` in the AWS IoT shadow via `iot_manager.set_desired_is_deleted()`.
- — The CID agent reads `desired.is_deleted = True` from the shadow (`ac_agent/ac_client/ac_client/iot_client.py::process_delete_message`) and on next reboot triggers a **self-factory-reset** (`factory_reset.py::reset_device_if_necessary`), wiping local data including the on-device X.509 certificate and private key.
- — **Important nuance**: `delete_ac` does **not** call `detach_thing_principal`, `update_certificate(newStatus="INACTIVE")`, or `delete_certificate` against AWS IoT. The cert and IoT Thing remain technically valid in AWS IoT Core until/unless an Agilent operator detaches them out-of-band. The CID's loss of Hub access depends on either (a) the CID being online and self-wiping when it sees the shadow flag, or (b) the Registration API rejecting any future call from the device. An attacker who extracted the cert+key from a stolen device *before* the device received the shadow message could theoretically continue to connect to AWS IoT MQTT until manual cert deactivation. **Sub-gap (§12a)**: the AWS-IoT-side manual revocation step for offline/extracted-cert scenarios is not documented as a customer-facing procedure.

---

## 7. Patch & update management (IT Q9)

### 7a. Windows VM updates
- `/tmp/security-pdf.txt:91-98` — Windows 10 IoT Enterprise LTSC, "no Windows updates are required to be managed by IT… This can be centrally handled by the Agilent CID Hub Management system." *(Historical OS reference. Going-forward production builds run **Windows 11**; the centralized Hub-managed update model is unchanged. See §1c.)*
- Jira **OLAC-4949** (Story, NOV'23 Windows Update); **OLAC-5575** (Story, Add/update Windows updates); **OLAC-7105** (Story, FR1.4 Linux update).
- `notes/activity-log-audit.md:734-744` (ALA-BR-052) — Download and install of each Windows update logged separately per KB article.
- `notes/accounts-users-roles.md:1269-1281` (AUR-BR-059) and `notes/accounts-users-roles.md:1283-1295` (AUR-BR-060) — Manage Windows Updates / Windows Update Import privileges.

### 7b. Linux host updates
- Jira **OLAC-4294** (FR1) — "3.2 Apply Linux updates".
- Jira **OLAC-6645** (FR1.2) — "Release FR 1.2 Linux Update".
- Jira **OLAC-7105** (FR1.4) — "Release Linux update v2026.02.01".
- `notes/device-base-system-hardware.md:657-670` (DEV-BR-030) — Ghost images bundle current Linux update.
- — Linux base OS: Oracle Linux 8 (inferred from `ac_ops/scripts/deploy_ac/` references and tunnel-server AMI choice).

### 7c. Driver delivery
- `notes/cid-activation-registration.md:582-599` (CAR-P-016) — Post-Registration Driver Configuration Task.
- `notes/cid-activation-registration.md:423-447` (CAR-P-010) — Post-Registration AIC Setup Task issues INSTALL_CDS_DRIVER commands per selected driver via IoT shadow.

### 7d. Rollback
- `notes/networking-connectivity.md:865-879` (NET-BR-035) — Corporate NIC configuration auto-rollback if Registration API unreachable after 5 retries.
- `notes/activity-log-audit.md:1201-1213` (ALA-BR-076) — AIC Rollback log entries.
- — A/B slot mechanism for CID connectivity tester (NET-EN-005) and ac_agent updates implies rollback-on-failure for agent/tester containers as well.

### 7e. Patch SLA / cadence
- **No patch-time / CVE-response SLA is committed** (answered via Phase 1.3 G-03). The only contractual service level in the EULA is **99% annual System Availability** for the CID Hub (EULA §2(I), §14 Service Credits table). Patch release timing for Windows, Linux, and driver updates is governed by release cadence (multi-times-per-year per EULA §2(G)), not by a CVSS-keyed timeline.
- **Open gap**: the documented intake channel for customers and third-party researchers to report suspected vulnerabilities is not defined (OLAC-5819 logged a broken "Contact Support" email link).

### 7f. Customer-managed Certificate Authorities (FR1.4)
- Jira **OLAC-6938** (Story, FR1.4) — "Add 'Custom CAs' to the Settings Menu".
- Jira **OLAC-6941** (Story, FR1.4) — "Edit and Delete Certificate Authorities".
- — Suggests upcoming customer-managed-CA capability (e.g., for internal corporate CAs on OLSS / ECM 3.x integration). See Jira **OLAC-6702** (Defect, FR1.3) — "CID Registration fails when ECM 3.6 uses corporate (self-generated) SSL certificates" — direct customer-driver for this feature.

---

## 8. Hardware

### 8a. Form factor, specs, certifications
- `notes/device-base-system-hardware.md:127-146` (DEV-EN-005) — see §1a above for full spec block.
- — **Hardware provenance** (answered via Phase 1.3 G-21): Hardware is manufactured by **Lenovo**. The gold ghost image is built and tested by Agilent, then transferred securely to the manufacturing supplier. The hardware supplier maintains industry-standard supply-chain controls for compliant delivery to customers.
- — **Hardware regulatory certifications** (CE, FCC, UL, RoHS, REACH, WEEE) — **Open gap (G-07, G-17)**: any Lenovo-side attestation/certificate numbers are not yet collected. Owner: **Edison → Bhavani**.

### 8b. Port identification
- DEV-EN-005 list: "Dual Gigabit LAN (RJ45), 4x USB, DisplayPort, HDMI, Mic In, Audio Out, 2x Serial (DB9)."
- `notes/device-base-system-hardware.md:1018-1036` (DEV-BR-053, Physical CID Ethernet Port Order) — NIC1 vs NIC2 port identification on the chassis (used by activation beep codes when cables are swapped).
- `notes/device-base-system-hardware.md:1054-1068` (DEV-BR-056, CID Hardware Physical Placement).

### 8c. BIOS / firmware posture
- **UEFI Secure Boot is disabled** on the CID (answered via Phase 1.3 G-18).
- **Open gap**: TPM 2.0 provisioning state and measured-boot posture are not yet documented. Owner: **Alok**.

### 8d. Disk / storage
- `notes/device-base-system-hardware.md:608-613` (DEV-BR-026) — CID VMs require min 256 GB total disk; downloads require 50 GB free.
- **Disk encryption at rest** (answered via Phase 1.3 G-19): Neither the Linux host nor the embedded Windows VM is encrypted at rest. There is no LUKS on the Linux host and no BitLocker on the Windows VM. This is an explicit posture, not a gap.
- ⚠️ **Accuracy update (2026-05-18, confirmed via engineering):** there are two reasons full-disk encryption is not applied on the CID, and customer-facing prose must lead with the first:
  1. **Primary — the CID is not a long-term record store.** Sample data is staged transiently to local disk during acquisition and then persisted to the OpenLab CDS Server, which is the canonical record store and the appropriate point for at-rest protection of laboratory records.
  2. **Secondary — performance.** On the CID's fanless Atom-class hardware profile, full-disk encryption was evaluated and not adopted because the encryption overhead would compete with real-time instrument-acquisition throughput.
  Customer-facing prose must NOT claim "the device holds no data at rest" — the CID *does* stage sample data transiently. The accurate framing is "not a long-term record store" + the performance trade-off as a secondary supporting reason.

---

## 9. Audit, logging, compliance signals (IT Qs 28–30)

### 9a. Activity log model

- `notes/activity-log-audit.md:38-60` (ALA-EN-001, Activity Log):
  > Columns: Date/Time, User, Description, Reason, Customer, Event Category, Level. Customer column visible only to Agilent (SYSTEM) users. Tracks software downloads/installs, configuration changes, registration, login/logout, remote access, credential updates. Username displayed "Full Name (USERID)". Start time to second precision; event ordering to millisecond.
- `notes/activity-log-audit.md:64-73` (ALA-EN-002, Global Activity Log) — Categories: Additional Hubs, Authentication, CID Activation, CID Administration, CID Device, CID Networking, CID Software, CID Summary, Customer, OpenLab Server Software, OpenLab Server Summary, Software Library.
- `notes/activity-log-audit.md:127-144` (ALA-EN-006, CID Activity Log Response) — Aggregates shadow logs, event logs, connection status, CID actions; customer-scoped for customer users; sensitive data hidden.
- `notes/activity-log-audit.md:225-231` (ALA-BR-006) — Covers all user-initiated activities: software downloads, installs/upgrades/removals, network setting changes, reboots, Desktop/Cockpit launches, registration, access requests/grants/denials, credential updates.

### 9b. Tamper-evidence and retention
- Activity log is stored in PostgreSQL (RDS, encrypted at rest). No cryptographic tamper-evidence mechanism (hash chains, signed logs, write-once storage) is implemented; integrity rests on RDS access controls and AWS account isolation.
- **Retention** (answered via Phase 1.3 G-05): CID Hub activity and audit logs are kept in online storage for **at least 7 years**. The historical "minimum 3 days" framing in `notes/activity-log-audit.md:603-608` (ALA-BR-041) is a per-CID local-log floor, not the Hub retention policy.

### 9c. SIEM export
- `notes/activity-log-audit.md:325-332` (ALA-BR-016, Activity Log Export Scope) — Export functionality exists; scope documented.
- **No user-accessible SIEM export path exists today** (answered via Phase 1.3 G-05). Customers cannot stream Hub logs to Splunk, QRadar, Sentinel, etc. via API, syslog, S3, or webhook. This is a known posture, not a gap to chase.

### 9d. Customer environment traceability for compliant markets
- `notes/activity-log-audit.md:678-688` (ALA-BR-048) — Add/remove customer accounts, servers, CIDs, and configuration changes are fully traceable.
- `notes/activity-log-audit.md:692-702` (ALA-BR-049) — Reason for change required for critical fields.
- `notes/customer-account-management.md:189-202` (CAM-BR-005, CAM-BR-006) — Customer create/edit/delete require reason.

### 9e. 21 CFR Part 11 / EU Annex 11
- **Answered via Phase 1.3 G-11**: CID is only a *deployment model* for CDS AIC and does not itself interact with sample data or electronic records. OpenLab CDS (which does handle sample data) provides the 21 CFR Part 11 / EU GMP Annex 11 audit trails, e-signature, and record-retention capabilities. **Running CDS on a CID does not alter the documented Part 11 posture of CDS.** The CID security doc points to Agilent's existing OpenLab CDS regulatory-position statement rather than re-asserting the posture here.
- **Compliance certifications** (answered via Phase 1.3 G-07): The **CID itself does not hold third-party attestations** (SOC 2 Type II, ISO/IEC 27001, FedRAMP, IRAP, HIPAA, C5). Hardware-side attestations from Lenovo are an open chase (G-07, G-17 — owner: **Edison → Bhavani**).

### 9f. Login/logout audit
- `notes/activity-log-audit.md:495-545` (ALA-BR-029…ALA-BR-034) — Login, logout (explicit, inactivity, session-expiry), and continue-page sign-in are individually logged.
- `notes/activity-log-audit.md:550-585` (ALA-BR-035…ALA-BR-038) — User add/remove/edit/password-reset logged.

### 9g. Credentials obfuscation in logs
- `notes/activity-log-audit.md:205-211` (ALA-BR-004) — Credentials obfuscated with `****` in shadow-JSON view.
- `notes/activity-log-audit.md:899-913` (ALA-BR-062) — DNS Address Sanitization in Activity Log.

---

## 10. Tenant isolation & multitenancy (IT Q20)

- `/tmp/security-pdf.txt:112-117` — "Agilent CID Hub is a multitenant cloud web application where each tenant has a separate and isolated account. Users log into their account on the website to manage CIDs and additional users."
- `notes/customer-account-management.md:55-83` (CAM-EN-003, Customer Account database record):
  > Customer account `id=0` is the special SYSTEM account; regular customer accounts get incrementing ids. Foreign keys: users.customer_id, ac.customer_id link all data to the owning customer.
- `notes/customer-account-management.md:153-158` (CAM-BR-001) — Customer deletion blocked when associated resources exist.
- `notes/accounts-users-roles.md:1116-1121` (AUR-BR-043) — SYSTEM account cannot register CIDs/servers itself.
- `notes/accounts-users-roles.md:936-941` (AUR-BR-023) — SYSTEM membership determines cross-customer access.
- `notes/accounts-users-roles.md:963-996` (AUR-BR-026…AUR-BR-029) — "View other accounts" privilege gates UI and API; without it, queries return only the user's own customer's data.
- `notes/activity-log-audit.md:706-716` (ALA-BR-050) — Activity Log scoped to own customer for customer users; system users see global view.
- — Database isolation model: shared PostgreSQL RDS (single per environment) with `customer_id` foreign keys + API-level scoping. Not VPC-per-tenant or DB-per-tenant. AWS IoT topic naming includes environment prefix (`iot_v2.tf` SELECTs WHERE `startswith(topic, "${env}-")`), but tenant separation within an environment is application-layer.
- **Shared AWS services**: Cognito (single user pool per env), AWS IoT Core (one account, partitioned via thing-name prefix), S3 (shared buckets with CloudFront delivery, signed URLs from Registration API per request — see `notes/networking-connectivity.md:559-565` NET-BR-012), Tunnel Server EC2 (single instance per env). All shared, application-partitioned.
- **Hub-side VPC architecture diagrams** (answered via Phase 1.3 G-20): The current diagram set lives in `~/projects/personal/cid-docs/source/` as drawio files: `1.enterprise-overview.drawio`, `2.cid-internals.drawio`, `3.cid-archicture.drawio`, `4.aws-architecture.drawio`. **Open gap**: these need to be modernized in a current tool and re-exported for the security doc. Owner: **Sunil**.
- `notes/cid-activation-registration.md:1416-1430` (CAR-BR-066, Device List Scoped by Customer Access).

---

## 11. Jira ticket index (security-relevant)

Filtered to tickets that mention: cognito, x509/x.509, TLS, firewall, whitelist, secure tunnel, reverse proxy, SAML, OIDC, CVSS, CVE, vulnerability, X.509 cert, Cockpit, CID Hub user, MFA, password recycle, SSO, CDN, CIDOps, CID FQDN, aic-windows-desktop, audit log, tamper, SIEM, Annex 11, 21 CFR.

| Key | Type | Title | Note |
|---|---|---|---|
| OLAC-363 | Story | Deal with device certificate expiration | Origin of IoT cert auto-renewal rules (DEV-BR-019…022). |
| OLAC-575 | Story | Windows VM must not be reachable from the corporate N/W | Foundational requirement for the reverse-proxy / V-NIC separation. |
| OLAC-576 | (referenced) | Customer + Agilent access to Linux Cockpit | Origin of RAT-BR-003, RAT-BR-004. |
| OLAC-577 | (referenced) | Agilent remote access request/approval flow | Origin of RAT-EN-002, ALA-BR-005. |
| OLAC-503 | Epic | AC Administration | Parent epic for administration UX/credentials. |
| OLAC-505 | Feature | Role/Privilege framework | Parent for privilege model rewrite. |
| OLAC-1205 | Story | Require login to access URL corresponding to an active tunnel | Origin of tunnel session cookie / RAT-EN-004. |
| OLAC-1216 | Defect | "591853 - From vulnerability assessment - #7 ClickJacking" | Evidence of customer vulnerability assessment and remediation. |
| OLAC-1223 | (referenced) | agilentac Cockpit User daily password rotation | Origin of RAT-EN-001. |
| OLAC-1339 | (referenced) | AIC Instrument NIC visibility on Networking page | NIC architecture. |
| OLAC-1428 | (referenced) | Cockpit Launch local-vs-remote choice. | |
| OLAC-1441 | (referenced) | Default-gateway constraint | NET-EN-001. |
| OLAC-1611 | (referenced) | Corporate network port restriction (443+22 only) | NET-BR-008. |
| OLAC-1832 | (referenced) | Token validity & backend auth monitor | AUR-BR-015…018. |
| OLAC-1971 | Defect | Restarting AC tunnel server breaks active AC remote debug sessions | Tunnel resiliency. |
| OLAC-2509 | (referenced) | Traceability requirement for compliant markets | ALA-BR-048. |
| OLAC-2804 | Story | Jenkins job to deploy the AC portal to EU (Frankfurt) | EU region presence. |
| OLAC-2866 | (referenced) | Windows Console entity | RAT-EN-003. |
| OLAC-3801 | (referenced) | System Roles vs Customer Privileges separation | AUR-BR-019, 020. |
| OLAC-3810 | (referenced) | Permission model for CID/server operations | AUR-BR-033…038. |
| OLAC-4147 | Defect | Install Updates in Linux Cockpit causes CID 'Server disconnected' | Linux Update stability. |
| OLAC-4169 | Defect | Shutdown issues during remote session | Session resiliency. |
| OLAC-4294 | Story | Apply Linux updates | Patch delivery via Hub. |
| OLAC-4601 | Defect | Review Completed Injections not working on CDS Desktop | Remote desktop. |
| OLAC-4614 | Story | Beep codes for activation failures | CAR-P-011, CAR-BR-038…041. |
| OLAC-4713 | Defect | Server error launching remote CDS desktop and remote cockpit | Tunnel/console reliability. |
| OLAC-4752 | Story | Show log messages when configuring CID VM in customer environment | Audit visibility during install. |
| OLAC-4854 | (referenced) | FQDN + DNS suffix handling | NET-T-006, T-007. |
| OLAC-4949 | Story | Release NOV'23 Windows Update | Windows update release cadence. |
| OLAC-5163 | (referenced) | Health page response-time vs ICMP | NET-BR-014, 015. |
| OLAC-5171 | Feature | Support for CDS FR8 | CDS compatibility/release support. |
| OLAC-5274 | Defect | DNS search string update via DHCP requires 2 reboots | DNS handling. |
| OLAC-5413 | Defect | "Launch Cockpit" with SysAdmin role user 500 error | SYSTEM-account remote access path. |
| OLAC-5419 | Defect | Tunnel server 502 Bad Gateway on QA | Tunnel availability. |
| OLAC-5575 | Story | Add/update Windows updates | Hub-driven Windows update mgmt. |
| OLAC-5679 | Defect | Login to Linux cockpit fails using tunnel | Cockpit tunnel path. |
| OLAC-5743 | Defect | CID does not install after delete/re-add | Re-registration flow. |
| OLAC-5819 | Defect | Support contact email in "Contact Support" page doesn't exist | Vuln-disclosure intake. |
| OLAC-5847 | Defect | CDS desktop remains open when portal user auto-logged out due to inactivity | Session linkage. |
| OLAC-5878 | Defect | Tunnel session cannot be created — 500 | Tunnel reliability. |
| OLAC-5920 | Defect | (clone of 5878) | |
| OLAC-5932 | Defect | "reboot system" command not working in Staging | IoT command flow. |
| OLAC-6069 | Story | Upgrade Python version in tunnel EC2 docker | Tunnel runtime hygiene. |
| OLAC-6176 | Defect | IoT Certificate error after 9 days disconnected | DEV-BR-027. |
| OLAC-6243 | Story | Connectivity Tester - General Networking | NET-EN-005. |
| OLAC-6315 | Feature | [Supportability] Connectivity Tester | FR1.2 supportability. |
| OLAC-6442 | Story | Add test for nmap | NMAP connectivity check. |
| OLAC-6443 | Defect | cockpit doesn't launch using ip address in url | Cockpit URL behavior. |
| OLAC-6461 | Story | Update health page to include additional urls | Health page coverage. |
| OLAC-6547 | Defect | DNS suffix comparison case-sensitivity | NET-BR-029. |
| OLAC-6645 | Story | Release FR 1.2 Linux Update | Linux patch cadence. |
| OLAC-6702 | Defect | CID Registration fails when ECM 3.6 uses corporate (self-generated) SSL certificates | Driver of customer-CA feature. |
| OLAC-6938 | Story | Add "Custom CAs" to the Settings Menu (FR1.4) | Customer-managed CA UI. |
| OLAC-6941 | Story | Edit and Delete Certificate Authorities (FR1.4) | Customer-managed CA UX. |
| OLAC-6995 | Defect | Two URLs failing on hub health page | Endpoint health. |
| OLAC-7020 | Story | CID network share doesn't work with special characters in path/password | SMB intranet path. |
| OLAC-7046 | Story | Do not use PING exclusively for connectivity checks to olserver | Diagnostic robustness. |
| OLAC-7105 | Story | Release Linux update v2026.02.01 | Latest Linux update. |
| OLAC-7190 | Story | Manual factory reset without deleting CID in Hub | Factory reset path. |

---

## 12. Known gaps / unknowns

Phase 1.3 closed most of the original gap list. Closed items have been folded into the relevant sections above; this section now records (a) gaps that remain open with named owners, and (b) a cross-reference map from the original gap IDs (G-01…G-21 in `_gap-list.md`) to where their answers now live in this pack.

### 12a. Residual open gaps

| ID | Topic | Where in this pack | Owner | What's still needed |
|---|---|---|---|---|
| G-06 | Telemetry inventory + per-category retention | §3f / §3f-i | **Alok** | Field-level inventory of CID→Hub telemetry, sensitivity classification per field, and per-category retention windows. The 9-row data-types table is a category map, not a field-level inventory. |
| G-07 / G-17 | Hardware-side attestations + regulatory certifications | §8a | **Edison → Bhavani** | Any Lenovo attestation/certification documents (SOC 2 / ISO at the OEM, plus CE / FCC / UL / RoHS / REACH / WEEE certificate numbers) for the specific Lenovo SKU used as the CID. |
| G-18 | TPM 2.0 + measured-boot posture | §8c | **Alok** | Confirm whether the CID hardware exposes TPM 2.0 and whether measured boot is used. (Secure Boot is confirmed **disabled**.) |
| G-20 | Modernized Hub VPC architecture diagrams | §10 | **Sunil** | Re-author the four drawio diagrams in a current tool and produce publication-ready exports. |
| G-03 (sub) | Vulnerability-disclosure intake channel | §7e | **PM / Security** | Documented address/channel for customers and third-party researchers to report suspected vulnerabilities, plus acknowledgement and response timelines. OLAC-5819 noted the broken "Contact Support" email; needs a working replacement. |
| G-13 (sub) | AWS-IoT-side cert revocation for offline/extracted-cert CIDs | §6 | **PM / Security + AWS ops** | The `delete_ac` flow relies on the CID self-wiping when it receives the `is_deleted` shadow flag, and does not detach or deactivate the X.509 cert in AWS IoT Core. For lost/stolen devices that are offline (or whose cert+key was extracted), an out-of-band AWS-IoT-side detach/deactivate is required. Need a documented operational procedure (who runs it, expected time-to-revoke, audit trail). |

### 12b. Open Jira items that change documented behavior

These three Jira stories were opened during Phase 1.3 and will change what the security doc says about the CID. The doc should describe **both** today's state and the planned tightening so it remains accurate across the OLAC-7392/7394/7395 release window.

| Jira | Topic | Effect on doc |
|---|---|---|
| **OLAC-7392** | Unify CID outbound AWS URLs under `agilent.com` | Enables a narrowed, wildcard-free egress allow-list (G-08). |
| **OLAC-7394** | Migrate Linux yum repo from us-west-2 to us-east-1 | Removes the second region from the production footprint (G-04, G-12). |
| **OLAC-7395** | Restrict CID nginx to TLS 1.2+ | Drops TLSv1 / TLSv1.1 from the CID nginx listener (G-14). |

### 12c. Closed-gap cross-reference (Phase 1.3 → source pack)

| Gap | Section now containing the answer |
|---|---|
| G-01 (MFA) | §5b |
| G-02 (SSO/SAML/OIDC) | §5b |
| G-03 (Patch SLA / CVE) | §7e (and §12a sub-gap for intake channel) |
| G-04 (Data residency) | §3c |
| G-05 (Audit retention / tamper / SIEM) | §9b, §9c |
| G-08 (URL allow-list narrowing) | §3b |
| G-09 (Offline-CID notification) | §3e |
| G-10 (AD integration) | §1c |
| G-11 (21 CFR Part 11 / Annex 11) | §9e |
| G-12 (AWS regions list) | §3c |
| G-13 (X.509 lifetime + rotation) | §6 (and §12a sub-gap for revocation) |
| G-14 (TLS protocol versions) | §3b |
| G-15 (CDS sample-data backups) | §2c |
| G-16 (Antivirus scope / quarantine) | §2c |
| G-19 (Disk encryption at rest) | §8d |
| G-21 (Hardware supply-chain provenance) | §8a |

---

## Cross-cutting references

- Reverse-proxy nginx: `~/projects/work/ac_agent/nginx.conf`
- Cognito module: `~/projects/work/ac_aws/ac_ops/terraform/modules/cognito/cognito.tf`
- IoT module: `~/projects/work/ac_aws/ac_ops/terraform/modules/iot_v2/iot_v2.tf`
- Tunnel server module: `~/projects/work/ac_aws/ac_ops/terraform/modules/tunnel_server_v2/tunnel_server_v2.tf`
- Production environment: `~/projects/work/ac_aws/ac_ops/terraform/environments/hub-prd-51/hub-prd-51.tf`
- Agent IoT client: `~/projects/work/ac_agent/ac_client/ac_client/iot_client.py`
- Cert worker: `~/projects/work/ac_agent/ac_client/ac_client/cid_certificate_worker.py`
- Connectivity Tester: `~/projects/work/ac_agent/cid_connectivity/cid_connectivity.py`
- Original PDF text: `/tmp/security-pdf.txt`
- Plan: `/home/surehman/projects/personal/cid-knowledge/proposals/security-doc-rebuild-plan.md`
