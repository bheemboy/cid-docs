---
sidebar_position: 3
title: "Compatibility"
---

# Compatibility

The following matrices list the OpenLab CDS, server, driver, add-on, and
integration combinations supported on the CID as of CID Hub release 1.3
(April 2026).

---

## Operating Systems

| Component | Version | Notes |
|---|---|---|
| Host OS (Linux) | Oracle Linux 8.7 | Boot OS for all CIDs |
| Guest OS (Windows VM) | Windows 10 IoT Enterprise LTSC | Used by VM templates for CDS 2.8 Update 08 with FP2 and earlier |
| Guest OS (Windows VM) | Windows 11 IoT Enterprise LTSC | Used by VM templates for CDS 2.8 Update 09 and later |

---

## OpenLab Servers

| Server | Supported Versions |
|---|---|
| OpenLab ECM | 3.6 and above |
| OpenLab Server / OpenLab ECM XT | 2.7 and above |

---

## OpenLab CDS

The CID Hub provides pre-built virtual-machine templates for the following
OpenLab CDS releases.

| Release | Available Versions |
|---|---|
| OpenLab CDS 2.7 | 2.7.0.787, 2.7.0.787 Update 1, Update 2, Update 3 |
| OpenLab CDS 2.8 | 2.8.0.1515, Update 1, Update 2, Update 5, Update 7 with FP01, Update 8 with FP02, Update 9 with FP02 |

| Channel | Release Cadence in CID Hub |
|---|---|
| OpenLab CDS 2.8 | Within two weeks of general release |
| OpenLab CDS 2.7 | On demand |

---

## Instrument Drivers

The following Agilent instrument drivers are available in the CID Hub.
Specific versions are selectable per CID.

- Agilent 35900 A/D
- Agilent Data Player
- Agilent GC
- Agilent GC/MS
- Agilent LC
- Agilent LC/MS
- Agilent SS420x
- Agilent 7697A/8697 Headspace Control
- Agilent G1888 Headspace
- Agilent Micro GC
- Agilent PAL3 Sampler
- Agilent ELSD

| Channel | Release Cadence in CID Hub |
|---|---|
| Agilent instrument drivers | Within four weeks of general release on SubscribeNet |

---

## Add-On Software

| Add-On | Supported | Notes |
|---|---|---|
| Sample Scheduler for OpenLab | Yes | — |
| OpenLab Library Manager (DA Add-on) | Yes | Pre-installed in CDS 2.8 FP2 and above |
| GPC DA Add-on | Yes | CDS 2.8 only |
| 2D-LC Software | No | — |
| ADF Export | No | — |
| Relay Service (Lab Advisor) | No | — |

---

## Third-Party Instrument Drivers

| Driver Class | Supported | Notes |
|---|---|---|
| Non-Agilent and third-party drivers | No | — |

---

## Other Software and Integrations

| Feature | Supported on CID | Notes |
|---|---|---|
| NIST Library — automatic searches during unattended processing | No | Interactive searches remain available in OpenLab CDS Data Analysis on client machines. Automatic unattended searches require an AIC. |
| Network Assessment Tool (NAT) | No | The CID exposes a separate connectivity tester for diagnosing network issues. |
| Status Board for OpenLab | Coexists, but cannot monitor CIDs | CID monitoring and management is performed in the CID Hub. |
| Advanced Sample Linking (ASL) | Yes | Server-side application; no CID-side installation required. |
| Lab Assist Hub | Yes | Operates against InfinityLab LCs directly; no CID-side installation or configuration. |
| Online LC Monitoring | No | — |
| Dissolution | No | — |
