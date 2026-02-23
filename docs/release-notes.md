---
sidebar_position: 7
---

# Release Notes

## CID Hub release 1.3 (Apr 2026)

- Integrated Online Help
- Added support for GPC add-on v1.7
  - GPC v1.7 package is available in the add-on section of the software library.
  - Administrators can install GPC v1.7 on compatible CDS versions (CDS 2.8 FP2 and earlier, excluding CDS 2.8 FP1).
- Automatic selection of latest Operating System updates:
  - Latest Windows Update and Linux OS are automatically selected by the system and CIDs download it automatically.
  - Administrators have to initiate the installation when CIDs are not in use.
- OpenLab Server connectivity check enhanced to use TCP/HTTPS (port 443) check. PS: This requires new Linux Update to be installed.
- Improved loading performance for the CIDs list page.
- CDS, drivers, and add-ons are hosted in AWS Cloudfront. Improves worldwide download performance.
- Defect fixes
  - 1336029 - CDS Registration fails when renaming NICs failed
  - 1336030 - Checksum validation did not fail on a failed download
  - 1260513 - CID Registration fails when ECM 3.6 uses corporate (self-generated) SSL certificates
  - 1330232 - CID network share doesn't work if sharepath and/or password contain special characters or spaces
  - 1259034 - On re-adding a CID after a factory reset, it did not append CID's subdomain to DNS list
  - 1311421 - Components Software installation failing on CID due to AWS IOT json document limit
  - 1319277 - CID summary page incorrectly shows disconnected
  - 1215600 - "CDS Uptime" in hub is not updated if CID is powercycled
  - 1299011 - Download progress bar is not moving even though the driver is downloaded in CID software page
  - 1362844 - User cannot remove network share and password info from the openlab server page


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

---

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


