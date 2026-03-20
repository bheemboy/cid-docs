---
sidebar_position: 5
title: DNS-Resolution-Failure
---

# CID-NET-05: DNS Resolution Failure

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/Network Administrators
**Support Reference:** Network / Firewall Configuration

---

## Symptom

The CID is unable to resolve one or more external hostnames, preventing connections from being established even when the network path and firewall rules are otherwise correct. This may manifest as:

- Connection attempts failing with `Could not resolve host` errors:

```
curl: (6) Could not resolve host: api.agilent.com
```

- Services failing inconsistently or intermittently, particularly after network changes
- NTP synchronization failures where the NTP server hostname cannot be resolved
- CID Hub communication errors that appear similar to firewall blocks but persist after port 443 is confirmed open

DNS failures can closely resemble firewall blocks in their symptoms. It is important to rule out DNS as a cause early in any network troubleshooting process.

---

## Confirm This Is the Right Document

Run the following command:

```bash
nslookup api.agilent.com
```

| Result | Next Step |
|---|---|
| Returns one or more IP addresses | DNS is resolving correctly for this hostname. If connectivity still fails, refer to **CID-NET-01** or **CID-NET-02**. |
| Returns `NXDOMAIN`, `SERVFAIL`, or times out | This is the correct document. Continue below. |

---

## Background

All CID network communication depends on DNS to resolve hostnames to IP addresses before a connection can be attempted. DNS queries are sent over **UDP port 53** (and TCP port 53 for large responses). If the CID's configured DNS servers are unreachable, returning incorrect results, or if DNS traffic is being filtered, all hostname-based connections will fail — regardless of whether the firewall otherwise permits the traffic.

Common DNS-related failure modes include:

- **DNS server unreachable** — The CID's configured DNS servers are not accessible from its network segment
- **DNS sinkholing** — The firewall or DNS server is intentionally returning no result or an incorrect IP for certain domains (e.g., `*.amazonaws.com`) as a blocking mechanism
- **Split-horizon DNS issues** — Internal DNS servers do not forward queries for public domains to external resolvers
- **DHCP misconfiguration** — The CID received incorrect DNS server addresses via DHCP

---

## Prerequisites

Before proceeding, please ensure the following conditions are met:

- Command-line access to the CID via SSH or direct console connection
- The following utilities are available on the system: `nslookup`, `nc` (netcat), and `curl`
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable

---

## Diagnostic Steps

### Step 1 — Test Resolution of All Required Domains

Attempt to resolve each domain required by the CID. This identifies whether the failure is isolated to specific domains or affects all external hostname resolution.

```bash
# Agilent Hub
nslookup api.agilent.com

# AWS S3
nslookup s3.amazonaws.com
nslookup s3.us-west-2.amazonaws.com
nslookup s3.us-east-1.amazonaws.com

# AWS IoT
nslookup iot.us-east-1.amazonaws.com

# Microsoft Update
nslookup windowsupdate.microsoft.com

# NTP
nslookup pool.ntp.org
```

Document which domains resolve successfully and which do not. Share the full output with your IT team.

| Pattern | Interpretation |
|---|---|
| All domains fail to resolve | The CID cannot reach its DNS servers, or the DNS servers are not forwarding external queries |
| Only AWS domains fail | DNS sinkholing may be in effect for `*.amazonaws.com` |
| Only one domain fails | A specific DNS block or missing record is in place |
| Intermittent failures | DNS server availability or performance issue |

---

### Step 2 — Identify the Configured DNS Servers

Displays the DNS servers currently in use by the CID.

```bash
cat /etc/resolv.conf
```

Note the `nameserver` entries and share them with your IT team. Verify that the listed DNS servers are intended to service the CID's network segment and that they are capable of resolving public internet hostnames.

---

### Step 3 — Test DNS Server Reachability

Confirms that the CID can reach its configured DNS servers on UDP port 53.

```bash
# Replace <dns-server-ip> with the IP address from /etc/resolv.conf
nc -uzv <dns-server-ip> 53
```

**If this fails:** The CID cannot reach its DNS server. This may indicate a routing or firewall issue on the internal network. Escalate to your IT team to verify that the CID's subnet has access to the DNS server.

---

### Step 4 — Query a Public DNS Server Directly

Bypasses the configured DNS server and queries a public resolver directly. This helps determine whether the issue is with the CID's assigned DNS server specifically, or with DNS connectivity in general.

```bash
nslookup api.agilent.com 8.8.8.8
```

| Result | Interpretation |
|---|---|
| Resolves successfully via `8.8.8.8` but not via the configured server | The CID's assigned DNS server is the problem — it may be sinkholing, misconfigured, or unable to forward external queries |
| Fails via both | DNS traffic may be broadly blocked, or the CID has no internet path for DNS queries |

> **Note:** If direct queries to public DNS servers are not permitted by your network policy, this step may time out. That result itself is informative — it indicates DNS traffic to external resolvers is filtered.

---

### Step 5 — Test DNS Over TCP

Some environments block UDP port 53 but permit TCP port 53, or vice versa. This tests TCP-based DNS connectivity.

```bash
nc -zv <dns-server-ip> 53
```

If TCP port 53 succeeds but UDP port 53 (Step 3) failed, report this discrepancy to your IT team as it indicates inconsistent DNS port filtering.

---

## Resolution

Provide the diagnostic output from the steps above to your network security team and request the appropriate action:

| Recommended Action | Applicable When |
|---|---|
| Verify that the CID's DNS servers can resolve public internet hostnames | Step 1 showed all external domains failing |
| Remove DNS sinkhole entries for `*.amazonaws.com` or other CID domains | Step 1 showed only specific domains failing |
| Permit UDP and TCP port 53 from the CID's subnet to its DNS servers | Step 3 showed DNS server unreachable |
| Reconfigure DNS server assignment via DHCP or static network settings | Step 2 showed incorrect or unexpected DNS servers |
| Configure DNS forwarding on internal DNS servers for external domains | Step 4 showed resolution succeeds via public DNS but not via assigned server |

> **Note:** DNS server configuration changes on the CID should be applied through the CID Hub or via static network configuration. Contact Agilent Support for assistance if DNS settings need to be updated on the device.

---

## Related Documents

- **CID-NET-01** — TCP Port 443 Blocked
- **CID-NET-02** — TLS Handshake Failure
- **CID-NET-03** — SSL Inspection / Certificate Substitution
- **CID-NET-04** — NTP Time Synchronization Failure
