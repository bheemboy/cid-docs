---
sidebar_position: 4
slug: /troubleshooting/tcp-port-443-blocked
title: "TCP port 443 blocked"
description: Diagnose and resolve outbound TCP port 443 blocking that prevents the CID from reaching Agilent, AWS, and Microsoft endpoints.
toc_max_heading_level: 3
---

# TCP port 443 blocked

**Product**: Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience**: Agilent Support, IT/network administrators
**Support reference**: Network / firewall configuration

:::caution
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID cannot establish a TCP connection on port 443 to one or more required external endpoints. Connection attempts time out or are refused immediately. This may manifest as:

- The CID emits 2 beeps every 5 minutes during or after boot (see [Beep codes on startup](/troubleshooting/beep-codes-on-startup)).
- Software updates, package installations, or cloud-service communication fail entirely.
- HTTPS requests return connection-timeout errors rather than TLS errors.
- In CID Hub, the Recent Activity view shows entries such as `Unable to connect to AWS IoT endpoint. Restarting network services and agent.` These appear when AWS IoT is blocked but the Registration API is still reachable, since Recent Activity logging itself uses the Registration API.
- Alternatively, CID Hub shows the device as offline with no recent telemetry or activity entries at all. This pattern indicates the Registration API itself is unreachable, so the CID has no channel through which to report errors.

---

## Root cause

When TCP connections on port 443 fail outright, the most common causes are:

- **Port-level firewall rule**. The firewall is dropping or rejecting outbound TCP/443 from the CID's IP address or subnet.
- **Domain-based blocking at the TCP layer**. The firewall is inspecting the destination hostname (for example via DNS sinkholing) and blocking the connection before it is established.
- **Routing issue**. The CID's network route does not have a valid path to the internet.
- **Mandatory outbound proxy**. The customer's network requires that all outbound HTTP/HTTPS traffic flow through an explicit proxy. The CID does not support outbound proxy configuration; if a proxy is mandatory, the firewall must allow the CID to bypass it and reach the required endpoints directly.

---

## Confirm this is the right document

Use the following table to confirm that outbound TCP/443 is the failing layer.

| Where you came from | Next step |
|---|---|
| You ran [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) and one or more endpoints returned port-state `filtered`, `closed`, or a connection timeout | This is the correct document. Continue below. |
| You arrived from [Beep codes on startup](/troubleshooting/beep-codes-on-startup) Step 2 or Step 4 with `nc -zv` against the Registration API returning `Connection refused` or timing out | This is the correct document. Continue below. |
| The connectivity tester reported all endpoints as reachable, but the CID still fails | TCP 443 is reachable; the failure is at the TLS or application layer. See [TLS handshake failure](/troubleshooting/tls-handshake-failure). |
| You have not yet identified a specific endpoint that is failing | Run [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) first to identify the failing endpoint(s). |

