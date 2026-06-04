---
sidebar_position: 3
slug: /troubleshooting/dns-resolution-failure
title: "DNS resolution failure"
description: Diagnose and resolve DNS resolution failures that prevent the CID from contacting Agilent, AWS, Microsoft, or NTP endpoints by name.
toc_max_heading_level: 3
---

# DNS resolution failure

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/network administrators
**Support reference:** Network / firewall configuration

:::warning[For IT administrators only]
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID cannot resolve one or more external hostnames, so connections fail before they reach the firewall. DNS failures resemble firewall blocks superficially and must be ruled out early. The visible symptoms depend on whether DNS is broadly broken or selectively failing.

**Broad DNS failure** (the CID cannot resolve any required hostname, including the Registration API):

- A brand-new CID stalls or fails activation with no specific error string surfaced.
- The CID disappears from **CID Hub** entirely after a network change. There are no recent telemetry entries and no error messages in **Recent Activity**, because Recent Activity logging itself depends on Registration API hostname resolution.

**Selective DNS failure** (the Registration API still resolves, but specific hostnames such as AWS IoT do not):

- The CID is visible in **CID Hub** but cannot exchange telemetry, accept Hub-initiated commands, or complete software updates.
- **Recent Activity** shows entries such as *"Error resolving IoT MQTT endpoint `<URL>`"*. These messages can surface only when the Registration API itself is still resolving and reachable.

---

## Root cause

Every CID network connection starts with DNS resolution. DNS queries are sent over **UDP port 53** (and TCP/53 for large responses). If the CID's configured DNS servers are unreachable, returning incorrect results, or having their queries filtered, every hostname-based connection fails regardless of whether the firewall otherwise permits the traffic.

Common DNS failure modes:

- **DNS server unreachable.** The CID's configured DNS servers are not reachable from the CID's network segment.
- **DNS sinkholing.** The firewall or internal DNS server is intentionally returning no result or an incorrect IP for certain domains (for example `*.amazonaws.com`) as a blocking mechanism.
- **Split-horizon DNS.** Internal DNS servers do not forward queries for public domains to external resolvers.
- **DHCP misconfiguration.** The CID received incorrect or stale DNS server addresses via DHCP.

---

## Confirm this is the right document

| Where you came from | Next step |
|---|---|
| You ran [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) and one or more endpoints reported a hostname-resolution failure | This is the correct document. Continue below. |
| Logs or **CID Hub** Recent Activity show *"Error resolving IoT MQTT endpoint…"* or similar resolution errors | This is the correct document. Continue below. |
| A direct `nslookup` returns `NXDOMAIN`, `SERVFAIL`, or times out for a CID-required hostname | This is the correct document. Continue below. |
| Hostnames resolve but connections still fail | DNS is not the problem. See [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked) or [TLS handshake failure](/troubleshooting/tls-handshake-failure). |
| You have not yet identified that DNS is the failing layer | Run [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) first. |

---

## Affected services

