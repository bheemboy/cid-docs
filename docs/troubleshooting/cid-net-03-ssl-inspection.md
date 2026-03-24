---
sidebar_position: 3
slug: /cid-net-03
---

# CID-NET-03: SSL Inspection / Certificate Substitution

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/Network Administrators
**Support Reference:** Network / Firewall Configuration

---

## Symptom

The CID can establish a TCP connection to an external service endpoint on port 443, and the TLS handshake completes, but HTTPS requests fail with certificate validation errors. This may appear as:

```
curl: (60) SSL certificate problem: unable to get local issuer certificate
curl: (60) SSL certificate problem: certificate verify failed
```

Alternatively, this condition may be identified as part of investigating a TLS handshake failure ([CID-NET-02](/cid-net-02)), where Step 2 of that document reveals a corporate or internal certificate authority is being presented instead of the expected server certificate.

---

## Confirm This Is the Right Document

Run the following command, substituting the hostname of the failing service:

```bash
openssl s_client -connect <hostname>:443 2>/dev/null | openssl x509 -noout -issuer -subject
```

| Result | Next Step |
|---|---|
| Issuer shows Amazon, Microsoft, or another recognized public CA | SSL Inspection is not active. Refer to [**CID-NET-02: TLS Handshake Failure**](/cid-net-02) if connections are still failing. |
| Issuer shows a corporate, internal, or unrecognized CA | This is the correct document. Continue below. |
| Command returns no certificate output at all | The connection is being blocked before the handshake completes. Refer to [**CID-NET-02: TLS Handshake Failure**](/cid-net-02). |

---

## Background

SSL Inspection (also referred to as TLS Inspection or HTTPS Deep Packet Inspection) is a security feature present in many enterprise firewalls and security appliances. When active, the appliance:

1. Intercepts the outbound TLS connection from the CID
2. Establishes its own separate TLS session with the destination server
3. Re-encrypts the traffic and presents a new certificate to the CID — signed by the appliance's internal certificate authority

This allows the appliance to inspect encrypted traffic for security purposes. However, the CID only trusts publicly recognized certificate authorities for external cloud services. When a corporate CA certificate is presented instead of the expected server certificate, the CID rejects the connection.

> **Important:** Corporate or self-signed certificate authorities cannot be added to the CID's trust store for external cloud service endpoints. The required resolution is an SSL Inspection Bypass — not certificate installation.

---

## Affected Services

SSL Inspection can affect all CID services that communicate over HTTPS. For the complete list of required domains, see [System Requirements → Internet Requirements](/system-requirements#internet-requirements).

---

## Prerequisites

Before proceeding, please ensure the following conditions are met:

- Command-line access to the CID via SSH or direct console connection
- The following utilities are available on the system: `openssl` and `curl`
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable

---

:::tip[First Step]
Before running manual diagnostics, use the [CID Connectivity Tester](/troubleshooting/cid-connectivity-tester) — a built-in GUI tool that tests all required endpoints and is available even on unactivated CIDs.
:::

## Diagnostic Steps

### Step 1 — Identify the Certificate Being Presented

Retrieve the full certificate chain that the firewall is presenting to the CID for each affected service. This output will be required by your network security team to identify which inspection policy is in effect.

```bash
openssl s_client -connect <hostname>:443 2>/dev/null | openssl x509 -noout -issuer -subject -dates
```

Run this command for each affected domain and collect the output. A corporate CA in the issuer field confirms SSL Inspection is active for that destination.

---

### Step 2 — Determine the Scope of Inspection

Test multiple service domains to establish whether SSL Inspection is applied broadly or only to specific destinations. This helps your IT team identify which inspection policy scope needs to be adjusted.

```bash
# Test Agilent Hub
openssl s_client -connect api.agilent.com:443 2>/dev/null | openssl x509 -noout -issuer

# Test AWS S3
openssl s_client -connect s3.amazonaws.com:443 2>/dev/null | openssl x509 -noout -issuer

# Test AWS IoT
openssl s_client -connect iot.us-east-1.amazonaws.com:443 2>/dev/null | openssl x509 -noout -issuer

# Test Microsoft Update
openssl s_client -connect windowsupdate.microsoft.com:443 2>/dev/null | openssl x509 -noout -issuer
```

Share the issuer output for each domain with your network security team.

---

### Step 3 — Confirm the Certificate Validation Failure

Verify that the certificate substitution is the direct cause of the HTTPS failure by attempting a connection with certificate verification explicitly disabled. This is for diagnostic purposes only and should not be used as a permanent configuration.

```bash
curl -v --insecure https://<hostname>
```

**If this succeeds while the normal request fails:** The certificate validation failure is confirmed as the root cause. The corporate CA presented by the SSL Inspection appliance is not trusted by the CID.

**If this also fails:** An additional issue may be present. Review the curl output and consider referring to [**CID-NET-02: TLS Handshake Failure**](/cid-net-02).

---

## Resolution

SSL Inspection Bypass is the required resolution. Provide the output from the diagnostic steps above to your network security team and request the following:

**Configure an SSL Inspection Bypass** for all domains listed in the [Affected Services](#affected-services) section. This instructs the firewall or security appliance to pass HTTPS traffic to these destinations without interception or certificate substitution.

This exemption does not eliminate security coverage for these connections — the traffic remains encrypted end-to-end using the destination server's legitimate certificate. It instructs the appliance not to act as an intermediary for verified Agilent and cloud service endpoints.

| Recommended Action | Applicable When |
|---|---|
| Configure SSL Inspection Bypass for `*.agilent.com` | Step 2 showed corporate CA for Agilent endpoints |
| Configure SSL Inspection Bypass for `*.amazonaws.com` | Step 2 showed corporate CA for AWS endpoints |
| Configure SSL Inspection Bypass for `*.microsoft.com` and associated Microsoft domains | Step 2 showed corporate CA for Microsoft endpoints |
| Configure SSL Inspection Bypass for all CID internet endpoints | Step 2 showed corporate CA across all tested domains |

---

## Related Documents

- [**CID-NET-01** — TCP Port 443 Blocked](/cid-net-01)
- [**CID-NET-02** — TLS Handshake Failure](/cid-net-02)
- [**CID-NET-04** — NTP Time Synchronization Failure](/cid-net-04)
- [**CID-NET-05** — DNS Resolution Failure](/cid-net-05)
