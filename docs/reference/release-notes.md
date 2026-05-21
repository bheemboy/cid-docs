---
sidebar_position: 4
title: "Release notes"
toc_max_heading_level: 2
---

# Release notes

Release notes for the Agilent Connected Instrument Device (CID) and CID Hub.

## 1.3.0 — April 2026

---

> **Action required:** the new OpenLab Server connectivity check uses TCP/HTTPS (port 443) and requires the latest Linux update to be installed before it takes effect.

### Added

- Added integrated online help in the CID Hub console.
- Added support for GPC add-on v1.7.
  - The GPC v1.7 package is available in the add-on section of the software library.
  - GPC v1.7 can be installed on compatible CDS versions (CDS 2.8 FP2 and earlier, excluding CDS 2.8 FP1).
- Added automatic selection of latest operating system updates:
  - The latest Windows Update and Linux OS are selected automatically and downloaded to CIDs in the background.
  - Installation is initiated by an administrator when CIDs are not in use.

### Changed

- Changed the OpenLab Server connectivity check to use TCP/HTTPS on port 443.
- Improved loading performance for the CIDs list page.
- Moved CDS, drivers, and add-ons to AWS CloudFront to improve worldwide download performance.

### Fixed

- Fixed CDS Registration fails when renaming NICs failed. (#1336029)
- Fixed Checksum validation did not fail on a failed download. (#1336030)
- Fixed CID Registration fails when ECM 3.6 uses corporate (self-generated) SSL certificates. (#1260513)
- Fixed CID network share doesn't work if sharepath and/or password contain special characters or spaces. (#1330232)
- Fixed On re-adding a CID after a factory reset, it did not append CID's subdomain to DNS list. (#1259034)
- Fixed Components Software installation failing on CID due to AWS IOT json document limit. (#1311421)
- Fixed CID summary page incorrectly shows disconnected. (#1319277)
- Fixed "CDS Uptime" in hub is not updated if CID is powercycled. (#1215600)
- Fixed Download progress bar is not moving even though the driver is downloaded in CID software page. (#1299011)
- Fixed User cannot remove network share and password info from the openlab server page. (#1362844)

## 1.2.0 — September 2025

---

### Added

- Added an add-on section in the Software Library in CID Hub.
  - Added support for Sample Scheduler 2.7 and 2.8.
- Added support for a "CID Network Share" into which CIDs save downloaded CDS KVMs. CIDs look for and use already-downloaded files in this share before downloading them from the CID Hub.
- Added a "Connectivity Tester" app in Linux Cockpit for CIDs, used to test internet connectivity from the CID.
- Added Linux Update 2025.09.01, which includes the CID Agent, Connectivity Tester, Oracle Linux security updates, antivirus definitions, and Linux package updates.
- Added the following Agilent instrument drivers:
  - Agilent GC v4.3.235.
  - Agilent LC v3.9.56 and v3.10.37.
  - Agilent 7697A/8697 Headspace Control v4.3.117.
  - Agilent Micro GC v2.6.8.0.
- Added the following OpenLab CDS updates:
  - OpenLab CDS 2.8.0.1515 Update 1 [1021H2].
  - OpenLab CDS 2.8.0.1515 Update 2 [1021H2].
  - OpenLab CDS 2.8.0.1515 Update 5 [1021H2].
  - OpenLab CDS 2.8.0.1515 Update 7 with Feature Pack 01 [1021H2].
  - OpenLab CDS 2.8.0.1515 Update 8 with Feature Pack 02 [1124H2] (Windows 11 based).

### Fixed

- Fixed Download progress bar not matching between CID's Summary & Software pages. (#978001)
- Fixed Test Services cannot be loaded on CDS 2.7. (#1091199)
- Fixed On some CIDs, INFO logs in RA are missing after some time. (#1092355)
- Fixed Registering CID logs missing in RA. (#1138942)
- Fixed Cockpit doesn't launch using IP address in URL. (#1197295)
- Fixed Missing category filters in 'Activity Logs'. (#1192764)
- Fixed IoT Connection failures are not being logged in RA. (#1191392)
- Fixed Reverting to older agent failing. (#1202245)
- Fixed Unable to uninstall optional drivers in QA. (#1216780)
- Fixed DNS suffix comparison is case-sensitive, resulting in duplicate subdomains being added to the DNS search list. (#1225185)
- Fixed Hub portal and CID's Recent Activity logs inaccessible if CID contains huge number of log records. (#1245281)

## 1.1.0 — December 2024

---

### Added

- Added support for OpenLab CDS 2.8.
- Added the following Agilent instrument drivers:
  - Agilent 7697A/8697 Headspace Control v4.0.79.
  - Agilent 7697A/8697 Headspace Control v4.1.181.
  - Agilent Data Player v2.5.11.
  - Agilent G1888 Headspace v1.09.2.7.
  - Agilent GC v4.0.107.
  - Agilent Micro GC v2.5.5.0.
  - Agilent PAL3 Sampler v2.9.8.0.

### Fixed

- Fixed Login to Linux cockpit fails using tunnel. (#1057510)
- Fixed Mobile Devices- CIDs name overlaps with three horizontal lines. (#1084227)
- Fixed CID status changing from "connected" to "not installed". (#1138503)