DNS failures affect every CID service that contacts an endpoint by name: activation and registration, telemetry to **CID Hub**, AWS IoT messaging, software downloads, NTP synchronization, and Microsoft CDN access. For the complete list of internet endpoints the CID requires, see the [Internet requirements](/reference/system-requirements#internet-requirements) section of System requirements.

---

## Prerequisites

- Command-line access to the CID via SSH or direct console connection.
- The connectivity tester results, or a specific failing hostname from logs or **CID Hub** Recent Activity.
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable.

---

## Diagnostic steps

### Step 1. Identify the scope of the resolution failure

the connectivity tester already runs `nmap -v --script=resolveall --traceroute -p 443` against every required endpoint, so its output identifies which hostnames failed to resolve. Use that result to determine the scope.

| Pattern in the connectivity tester results | Interpretation |
|---|---|
| All endpoints fail to resolve | The CID cannot reach its DNS servers, or the DNS servers are not forwarding external queries. |
| Only `*.amazonaws.com` endpoints fail to resolve | DNS sinkholing may be in effect for AWS domains. |
| Only `*.agilent.com` endpoints fail to resolve | DNS sinkholing or split-horizon misconfiguration for Agilent domains. |
| Only one endpoint fails to resolve | A specific DNS block or missing record. |
| Intermittent failures | DNS server availability or performance issue. |

If you are working from a direct console with no browser access to the connectivity tester, substitute `nslookup` against any of the canonical endpoints listed in the [Internet requirements](/reference/system-requirements#internet-requirements) section of System requirements to identify failing hostnames, then return to the result table for this step.

---

### Step 2. Identify the configured DNS servers

Display the DNS servers the CID is currently using.

```bash
cat /etc/resolv.conf
```

Note the `nameserver` entries and share them with your network team. Verify that the listed DNS servers are intended to service the CID's network segment and are capable of resolving public internet hostnames.

---

### Step 3. Test DNS server reachability over UDP/53

Confirm the CID can reach its configured DNS servers on UDP/53.

```bash
# Replace <dns-server-ip> with the nameserver IP address from
# /etc/resolv.conf (Step 2 output).
# Example: 192.168.1.1

nc -uzv <dns-server-ip> 53
```

If this fails, the CID cannot reach its DNS server. Escalate to your network team to verify that the CID's subnet has UDP/53 access to the DNS server.

---

### Step 4. Query a public DNS server directly

Bypass the configured DNS server and query a public resolver to determine whether the issue is specific to the CID's assigned DNS server or general DNS connectivity.

```bash
nslookup hub-ac-registration-api.prd-51.aws.agilent.com 8.8.8.8
```

| Result | Interpretation |
|---|---|
| Resolves successfully via `8.8.8.8` but not via the configured server | The CID's assigned DNS server is the problem — it may be sinkholing, misconfigured, or unable to forward external queries. |
| Fails via both | DNS traffic may be broadly blocked, or the CID has no internet path for DNS queries. |

:::note
If direct queries to public DNS servers are not permitted by your network policy, this step may time out. That result is itself informative: it indicates DNS traffic to external resolvers is filtered.
:::

---

### Step 5. Test DNS over TCP/53

Some environments block UDP/53 but permit TCP/53, or vice versa. This isolates the discrepancy.

```bash
# Replace <dns-server-ip> with the nameserver IP address from
# /etc/resolv.conf (Step 2 output).
# Example: 192.168.1.1

nc -zv <dns-server-ip> 53
```

If TCP/53 succeeds but UDP/53 (Step 3) failed, report this discrepancy to your network team; it indicates inconsistent DNS port filtering.

---

## Resolution

Provide the diagnostic output from the diagnostic steps to your network security team and request the appropriate action.

| Recommended action | Applicable when |
|---|---|
| Verify the CID's DNS servers can resolve public internet hostnames | Step 1 showed all external domains failing |
| Remove DNS sinkhole entries for the affected domain group | Step 1 showed only specific domains failing |
| Permit UDP/53 and TCP/53 from the CID's subnet to its DNS servers | Step 3 or Step 5 showed DNS server unreachable |
| Reconfigure the DNS server assignment on the Corporate NIC | Step 2 showed incorrect or unexpected DNS servers |
| Configure DNS forwarding on internal DNS servers for external domains | Step 4 showed resolution succeeds via public DNS but not via the assigned server |

DNS server assignment on the CID is managed through the **CID Hub** Networking page (Corporate NIC settings) or via DHCP. To change the assigned DNS servers, update the Corporate NIC configuration in **CID Hub** or adjust the DHCP scope that serves the CID.

---

## Related documents

- [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity)
- [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked)
- [TLS handshake failure](/troubleshooting/tls-handshake-failure)
- [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection)
- [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure)
- [OpenLab server unreachable](/troubleshooting/openlab-server-unreachable)
- [Internet requirements](/reference/system-requirements#internet-requirements) in System requirements
