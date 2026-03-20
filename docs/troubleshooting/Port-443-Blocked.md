---
sidebar_position: 1
title: CID-NET-01 TCP Port 443 Blocked
---

# TCP Port 443 Blocked

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/Network Administrators
**Support Reference:** Network / Firewall Configuration

---

## Symptom

The CID is unable to establish any connection to one or more external service endpoints. Connection attempts time out or are refused immediately. This may manifest as:

- The CID emitting **2 beeps** repeatedly every 30 seconds during or after boot
- Software updates, package installations, or cloud service communication failing entirely
- HTTPS requests returning connection timeout errors rather than SSL errors

---

## Confirm This Is the Right Document

Run the following command, substituting the hostname of the failing service:

```bash
nc -zv <hostname> 443
```

| Result | Next Step |
|---|---|
| `Connection refused` or request times out | This is the correct document. Continue below. |
| `Connection succeeded` | TCP port 443 is reachable. The failure is at the TLS layer. Refer to **CID-NET-02: TLS Handshake Failure** instead. |

---

## Affected Services

Port 443 blocking can affect any CID service that communicates over HTTPS. The following domains require outbound TCP access on port 443:

| Domain | Purpose |
|---|---|
| `*.agilent.com` | CID Hub registration, activation, and management |
| `*.s3.amazonaws.com` | AWS S3 file transfers (general) |
| `*.s3.us-east-1.amazonaws.com` | AWS S3 file transfers (US East 1) |
| `*.s3.us-west-2.amazonaws.com` | AWS S3 file transfers (US West 2) |
| `*.iot.us-east-1.amazonaws.com` | AWS IoT Core — device telemetry and management |
| `*.microsoft.com` | Windows Update and Microsoft services |
| `*.cloudfront.net` | Microsoft CDN for update delivery |
| `*.oneget.org` | Package management |
| `*.trafficmanager.net` | Microsoft Azure traffic management |
| `*.blob.core.windows.net` | Microsoft Azure Blob Storage |
| `*.azurefd.net` | Microsoft Azure Front Door CDN |
| `*.powershellgallery.com` | PowerShell module repository |

---

## Root Cause

When TCP connections on port 443 fail outright, the most common causes are:

- **Port-level firewall rule** — The firewall is dropping or rejecting all outbound TCP traffic on port 443 from the CID's IP address or subnet
- **Domain-based blocking at the TCP layer** — The firewall is inspecting the destination hostname via DNS sinkholing or similar mechanism and blocking the connection before it is established
- **Routing issue** — The CID's network route does not have a valid path to the internet
- **Proxy requirement** — The network requires outbound traffic to be routed through an explicit proxy, which the CID is not configured to use

---

## Prerequisites

Before proceeding, please ensure the following conditions are met:

- Command-line access to the CID via SSH or direct console connection
- The following utilities are available on the system: `nc` (netcat), `curl`, `nmap`, `tracepath`, and `mtr`
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable

---

## Diagnostic Steps

### Step 1 — Confirm the Scope of the Block

Test connectivity across multiple service domains to determine whether port 443 is blocked broadly or only for specific destinations.

```bash
# Test Agilent Hub
nc -zv api.agilent.com 443

# Test AWS S3
nc -zv s3.amazonaws.com 443

# Test AWS IoT
nc -zv iot.us-east-1.amazonaws.com 443

# Test Microsoft Update
nc -zv windowsupdate.microsoft.com 443
```

| Result | Interpretation |
|---|---|
| All fail | Port 443 is blocked broadly for the CID. A general firewall rule is likely preventing all outbound HTTPS traffic. |
| Only AWS domains fail | A firewall rule is specifically targeting `*.amazonaws.com` traffic. |
| Only one domain fails | A domain-specific rule is in effect. The affected domain may need to be added to the allowlist individually. |

---

### Step 2 — Verify Basic Internet Connectivity

Confirm that the CID has a working internet path at all by testing on a port that is commonly permitted.

```bash
nc -zv google.com 80
```

**If this also fails:** The CID may have no outbound internet access at all, or the network route to the internet is not functioning. Escalate to your network team to verify routing and default gateway configuration.

**If this succeeds:** Internet connectivity exists but port 443 is specifically restricted. Continue to Step 3.

---

### Step 3 — Check for a Required Proxy

Some corporate networks require all outbound HTTP/HTTPS traffic to be routed through an explicit proxy server. If a proxy is required but not configured on the CID, all direct connections to port 443 will fail.

```bash
# Check whether a system-wide proxy is currently configured
env | grep -i proxy
```

If no proxy variables are set but your network requires one, please contact your IT team to obtain the correct proxy server address and port. Proxy configuration for the CID should be applied through the CID Hub.

---

### Step 4 — Use nmap to Confirm Port State

`nmap` provides more detailed information about the port state than `nc`, distinguishing between ports that are filtered (silently dropped by a firewall) versus actively refused.

```bash
nmap -p 443 <hostname>
```

| nmap Result | Interpretation |
|---|---|
| `open` | Port is reachable — unexpected if nc also failed. Recheck nc results. |
| `filtered` | Firewall is silently dropping packets. No reject message is being sent. |
| `closed` | Destination is actively refusing the connection. |

Share the nmap output with your network security team along with the results from Steps 1–3.

---

### Step 5 — Trace the Network Path

Identifies where in the network path traffic is being dropped. Useful for confirming whether the block is occurring at the corporate firewall, an upstream device, or elsewhere.

```bash
tracepath <hostname>
```

For more detailed per-hop output including packet loss:

```bash
mtr --report --tcp --port 443 <hostname>
```

Provide the full output to your network security team. A path that terminates at an internal IP address indicates the traffic is not reaching the internet.

---

## Resolution

Provide the diagnostic output from the steps above to your network security team and request the appropriate action:

| Recommended Action | Applicable When |
|---|---|
| Permit outbound TCP (port 443) to all CID internet endpoints | All destinations in Step 1 failed |
| Add domain-specific allowlist rules for the affected service group | Only specific domains failed in Step 1 |
| Verify default gateway and internet routing for the CID | Step 2 showed no internet connectivity at all |
| Configure proxy settings on the CID via CID Hub | Step 3 identified a proxy requirement |
| Review firewall rules for silently filtered traffic | Step 4 returned `filtered` state |

The complete list of domains requiring outbound HTTPS access is provided in the [Affected Services](#affected-services) section above.

---

## Related Documents

- **CID-NET-02** — TLS Handshake Failure
- **CID-NET-03** — SSL Inspection / Certificate Substitution
- **CID-NET-04** — NTP Time Synchronization Failure
- **CID-NET-05** — DNS Resolution Failure
