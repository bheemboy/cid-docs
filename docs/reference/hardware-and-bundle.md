---
sidebar_position: 2
title: "Hardware and Bundle"
---

# <mark>Hardware and Bundle</mark>

This page describes what Agilent ships as a CID — the hardware specification, manufacturing provenance, delivery and virtualization model, on-device security posture, and what is included under the CID's licensing. For the customer-side obligations a deployment must satisfy, see [System Requirements](./system-requirements). For the software compatibility matrices (Operating Systems, OpenLab CDS, drivers, add-ons), see [Compatibility](./compatibility).

---

## Hardware Specification

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

---

## Delivery and Virtualization

- **Delivery:** The CID is delivered as the bundled IoT hardware with the Agilent gold image already applied. Manual installation onto customer-supplied hardware is not supported.
- **Virtualization:** Running the CID software in a customer-managed hypervisor is not supported. The qualification, patching, and support model assumes the Agilent-supplied device.

---

## Licensing

The CID Bundle for OpenLab CDS includes the following licensing:

- OpenLab CDS Software (2.7 and later)
- Instrument connection licenses (2)
  - Agilent physical instrument (LC or GC), or
  - Agilent 3D UV/DAD instrument, or
  - Agilent LC/MS or GC/MS
