---
sidebar_position: 6
slug: /troubleshooting/tls-handshake-failure
title: "TLS handshake failure"
description: Diagnose and resolve TLS handshake failures when TCP port 443 is reachable but the encrypted session is terminated by a network device.
toc_max_heading_level: 3
---

# TLS handshake failure

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/network administrators
**Support reference:** Network / firewall configuration

:::warning[For IT administrators only]
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID can establish a TCP connection to an external endpoint on port 443, but the HTTPS session fails immediately during the TLS handshake. The connection is terminated by a network device before any encrypted data is exchanged. This may manifest as:

- TLS / SSL errors appear in CID agent logs against external CID endpoints (for example, `SSL_ERROR_SYSCALL` or a connection reset during the TLS handshake).
- The CID emits **2 beeps** every 5 minutes during or after boot, but [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked) has been ruled out and TCP/443 is confirmed reachable.
- In **CID Hub**, the **Recent Activity** view shows entries such as *"Unable to connect to AWS IoT endpoint. Restarting network services and agent."* when the TLS handshake to AWS IoT is being terminated by a firewall.

---

## Root cause

When TCP connectivity is confirmed but the TLS handshake fails, the most common causes are:

- **Domain or SNI-based blocking.** The firewall reads the Server Name Indication (SNI) field in the TLS Client Hello and drops connections to disallowed domains (for example `*.amazonaws.com`).
- **TLS version filtering.** The firewall is configured to block specific TLS versions, preventing the handshake from completing.
- **Firewall policy resetting TLS traffic.** A security rule resets the connection upon detection of TLS negotiation to certain destinations.

A separate condition, **SSL inspection**, also produces a TLS-layer failure but presents differently: the handshake completes, and the server certificate returned to the CID has a corporate or internal issuer rather than the expected public CA. SSL inspection requires a different resolution path. See [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection).

---

## Confirm this is the right document

| Where you came from | Next step |
|---|---|
| You ran [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) and all endpoints reported TCP/443 reachable, but the CID still fails with TLS / SSL errors | This is the correct document. Continue below. |
| You arrived from [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked) after confirming TCP/443 is reachable | This is the correct document. Continue below. |
| You arrived from [Beep codes on startup](/troubleshooting/beep-codes-on-startup) Step 2 or Step 4 with `nc -zv` succeeding but the beep pattern persisting | This is the correct document. Continue below. |
| TCP/443 is blocked or the connection times out | See [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked) instead. |
| Logs or earlier output show a server certificate with a corporate / internal issuer | This is SSL inspection, not a hard TLS block. See [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection) instead. |
| You have not yet identified that TLS is the failing layer | Run [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) first. |

---

## Affected services

