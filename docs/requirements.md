---
sidebar_position: 3
---

# Requirements
## Networking Requirements
![CID NICs](./img/cid-nics.jpg)

Each CID is equipped with two network interfaces:
- **House (Corporate) NIC** – Connects to the corporate LAN and accessed to OpenLab Server and the internet.
- **Instrument NIC** – Connects to analytical instruments – directly or via instrument dedicated LAN/VLAN.

The 12-character MAC address for the “House” NIC and a 8-character PIN is printed on QR code sticker attached to the device. The PIN is used to link the physical CID with the CID Hub.

![QR code sticker](./img/qr-code.jpg)

| Component	| CID Networking |
| - | - |
| **House (corporate) NIC** | |
| - *Internet outbound* |	See “[Internet Requirements](#Internet-Requirements)” section below |
|	- *Internet inbound* | No inbound communication from internet required |
|	- *Intranet outbound*	| <UL><LI>DHCP, </LI><LI>DNS, </LI><LI>HTTPS, </LI><LI>ICMP: OLSS, OpenLab server, </LI><LI>HTTP/HTTPS: ECM 3.x, </LI><LI>SMB (optional)</LI></UL>
| - *Intranet inbound* | <UL><LI>ICMP, </LI><LI>HTTPS: for Acquisition server, diagnostics, remote work area, QualA, sample scheduler, Cockpit, noVNC/Websockify, </LI><LI>SSH: CID SSH service (needed when troubleshooting)</LI></UL> |
| **Instrument NIC** | |
| - *Internet outbound* | No outbound communication to internet required |
| - *Internet inbound* | No inbound communication from internet required |
| - *Intranet outbound* | Acquisition Server to Instrument communication (instrument specific port requirements), isolated & unrestricted communication recommended |
| - *Intranet inbound* | Instrument to Acquisition Server communication (instrument specific port requirements), isolated & unrestricted communication is recommended |

## Internet Requirements

CIDs make connections to the internet during activation as well as while getting security updates and performing other maintenance activities. It is also required for monitoring the CIDs. Resources in the following domains are accessed by the CIDs.

1. CID Hub and associated services:
    1. *.agilent.com (https)
    2. *.s3.amazonaws.com (https)
    3. *.s3.us-east-1.amazonaws.com (https)
    4. *.s3.us-west-2.amazonaws.com (http, https)
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

:::tip[Troubleshooting Tip]
As the CID boots up, it connects to the CID Hub. If the connection attempt fails, it will make a series of beeping sounds every 30 seconds.
- Beep (1): No network connection (check cables/NIC connections).
- Beep (2): Cannot contact CID Hub registration API (*.agilent.com). Possible firewall issue, incorrect NIC wiring, or internet outage.
- Beep (3): No linked CID in CID Hub (CID record not yet added).
- Beep (4): Activated CID cannot connect to registration API on bootup. If CDS is already installed and registered, CID beeps 4 times and continues boot; otherwise, beeps 4 times every 30 seconds. 

## DHCP and DNS Requirements
-  On first connection, CIDs use DHCP to acquire IP, DNS servers, and DNS search strings.
-  After activation, static configuration is possible.
-  Upon activation, CID updates its hostname from the factory default (agilent-cid) to the name specified in CID Hub, then reboots.
-  If DHCP servers support dynamic DNS registration (RFC 2136) of Linux systems, they will register the CID hostname automatically.
-  Otherwise, the desired CID hostnames must be explicitly registered using the device MAC address (printed on the QR code label) in DHCP and DNS.
-  During activation, CID validates name resolution using nslookup 'hostname'.
-  CDS clients **must** resolve CID hostnames to their IP addresses for proper operation.

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
| Physical Interfaces      | <UL><LI>Dual Gigabit LAN ports (RJ45 1 GB/second)</LI><LI>USB ports x 4</LI><LI>DisplayPort (video out)</LI><LI>HDMI (video out)</LI><LI>Mic IN</LI><LI>Audio OUT</LI><LI>Serial port (DB9) x 2 |
| Operating                | Temperature 0 to 50 °C                    |
| Power                    | 65 W (adapter included)                   |

## Software Compatibility
The CID Bundle for OpenLab CDS includes IoT hardware from Lenovo that has been fully tested and qualified to run OpenLab CDS 2.7 and above. The CID solution requires the deployment of the bundled IoT hardware as configured within the CID Hub. 
Reference: [Software Compatibility](./compatiblity.md)

**Delivery**: CID Hub only (manual installation not supported).

**Virtualization**: Virtualization of CIDs is not supported.

## Licensing
The CID Bundle for OpenLab CDS includes the following licensing:
- OpenLab CDS Software (2.7 and above)
- Instrument connection licenses (2)
  - Agilent physical instrument (LC or GC), or
  - Agilent 3D UV/DAD instrument, or
  - Agilent LC/MS or GC/MS

## Summary
The Agilent CID provides a standardized, secure, and resilient solution for OpenLab CDS client/server systems. With dual NICs for clear separation of corporate and instrument networks, centralized software configuration via CID Hub, and tested hardware/software bundles, it simplifies deployment while ensuring compliance with enterprise IT and laboratory requirements.
