---
sidebar_position: 2
title: "System Requirements"
---

# Requirements
## Networking Requirements
![CID NICs](./img/cid-nics.jpg)

Each CID is equipped with two network interfaces:
- **House NIC** – Connects to the corporate LAN and accessed to OpenLab Server and the internet.
- **Instrument NIC** – Connects to analytical instruments – directly or via instrument dedicated LAN/VLAN.

The 12-character MAC address for the “House” NIC and a 8-character PIN is printed on QR code sticker attached to the device. The PIN is used to link the physical CID with the CID Hub.

![QR code sticker](./img/qr-code.jpg)

| Component	| CID Networking |
| - | - |
| **House NIC** | **Connects to corporate LAN and internet** |
| - *Internet outbound* |	See “[Internet Requirements](#internet-requirements)” section below |
|	- *Internet inbound* | No inbound communication from internet required |
| - *Intranet outbound*	| <ul> <li>DHCP, </li> <li>DNS, </li> <li>HTTPS, </li> <li>ICMP: OLSS, OpenLab server, </li> <li>HTTP/HTTPS: ECM 3.x, </li> <li>SMB (optional)</li> </ul> |
| - *Intranet inbound* | <ul> <li>ICMP, </li> <li>HTTPS: for Acquisition server, diagnostics, remote work area, QualA, sample scheduler, Cockpit, noVNC/Websockify, </li> <li>SSH: CID SSH service (needed when troubleshooting)</li> </ul> |
| **Instrument NIC** | **Connects to Instrument** |
| - *Internet outbound* | No outbound communication to internet required |
| - *Internet inbound* | No inbound communication from internet required |
| - *Intranet outbound* | Acquisition Server to Instrument communication (instrument specific port requirements), isolated & unrestricted communication recommended |
| - *Intranet inbound* | Instrument to Acquisition Server communication (instrument specific port requirements), isolated & unrestricted communication is recommended |

---

## Internet Requirements

CIDs make connections to the internet during activation as well as while getting security updates and performing other maintenance activities. It is also required for monitoring the CIDs. Resources in the following domains are accessed by the CIDs.

1. CID Hub and associated services:
    1. *.agilent.com (https)
    2. *.s3.amazonaws.com (https)
    3. *.s3.us-east-1.amazonaws.com (https)
    4. *.s3.us-west-2.amazonaws.com (https)
    5. *.iot.us-east-1.amazonaws.com (https)
2. Microsoft Windows Updates:
    1. *.cloudfront.net (https)
    2. *.azureedge.net (https)
    3. *.oneget.org (https)
    4. *.trafficmanager.net (https)
    5. *.blob.core.windows.net (https)
    6. *.azurefd.net (https)
    7. *.microsoft.com (https)
    8. *.powershellgallery.com (https)
3. NTP Server
    1. *.pool.ntp.org (ntp)

:::info
Firewall must be configured to allow communications from the CIDs to the sites listed above.
:::

Internet access is not required for CDS functionality. It is used only for administration, monitoring, and software configuration management.

:::tip
As the CID boots up, it connects to the CID Hub. If the connection attempt fails, it will make a series of beeping sounds every 30 seconds.
- 1 Beep: No network connection (check cables/NIC connections).
- 2 Beeps: Cannot contact CID Hub registration API (*.agilent.com). Possible firewall issue, incorrect NIC wiring, or internet outage.
- 3 Beeps: No linked CID in CID Hub (CID record not yet added).
- 4 Beeps: Activated CID cannot connect to registration API on bootup. If CDS is already installed and registered, CID beeps 4 times and continues boot; otherwise, beeps 4 times every 30 seconds. 
:::


---

## DHCP and DNS Requirements
-  On first connection, CIDs use DHCP to acquire IP, DNS servers, and DNS search strings.
-  After activation, static configuration is possible.
-  Upon activation, CID updates its hostname from the factory default (agilent-cid) to the name specified in CID Hub, then reboots.
-  If DHCP servers support dynamic DNS registration (RFC 2136) of Linux systems, they will register the CID hostname automatically.
-  Otherwise, the desired CID hostnames must be explicitly registered using the device MAC address (printed on the QR code label) in DHCP and DNS.
-  During activation, CID validates name resolution using nslookup 'hostname'.
-  CDS clients **must** resolve CID hostnames to their IP addresses for proper operation.

---

## SSL Certificate Requirements for HTTPS

### ECM 3.x
To successfully run an ECM 3.x server over HTTPS in an environment with CIDs, you must use a **publicly trusted SSL certificate**.
Certificates issued by internal, corporate, or self-signed certificate authorities (CAs) are not recognized by CIDs.

### **ECM XT / OpenLab Server**
Certificates issued by internal, corporate, or self-signed certificate authorities (CAs) as well as publicly trusted certificates may be used for running an ECM XT / OpenLab Servers over https in an environment with CIDs.


---

## Optional Network Share
The CIDs optionally support using an SMB (Server Message Block) share accessible over the local LAN. In environments with large number of CIDs, this helps optimize performance and reduce internet bandwidth requirements.
This SMB share should be reachable from the device with at least read permissions to fetch required files. When write access is also granted, the device can automatically copy downloaded files back into the share, making them available for other devices and preventing repeated downloads from the internet.
- CIDs can access a shared SMB folder over the LAN.
- Full access (recommended): Save (cache) downloaded CDS VM images for reuse by other CIDs.
- Read access: copy cached CDS VM images from network share instead of downloading it from CID Hub.
- Configurable during OpenLab Server registration or later via CID Hub.

:::info
1. After making changes to server settings, CIDs need to be rebooted for them to recognize the changes.
2. The User Principal Name (UPN) format for userids is recommended (e.g., username@domain.com).
:::


---

## Supported Topologies

### 1. Direct instrument connection
- House NIC connects to the corporate LAN.
- Instrument NIC connects directly to the instrument.
- Example: Instrument set to static IP 192.168.1.2, CID Instrument NIC set to 192.168.1.3.

![Direct instrument connection](./img/direct-instrument-connection.jpg)

### 2. Instrument LAN/VLAN Connection
- House NIC connects to the corporate LAN.
- Instruments and CID are placed on a dedicated LAN or VLAN.
- Instrument IP assignment may be DHCP or static.

![Instrument LAN/VLAN Connection](./img/instrument-lan-connection.jpg)

---

## Hardware Specification
The Agilent provided CID Bundle for OpenLab CDS includes IoT hardware from Lenovo that has been fully tested and qualified to run OpenLab CDS 2.7 and above.

| Component                | CID IoT Hardware for Agilent OpenLab CDS  |
|--------------------------|-------------------------------------------|
| Form Factor              | Fanless IoT device (44 x 151 x 195 mm)    |
| Processor                | Intel Atom 1.9 GHz                        |
| Hard Disk                | 1 TB SSD                                  |
| Memory                   | 16 GB DDR4 3200 SoDIMM                    |
| Graphics                 | Integrated graphics                       |
| Instrument Configuration | 1:1                                       |
| Operating                | Temperature 0 to 50 °C                    |
| Power                    | 65 W (adapter included)                   |
| Physical Interfaces      | <ul> <li>Dual Gigabit LAN ports (RJ45 1 GB/second)</li> <li>USB ports x 4</li> <li>DisplayPort (video out)</li> <li>HDMI (video out)</li> <li>Mic IN</li> <li>Audio OUT</li> <li>Serial port (DB9) x 2 </li> </ul> |

---

## Software Compatibility
The CID Bundle for OpenLab CDS includes IoT hardware from Lenovo that has been fully tested and qualified to run OpenLab CDS 2.7 and above. The CID solution requires the deployment of the bundled IoT hardware as configured within the CID Hub. 
Reference: [Software Compatibility](./compatiblity.md)

**Delivery**: CID Hub only (manual installation not supported).

**Virtualization**: Virtualization of CIDs is not supported.

---

## Licensing
The CID Bundle for OpenLab CDS includes the following licensing:
- OpenLab CDS Software (2.7 and above)
- Instrument connection licenses (2)
  - Agilent physical instrument (LC or GC), or
  - Agilent 3D UV/DAD instrument, or
  - Agilent LC/MS or GC/MS

---

## Summary
The Agilent CID provides a standardized, secure, and resilient solution for OpenLab CDS client/server systems. With dual NICs for clear separation of corporate and instrument networks, centralized software configuration via CID Hub, and tested hardware/software bundles, it simplifies deployment while ensuring compliance with enterprise IT and laboratory requirements.