A TLS handshake failure affects every CID service that communicates over HTTPS: activation and registration, telemetry to **CID Hub**, AWS IoT messaging, software downloads, and Microsoft CDN access. For the complete list of internet endpoints the CID requires, see [System requirements, Internet requirements](/reference/system-requirements#internet-requirements).

---

## Prerequisites

- Command-line access to the CID via SSH or direct console connection.
- The the connectivity tester results, or the failing endpoint hostname from logs or **CID Hub** Recent Activity.
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable.

---

## Diagnostic steps

### Step 1. Observe where the TLS handshake terminates

Initiate a full TLS negotiation and capture detailed output to identify exactly where the connection is closed.

```bash
# Replace <hostname> with the failing endpoint identified from
# the connectivity tester results or CID Hub Recent Activity.
# Example: hub-ac-registration-api.prd-51.aws.agilent.com

openssl s_client -connect <hostname>:443 -debug 2>&1 | head -40
```

**Healthy output:** the server returns a full certificate chain, followed by session details.

**Output confirming this failure mode:** the connection terminates immediately after the Client Hello with no response from the server, for example:

```
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to <hostname>:443
* Closing connection 0
```

| Result | Next step |
|---|---|
| Connection closes immediately after Client Hello with no server response | The firewall is dropping the TLS handshake. Continue to Step 2. |
| Server returns a certificate, but the issuer is corporate or internal | This is SSL inspection. See [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection). |
| Server returns a certificate with the expected public issuer, and the handshake completes | TLS is succeeding to this endpoint. Recheck which endpoint is actually failing. |

Collect this output for your network security team.

---

### Step 2. Test TLS version filtering

Some firewall policies block specific TLS versions. Run both commands to determine whether one version succeeds while the other fails.

```bash
# Replace <hostname> with the failing endpoint identified from
# the connectivity tester results or CID Hub Recent Activity.
# Example: hub-ac-registration-api.prd-51.aws.agilent.com

curl -v --tlsv1.2 --tls-max 1.2 https://<hostname>
curl -v --tlsv1.3 https://<hostname>
```

| Result | Next step |
|---|---|
| TLS 1.2 succeeds, TLS 1.3 fails | The firewall is blocking TLS 1.3. Request that your network team permit TLS 1.3 for outbound HTTPS. |
| TLS 1.2 fails, TLS 1.3 succeeds | The firewall is blocking TLS 1.2. Request that your network team permit TLS 1.2 for outbound HTTPS. |
| Both fail | TLS version filtering is not the cause. The connection is being dropped based on destination domain or SNI. Continue to Step 3. |

---

### Step 3. Determine the scope of the block

Identify whether the block is limited to one endpoint or applies broadly to a class of domains. This scopes the firewall change your network team needs to make.

```bash
curl -v https://hub-ac-registration-api.prd-51.aws.agilent.com
curl -v https://a3cb4mwmdz2oep-ats.iot.us-east-1.amazonaws.com
curl -v https://agilent-aws-prd-51-ac-images.s3.amazonaws.com
curl -v https://microsoft.com
```

| Pattern in the results | Interpretation |
|---|---|
| All four fail at TLS | SNI-based or TLS-version filtering is applied broadly to outbound HTTPS. |
| Only `*.amazonaws.com` endpoints fail | The firewall is targeting AWS endpoints by SNI. |
| Only `*.agilent.com` endpoints fail | The firewall is targeting Agilent endpoints by SNI. |
| Only one endpoint fails | A domain-specific SNI rule is in effect. The affected domain must be added to the allowlist individually. |

Share the results with your network security team. For the complete list of required hostnames, see [System requirements, Internet requirements](/reference/system-requirements#internet-requirements).

---

### Step 4. Characterize the network path

If Step 1 showed the handshake terminating with no server response, identify where in the path the reset originates. The connectivity tester's traceroute already shows hop-by-hop progress; `mtr` adds per-hop packet loss.

```bash
# Replace <hostname> with the failing endpoint identified from
# the connectivity tester results or CID Hub Recent Activity.
# Example: hub-ac-registration-api.prd-51.aws.agilent.com

mtr --report --tcp --port 443 <hostname>
```

Provide the output to your network security team along with the Step 1 capture. A path that loses packets at an internal hop indicates the TLS reset originates from a corporate appliance rather than the destination.

---

## Resolution

Provide the diagnostic output from the steps above to your network security team and request the appropriate action.

| Recommended action | Applicable when |
|---|---|
| Permit TLS 1.3 for outbound HTTPS | Step 2 showed TLS 1.3 failing while TLS 1.2 succeeded |
| Permit TLS 1.2 for outbound HTTPS | Step 2 showed TLS 1.2 failing while TLS 1.3 succeeded |
| Add SNI / domain allowlist rules for the affected service group | Step 3 identified one or more blocked domain groups |
| Investigate the dropping hop with your network team | Step 4 identified an internal hop that resets the connection |
| Switch to the SSL inspection workflow | Step 1 returned a corporate certificate issuer; use [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection) |

---

## Related documents

- [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity)
- [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked)
- [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection)
- [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure)
- [DNS resolution failure](/troubleshooting/dns-resolution-failure)
- [Beep codes on startup](/troubleshooting/beep-codes-on-startup)
- [System requirements, Internet requirements](/reference/system-requirements#internet-requirements)
