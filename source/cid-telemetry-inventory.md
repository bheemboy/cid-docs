## Telemetry Inventory (CID → Hub)

| # | Field / Category | Description | Sensitivity | Direction |
|---|---|---|---|---|
| 1 | `mac_address` | Device MAC address used for registration | Low — device identifier | CID → Hub |
| 2 | `identity` / `platform` | OS type (e.g., oracle-linux) | Low | CID → Hub |
| 3 | `acImageVersion` / `acImageId` | CID agent firmware version | Low — operational | CID → Hub |
| 4 | `aicImageVersion` / `aicImageId` | Windows VM (AIC) image version | Low — operational | CID → Hub |
| 5 | `driverIds` | Installed CDS instrument driver versions | Low — operational | CID → Hub |
| 6 | `windowsUpdateIds` | Applied Windows updates list | Low — operational | CID → Hub |
| 7 | `ac_client.version` | Agent client version | Low | CID → Hub |
| 8 | `ac_update.version` | Update utility version | Low | CID → Hub |
| 9 | `instruments_info[]` | Connected instrument metadata (model, serial, status) — no sample/analytical data | Low | CID → Hub |
| 10 | `network_cards` | Linux host NIC config (IP, VLAN) | Medium — infrastructure | CID → Hub |
| 11 | `aic_network_cards` | Windows VM NIC config (IP, VLAN) | Medium — infrastructure | CID → Hub |
| 12 | `agent` | Daemon status, uptime | Low | CID → Hub |
| 13 | `cid_connectivity` | Connectivity status, last check, type | Low | CID → Hub |
| 14 | `aic.olss_server_fqdn` | OpenLab server hostname | Medium — infrastructure | CID → Hub |
| 15 | `aic.olss_connection_type` | Connection type to OLSS | Low | CID → Hub |
| 16 | `aic.olss_username` | OpenLab service account username | Medium — PII (internal user ID) | CID → Hub |
| 17 | `command` | Command name, status, progress, params | Low — operational | CID → Hub |
| 18 | `name` (thing_name) | Device hostname | Low | CID → Hub |
| 19 | `windows_vm` | VM state, uptime | Low | CID → Hub |
| 20 | `certificate_authorities` | CA list, sync status | Low | CID → Hub |
| 21 | `downloads[]` | Download progress (URL stripped before send) | Low | CID → Hub |
| 22 | `recent_cid_actions[]` | Event log entries (installs, reboots, config changes) | Low — operational | CID → Hub |
| 23 | `reported_date` | ISO 8601 timestamp of report | Low | CID → Hub |
| 24 | `version` | Incrementing state version number | Low | CID → Hub |

---

## Fields Explicitly Sanitized (Never Transmitted or Stripped Before Storage)

| Field | Reason |
|---|---|
| `ac_credentials[*].ac_admin_password` | Credential — removed at agent |
| `ac_credentials[*].agilentac_password` | Credential — removed at agent |
| `ac_credentials[*].ssh_private_key` | Private key — never leaves device |
| `aic_credentials[*].admin_password` | Credential — removed at agent |
| `aic_credentials[*].ssh_private_key` | Private key — never leaves device |
| `aic.olss_password` | Credential — removed before storage |
| `aic.tech_token` | Token — removed before storage |
| `software.downloads[*].url` | Presigned URLs stripped |

---

## Data Retention

| Data Category | Storage Location | Retention |
|---|---|---|
| ACReportedState (versioned history) | PostgreSQL (JSONB) | All historical versions retained (no documented TTL/purge policy found in codebase) |
| MostRecentACReportedState | PostgreSQL | Overwritten on each update (latest snapshot only) |
| ActivityLog | PostgreSQL | Retained indefinitely (no documented TTL/purge policy found in codebase) |
| IoT certificates | AWS IoT Core | Revoked on device deregistration |
| Device registration | PostgreSQL | Deleted when CID is removed from Hub |

No explicit retention period or automatic data purge policy defined. Retention is currently indefinite unless a CID is deleted from the Hub (which triggers cascade deletion of its reported states and activity logs).

---

## PII / Sensitive Data Confirmation

| Question | Answer |
|---|---|
| Does PII leave the device? | Minimal — only internal usernames (`olss_username`) and email addresses (for OLSS registration). No end-user PII. |
| Does customer sample data leave the device? | No — no analytical results, chromatograms, or sample identifiers are transmitted. |
| Does PHI leave the device? | No |
| Are credentials transmitted? | No — passwords and private keys are sanitized before transmission/storage. |
| Is data encrypted in transit? | Yes — all channels use TLS (HTTPS + MQTT/TLS). |

---

## Data Flow Channels Summary

| Channel | Direction | Contains Sensitive Data | Encryption |
|---|---|---|---|
| Device Registration | CID → Hub | No | HTTPS/TLS |
| IoT Credentials | Hub → CID | Yes (certificates) | HTTPS/TLS |
| Agent-Reported State | CID → Hub | No | HTTPS/TLS |
| Hub Commands | Hub → CID | Sometimes (config data) | MQTT/TLS |
| Software Downloads | Hub → CID | No | HTTPS/TLS |
| Password Updates | Hub → CID | Yes | MQTT/TLS |
| Activity Logs | CID → Hub | No | HTTPS/TLS |

---

## Data Privacy Statement

- No PHI (Protected Health Information) is transmitted or processed
- No PII is transmitted, except for internal user identifiers (usernames and email addresses)
- No laboratory data, analytical results, or customer sample data leaves the device
- All data is encrypted in transit via HTTPS/TLS and MQTT/TLS
