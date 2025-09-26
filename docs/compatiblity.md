---
sidebar_position: 4
---

# Compatibility

## Operating System
- Oracle Linux v8.7: Used as the bootup OS for CIDs.
- Windows 10 IoT Ent LTSC: Used by virtual machine templates corresponding to CDS version 2.8 Update 07 with FP1 and prior releases.
- Windows 11 IoT Ent LTSC: Used by virtual machine templates up to CDS version 2.8 Update 08 with FP2 and above.

## OpenLab Servers
CIDs work with the following server software.
- OpenLab ECM (3.6 and above)
- OpenLab Server / OpenLab ECM XT (2.7 and above)

## OpenLab CDS
CID Hub offers pre-built virtual machines for the following versions of
OpenLab CDS AIC software.
- OpenLab CDS v2.7
  - 2.7.0.787
  - 2.7.0.787 Update 1
  - 2.7.0.787 Update 2
  - 2.7.0.787 Update 3
- OpenLab CDS v2.8
  - 2.8.0.1515
  - 2.8.0.1515 Update 1
  - 2.8.0.1515 Update 2
  - 2.8.0.1515 Update 5
  - 2.8.0.1515 Update 7 with Feature Pack 1
  - 2.8.0.1515 Update 8 with Feature Pack 2

:::note
Updates for OpenLab CDS v2.8 are typically made available in the CID Hub within 2 weeks of general release. Currently, updates for OpenLab CDS v2.7 are made available on demand.
::: 

## Instrument Drivers
The following Agilent instrument drivers are available in the CID Hub. Users can choose specific versions to install and use on their CIDs.
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

:::note
New versions of supported instrument drivers are typically available in the CID Hub within 4 weeks of general release on SubscribeNet.
:::

## Add-on Software (for AIC/CID)
The following add-on software are currently available on the CID Hub.
- Sample Scheduler
- OpenLab Library Manager DA Add-on (pre-installed in CDS v2.8 FP2)
The following are not yet available for CIDs
- GPC DA Add-on
- 2D-LC Software
- ADF Export
- Relay Service (Lab Advisor)

:::caution 
This list may not be complete. Contact the product manager for details on other add-on software.
:::

## 3rd Party Drivers
Non-Agilent and 3rd party instrument drivers are not currently available for CIDs.

## NIST Library Search
Automatic NIST library searches during unattended processing are not supported on the CID. However, interactive searches can be performed in OpenLab CDS Data Analysis by installing the NIST Library on client machines. When automatic searches during unattended processing are needed, an AIC is required.

## Network Assessment Tool (NAT)
The current version of NAT cannot be executed on the CID. However, CIDs have a separate connectivity tester tool that should be used in case of connectivity issues. CIDs test and report connection and compatibility to server as they are activated.

## Status Board for OpenLab
It is possible to have "Status Board" for OpenLab alongside CIDs. However, CIDs cannot be monitored or managed using the Status Board. CID software management, maintenance, and administration are performed from the CID Hub (https://hub.cid.agilent.com/).

## Advanced Sample Linking (ASL)
ASL is a server-side application that does not require any installation on CIDs. ASL can be used in installations that have CIDs.

## Lab Assist Hub
Lab Assist Hub is a tablet-style user interface for InfinityLab LCs that allow users to control, visually inspect, and perform maintenance. It does not require any installation or configuration on the CIDs. Lab Assist Hub can be used in installations that have CIDs.

## Online LC Monitoring
This is currently not supported by CIDs.

## Dissolution
This is currently not supported by CIDs.
