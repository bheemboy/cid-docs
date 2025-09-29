---
sidebar_position: 5
---

# Release Notes

## CID Hub release 1.2.1 (Sep 2025)

## CID Hub release 1.2 (Sep 2025)

- Added an add-on section in Software Library in CID Hub
  - Added support for Sample Scheduler 2.7, and 2.8
- Added support for a “CID Network Share” into which CIDs save downloaded CDS KVMs. CIDs look for and use already downloaded files in this share before downloading them from the CID Hub
- Added “Connectivity Tester” app in Linux Cockpit for CIDs. This is used to test internet connectivity from the CID
- Linux Update 2025.09.01: Includes CID Agent, Connectivity Tester, Oracle Linux security updates, Antivirus definitions, Linux package updates
- New drivers
  - Agilent GC v4.3.235
  - Agilent LC v3.9.56 & v3.10.37
  - Agilent 7697A/8697 Headspace Control v4.3.117
  - Agilent Micro GC v2.6.8.0
- CDS Updates
  - OpenLab CDS 2.8.0.1515 Update 1 [1021H2]
  - OpenLab CDS 2.8.0.1515 Update 2 [1021H2]
  - OpenLab CDS 2.8.0.1515 Update 5 [1021H2]
  - OpenLab CDS 2.8.0.1515 Update 7 with Feature Pack 01 [1021H2]
  - OpenLab CDS 2.8.0.1515 Update 8 with Feature Pack 02 [1124H2] (Windows 11 based)
- Defect fixes
  - 978001 - Download progress bar not matching between CID's Summary & Software pages
  - 1091199 - Test Services cannot be loaded on CDS 2.7
  - 1092355 - On some CIDs, INFO logs in RA are missing after some time
  - 1138942 - Registering CID logs missing in RA
  - 1197295 - Cockpit doesn't launch using IP address in URL
  - 1192764 - Missing category filters in 'Activity Logs'
  - 1191392 - IoT Connection failures are not being logged in RA
  - 1202245 - Reverting to older agent failing
  - 1216780 - Unable to uninstall optional drivers in QA
  - 1225185 - DNS suffix comparison is case-sensitive, resulting in duplicate subdomains being added to the DNS search list
  - 1245281 - Hub portal and CID's Recent Activity logs inaccessible if CID contains huge number of log records

## CID Hub release 1.1 (Dec 2024)

- Support for CDS 2.8
- New drivers
  - Agilent 7697A/8697 Headspace Control v4.0.79
  - Agilent 7697A/8697 Headspace Control v4.1.181
  - Agilent Data Player v2.5.11
  - Agilent G1888 Headspace v1.09.2.7
  - Agilent GC v4.0.107
  - Agilent Micro GC v2.5.5.0
  - Agilent PAL3 Sampler v2.9.8.0
- Defect fixes
  - 1057510 - Login to Linux cockpit fails using tunnel
  - 1084227 - Mobile Devices- CIDs name overlaps with three horizontal lines
  - 1138503 - CID status changing from "connected" to "not installed"

