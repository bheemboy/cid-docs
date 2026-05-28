---
sidebar_position: 2
slug: /cid-net-01
title: "CID-NET-01: TCP port 443 blocked"
description: Diagnose and resolve outbound TCP port 443 blocking that prevents the CID from reaching Agilent, AWS, and Microsoft endpoints.
toc_max_heading_level: 3
---

# CID-NET-01: TCP port 443 blocked

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/network administrators
**Support reference:** Network / firewall configuration

:::warning[For IT administrators only]
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID cannot establish a TCP connection on port 443 to one or more required external endpoints. Connection attempts time out or are refused immediately. This may manifest as:

- The CID emits **2 beeps** every 5 minutes during or after boot (see [**CID-BOOT-01** — Beep codes on startup](/cid-boot-01)).
- Software updates, package installations, or cloud-service communication fail entirely.
- HTTPS requests return connection-timeout errors rather than TLS errors.
- In **CID Hub**, the **Recent Activity** view shows entries such as *"Unable to connect to AWS IoT endpoint. Restarting network services and agent."* These appear when AWS IoT is blocked but the Registration API is still reachable, since Recent Activity logging itself uses the Registration API.
- Alternatively, **CID Hub** shows the device as offline with no recent telemetry or activity entries at all. This pattern indicates the Registration API itself is unreachable, so the CID has no channel through which to report errors.

---

## Root cause

When TCP connections on port 443 fail outright, the most common causes are:

- **Port-level firewall rule.** The firewall is dropping or rejecting outbound TCP/443 from the CID's IP address or subnet.
- **Domain-based blocking at the TCP layer.** The firewall is inspecting the destination hostname (for example via DNS sinkholing) and blocking the connection before it is established.
- **Routing issue.** The CID's network route does not have a valid path to the internet.
- **Mandatory outbound proxy.** The customer's network requires that all outbound HTTP/HTTPS traffic flow through an explicit proxy. The CID does not support outbound proxy configuration; if a proxy is mandatory, the firewall must allow the CID to bypass it and reach the required endpoints directly.

---

## Confirm this is the right document

| Where you came from | Next step |
|---|---|
| You ran [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00) and one or more endpoints returned port-state `filtered`, `closed`, or a connection timeout | This is the correct document. Continue below. |
| You arrived from [**CID-BOOT-01** — Beep codes on startup](/cid-boot-01) Step 2 or Step 4 with `nc -zv` against the Registration API returning `Connection refused` or timing out | This is the correct document. Continue below. |
| CID-NET-00 reported all endpoints as reachable, but the CID still fails | TCP 443 is reachable; the failure is at the TLS or application layer. See [**CID-NET-02** — TLS handshake failure](/cid-net-02). |
| You have not yet identified a specific endpoint that is failing | Run [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00) first to identify the failing endpoint(s). |

If you are working from a direct console with no browser access to CID-NET-00, substitute `nc -zv <hostname> 443` against any of the canonical endpoints listed in [System requirements, Internet requirements](/reference/system-requirements#internet-requirements) to confirm a failing endpoint.

---

## Affected services

Outbound TCP/443 blocking affects every CID service that depends on the internet: activation and registration, telemetry to CID Hub, software updates, and image downloads. OpenLab server communication is unaffected by this failure mode because the OLSS server is reached over the local LAN; see [**CID-NET-06** — OpenLab server unreachable](/cid-net-06) for that case. For the complete list of internet endpoints the CID requires, see [System requirements, Internet requirements](/reference/system-requirements#internet-requirements).

---

## Prerequisites

- Command-line access to the CID via SSH or direct console connection.
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable.

:::tip[First step]
Before running manual diagnostics, use [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00), the built-in GUI tool that tests all required endpoints and is available even on unactivated CIDs.
:::

---

## Diagnostic steps

### Step 1. Identify the scope and shape of the block

Use the failed-endpoint list from [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00). The Connectivity Tester runs `nmap` with `-p 443` and `--traceroute` against every required endpoint, so its output already identifies the port state (`filtered` vs `closed`) and shows where the traffic stops.

Identify the **scope** of the block:

| Pattern in the CID-NET-00 results | Interpretation |
|---|---|
| All or most endpoints fail | Port 443 is broadly blocked for the CID. Continue to Step 2 to confirm whether the CID has any internet path. |
| Only AWS endpoints fail | A firewall rule is targeting `*.amazonaws.com`. Provide the CID-NET-00 results to your network team. |
| Only Agilent endpoints fail | A rule is targeting `*.agilent.com`. Provide the CID-NET-00 results to your network team. |
| Only one endpoint fails | A domain-specific rule is in effect. The affected domain must be added to the allowlist individually. |

Identify the **shape** of the block from the per-endpoint port state in the CID-NET-00 output:

| Port state in CID-NET-00 output | Interpretation |
|---|---|
| `filtered` | The firewall is silently dropping packets. No reject message is sent back to the CID. |
| `closed` | The destination is actively refusing the connection. |
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
| No proxy variables set, but the network requires a proxy | The CID cannot route through the corporate proxy. Request that your IT team add an allowlist rule that lets the CID reach the required endpoints directly. See [System requirements, Internet requirements](/reference/system-requirements#internet-requirements) for the full endpoint list. |
| Proxy variables are set in the environment | This is not a supported configuration. Remove the variables and apply the firewall allowlist approach above. |

---

### Step 4. Characterize the dropping hop

If Step 1 showed the traceroute terminating at an internal IP, use `mtr` to capture per-hop packet loss for the network team. This adds information CID-NET-00's single-pass traceroute does not provide.

```bash
# Replace <hostname> with the failing endpoint identified from
# the CID-NET-00 results or CID Hub Recent Activity.
# Example: hub-ac-registration-api.prd-51.aws.agilent.com

mtr --report --tcp --port 443 <hostname>
```

Provide the full output to your network security team along with the CID-NET-00 results.

---

## Resolution

Provide the diagnostic output from the steps above to your network security team and request the appropriate action.

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

- [**CID-BOOT-01** — Beep codes on startup](/cid-boot-01)
- [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00)
- [**CID-NET-02** — TLS handshake failure](/cid-net-02)
- [**CID-NET-03** — SSL inspection and certificate substitution](/cid-net-03)
- [**CID-NET-04** — NTP time synchronization failure](/cid-net-04)
- [**CID-NET-05** — DNS resolution failure](/cid-net-05)
- [**CID-NET-06** — OpenLab server unreachable](/cid-net-06)
- [System requirements, Internet requirements](/reference/system-requirements#internet-requirements)
