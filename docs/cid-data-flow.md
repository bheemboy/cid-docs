---
sidebar_position: 10
draft: true
---

# Data Flow and Privacy Overview

The information below describes the data flows between the CID device and the CID Management Hub, with a focus on data privacy, data types exchanged, and security controls applied during transmission.

---

## Data Privacy

- **No PHI (Protected Health Information)** is transmitted or processed.
- **No PII (Personally Identifiable Information)** is transmitted, except for **internal user identifiers** (usernames and email addresses).
- **No laboratory data, analytical results, or customer sample data** are transmitted or stored.
- All data exchanged between system components is **encrypted in transit** using industry-standard protocols (TLS).

---

## Data Types Summary

| Data Category | Direction | Contains Sensitive Data | Encryption | Customer Visible |
|--------------|----------|-------------------------|------------|------------------|
| Device Registration | CID → Hub | No | HTTPS / TLS | Yes (Portal) |
| IoT Credentials | Hub → CID | Yes (certificates) | HTTPS / TLS | No |
| Agent‑Reported State | CID → Hub | No | HTTPS / TLS | Yes (Portal) |
| Hub Commands | Hub → CID | Sometimes (configuration data) | MQTT / TLS | Yes (Portal) |
| Software Downloads | Hub → CID | No | HTTPS / TLS | Yes (Portal) |
| Password Updates | Hub → CID | Yes | MQTT / TLS | No |
| Activity Logs | CID → Hub | No | HTTPS / TLS | Yes (Portal) |
| Configuration Data | Bidirectional | Partial (IP addresses, hostnames) | HTTPS / MQTT / TLS | Yes (Portal) |
| User Actions | Portal → Hub | No | HTTPS / TLS | Yes (Portal) |
