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

### <mark>Added</mark>

- Added integrated online help in the CID Hub console.
- Added support for GPC add-on v1.7.
  - The GPC v1.7 package is available in the add-on section of the Software Library.
  - GPC v1.7 can be installed on compatible OpenLab CDS versions (CDS 2.8 FP2 and earlier, excluding CDS 2.8 FP1).
- Added automatic selection of latest operating system updates:
  - The latest Windows Update and Linux OS are selected automatically and downloaded to CIDs in the background.
  - Installation is initiated by an administrator when CIDs are not in use.

### Changed

- Changed the OpenLab Server connectivity check to use TCP/HTTPS on port 443.
- Improved loading performance for the CIDs list page.
- Moved CDS, drivers, and add-ons to AWS CloudFront to improve worldwide download performance.

### <mark>Fixed</mark>

- Fixed CDS registration failing when a network interface is renamed. (#1336029)
- Fixed checksum validation not failing on a failed download. (#1336030)
- Fixed CID registration failing when OpenLab ECM 3.6 uses corporate (self-generated) SSL certificates. (#1260513)
- Fixed the CID network share failing when the share path or password contains special characters or spaces. (#1330232)
- Fixed the CID's subdomain not being appended to the DNS list when a CID is re-added after a factory reset. (#1259034)
- Fixed component software installation failing on the CID because of the AWS IoT Core JSON document limit. (#1311421)
- Fixed the CID summary page incorrectly showing a disconnected status. (#1319277)
- Fixed the CDS uptime not updating in the CID Hub when a CID is power-cycled. (#1215600)
- Fixed the download progress bar not advancing after a driver finished downloading on the CID software page. (#1299011)
- Fixed the inability to remove network share and password details from the OpenLab Server page. (#1362844)

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

### <mark>Fixed</mark>

- Fixed the download progress bar not matching between the CID's Summary and Software pages. (#978001)
- Fixed Test Services failing to load on OpenLab CDS 2.7. (#1091199)
- Fixed INFO logs going missing in Recent Activity on some CIDs after a period of time. (#1092355)
- Fixed CID registration logs missing in Recent Activity. (#1138942)
- Fixed Linux Cockpit failing to launch when an IP address is used in the URL. (#1197295)
- Fixed missing category filters in the Activity Log. (#1192764)
- Fixed IoT connection failures not being logged in Recent Activity. (#1191392)
- Fixed reverting to an older agent version failing. (#1202245)
- Fixed the inability to uninstall optional drivers. (#1216780)
- Fixed case-sensitive DNS suffix comparison that added duplicate subdomains to the DNS search list. (#1225185)
- Fixed the CID Hub portal and a CID's Recent Activity logs becoming inaccessible when a CID holds a large number of log records. (#1245281)

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

### <mark>Fixed</mark>

- Fixed the failure to log in to Linux Cockpit over the tunnel. (#1057510)
- Fixed the CID name overlapping the three-line navigation menu icon on mobile devices. (#1084227)
- Fixed the CID status incorrectly changing from connected to not installed. (#1138503)