If you are working from a direct console with no browser access to the connectivity tester, substitute `nc -zv <hostname> 443` against any of the canonical endpoints listed in the [Internet requirements](/reference/system-requirements#internet-requirements) section of System requirements to confirm a failing endpoint.

---

## Affected services

Outbound TCP/443 blocking affects every CID service that depends on the internet: activation and registration, telemetry to CID Hub, software updates, and image downloads. OpenLab Server communication is unaffected by this failure mode because the OLSS server is reached over the local LAN; see [OpenLab Server unreachable](/troubleshooting/openlab-server-unreachable) for that case. For the complete list of internet endpoints the CID requires, see the [Internet requirements](/reference/system-requirements#internet-requirements) section of System requirements.

---

## Prerequisites

- Command-line access to the CID via SSH or direct console connection.
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable.

:::tip
Before running manual diagnostics, use [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity), the built-in GUI tool that tests all required endpoints and is available even on unactivated CIDs.
:::

---

## Diagnostic steps

### Step 1. Identify the scope and shape of the block

Use the failed-endpoint list from [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity). The connectivity tester runs `nmap` with `-p 443` and `--traceroute` against every required endpoint, so its output already identifies the port state (`filtered` vs `closed`) and shows where the traffic stops.

Identify the scope of the block:

| Pattern in the connectivity tester results | Next step |
|---|---|
| All or most endpoints fail | Port 443 is broadly blocked for the CID. Continue to Step 2 to confirm whether the CID has any internet path. |
| Only AWS endpoints fail | A firewall rule is targeting `*.amazonaws.com`. Provide the connectivity tester results to your network team. See [Resolution](#resolution). |
| Only Agilent endpoints fail | A rule is targeting `*.agilent.com`. Provide the connectivity tester results to your network team. See [Resolution](#resolution). |
| Only one endpoint fails | A domain-specific rule is in effect. The affected domain must be added to the allowlist individually. See [Resolution](#resolution). |

Identify the shape of the block from the per-endpoint port state in the connectivity tester output:

| Port state in the connectivity tester output | Next step |
|---|---|
| `filtered` | The firewall is silently dropping packets. No reject message is sent back to the CID. See [Resolution](#resolution). |
| `closed` | The destination is actively refusing the connection. See [Resolution](#resolution). |
| Traceroute terminates at an internal IP | Traffic never leaves the corporate network. Continue to Step 4 to characterize the dropping hop. |


---

### Step 2. Verify basic internet connectivity

Confirm that the CID has any working internet path by testing a commonly permitted port.

```bash
nc -zv google.com 80
```

| Result | Next step |
|---|---|
| Connection fails | The CID has no outbound internet access at all, or the route to the internet is not functioning. Provide the result to your network team and request that they verify routing and the default gateway. |
| Connection succeeds | Internet connectivity exists, but port 443 is specifically restricted. Continue to Step 3. |

---

### Step 3. Check whether the network requires an outbound proxy

Some corporate networks require all outbound HTTP/HTTPS traffic to flow through an explicit proxy. The CID does not support outbound proxy configuration; if a proxy is mandatory, the firewall must explicitly allow the CID to bypass it.

```bash
env | grep -i proxy
```

| Result | Next step |
|---|---|
| No proxy variables set, and the network does not require a proxy | This step is not the cause. Continue to Step 4. |
| No proxy variables set, but the network requires a proxy | The CID cannot route through the corporate proxy. Request that your IT team add an allowlist rule that lets the CID reach the required endpoints directly. See the [Internet requirements](/reference/system-requirements#internet-requirements) section of System requirements for the full endpoint list. |
| Proxy variables are set in the environment | This is not a supported configuration. Remove the variables and apply the firewall allowlist approach above. |

---

### Step 4. Characterize the dropping hop

If Step 1 showed the traceroute terminating at an internal IP, use `mtr` to capture per-hop packet loss for the network team. This adds information the connectivity tester's single-pass traceroute does not provide.

```bash
# Replace <hostname> with the failing endpoint identified from
# the connectivity tester results or CID Hub Recent Activity.
# Example: hub-ac-registration-api.prd-51.aws.agilent.com

mtr --report --tcp --port 443 <hostname>
```

| Result | Next step |
|---|---|
| The report shows packet loss starting at an internal hop | The block is inside the corporate network. Provide the full output and the connectivity tester results to your network team. See [Resolution](#resolution). |
| The report reaches the destination with no loss, or loss begins beyond the corporate edge | TCP/443 is not blocked at the network layer. Re-check the per-endpoint port state in Step 1, then see [TLS handshake failure](/troubleshooting/tls-handshake-failure). |

---

## Resolution

Provide the diagnostic output from the diagnostic steps to your network security team and request the appropriate action.

| Recommended action | Applicable when |
|---|---|
| Permit outbound TCP/443 to all required CID endpoints | All four destinations in Step 1 failed |
| Add domain-specific allowlist rules for the affected service group | Only specific domains failed in Step 1 |
| Verify default gateway and internet routing for the CID | Step 2 showed no internet connectivity at all |
| Add a firewall allowlist that lets the CID bypass the corporate outbound proxy and reach the required endpoints directly | Step 3 identified that a proxy is required |
| Review firewall rules for silently filtered traffic | Step 1 showed port state `filtered` |
| Open firewall rules to allow the destination to accept the connection | Step 1 showed port state `closed` |
| Investigate the dropping hop with your network team | Step 1 showed the traceroute terminating internally; Step 4 identified the hop |

---

## Related documents

- [Beep codes on startup](/troubleshooting/beep-codes-on-startup)
- [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity)
- [TLS handshake failure](/troubleshooting/tls-handshake-failure)
- [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection)
- [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure)
- [DNS resolution failure](/troubleshooting/dns-resolution-failure)
- [OpenLab Server unreachable](/troubleshooting/openlab-server-unreachable)
- [Internet requirements](/reference/system-requirements#internet-requirements) in System requirements
