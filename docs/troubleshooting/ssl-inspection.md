---
sidebar_position: 7
slug: /troubleshooting/ssl-inspection
title: "SSL inspection and certificate substitution"
description: Diagnose and resolve HTTPS certificate validation failures caused by a firewall or security appliance presenting its own certificate in place of the destination server's.
toc_max_heading_level: 3
---

# SSL inspection and certificate substitution

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/network administrators
**Support reference:** Network / firewall configuration

:::warning[For IT administrators only]
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID can establish a TCP connection to an external endpoint on port 443 and the TLS handshake completes, but HTTPS requests fail with certificate validation errors. The server certificate returned to the CID is signed by a corporate or internal certificate authority rather than the expected public CA. This may manifest as:

- Certificate validation errors appear in CID agent logs against external CID endpoints (for example, *"unable to get local issuer certificate"* or *"certificate verify failed"*).
- In **CID Hub**, the **Recent Activity** view shows entries such as *"Error validating IoT device certificate: `<error-info>`"* when the AWS IoT connection cannot validate the certificate the firewall is presenting.
- An earlier diagnosis through [TLS handshake failure](/troubleshooting/tls-handshake-failure) revealed a corporate or internal issuer in the certificate chain.

---

## Root cause

SSL inspection (also called TLS inspection or HTTPS deep packet inspection) is a feature of many enterprise firewalls and security appliances. When active, the appliance:

1. Intercepts the outbound TLS connection from the CID.
2. Establishes its own separate TLS session with the destination server.
3. Re-encrypts the traffic and presents a new certificate to the CID, signed by the appliance's internal certificate authority.

This allows the appliance to inspect encrypted traffic. The CID does not trust the corporate CA presented by the inspection appliance for external cloud service endpoints, so it rejects the connection.

The supported resolution is an **SSL inspection bypass** for the affected endpoints.

---

## Confirm this is the right document

| Where you came from | Next step |
|---|---|
| You arrived from [TLS handshake failure](/troubleshooting/tls-handshake-failure) Step 1 after observing a corporate or internal issuer in the certificate chain | This is the correct document. Continue below. |
| Logs or **CID Hub** Recent Activity show certificate-validation errors against a CID cloud endpoint | This is the correct document. Continue below. |
| You ran [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) and TCP/443 was reachable, but the CID still fails with certificate-validation errors | This is the correct document. Continue below. |
| The TLS handshake terminates with no server response | The issue is a hard block, not inspection. See [TLS handshake failure](/troubleshooting/tls-handshake-failure). |
| You have not yet identified that certificate validation is the failing layer | Run [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) first. |

---

## Affected services

SSL inspection affects every CID service that communicates over HTTPS to external cloud endpoints: activation and registration, telemetry to **CID Hub**, AWS IoT messaging, software downloads, and Microsoft CDN access. For the complete list of internet endpoints the CID requires, see [System requirements, Internet requirements](/reference/system-requirements#internet-requirements).

---

## Prerequisites

- Command-line access to the CID via SSH or direct console connection.
- The failing endpoint hostname, identified from the connectivity tester results, **CID Hub** Recent Activity, or an earlier TLS handshake failure Step 1 capture.
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable.

---

## Diagnostic steps

### Step 1. Capture the certificate being presented

Retrieve the issuer, subject, and validity dates from the certificate the firewall is presenting. This output identifies which inspection policy is in effect and is required by your network security team.

```bash
# Replace <hostname> with the failing endpoint identified from
# the connectivity tester results or CID Hub Recent Activity.
# Example: hub-ac-registration-api.prd-51.aws.agilent.com

openssl s_client -connect <hostname>:443 2>/dev/null | openssl x509 -noout -issuer -subject -dates
```

Run this command for each affected endpoint and collect the output. A corporate or internal CA in the **issuer** field confirms SSL inspection is active for that destination.

---

### Step 2. Determine the scope of inspection

Test multiple CID endpoint groups to establish whether SSL inspection is applied broadly or only to specific destinations. This scopes the bypass rule the network team needs to add.

```bash
openssl s_client -connect hub-ac-registration-api.prd-51.aws.agilent.com:443 2>/dev/null | openssl x509 -noout -issuer
openssl s_client -connect a3cb4mwmdz2oep-ats.iot.us-east-1.amazonaws.com:443 2>/dev/null | openssl x509 -noout -issuer
openssl s_client -connect agilent-aws-prd-51-ac-images.s3.amazonaws.com:443 2>/dev/null | openssl x509 -noout -issuer
openssl s_client -connect microsoft.com:443 2>/dev/null | openssl x509 -noout -issuer
```

| Pattern in the results | Interpretation |
|---|---|
| All four return a corporate CA | Inspection is applied broadly to outbound HTTPS. |
| Only `*.amazonaws.com` endpoints return a corporate CA | Inspection is scoped to AWS endpoints. |
| Only `*.agilent.com` endpoints return a corporate CA | Inspection is scoped to Agilent endpoints. |
| Only one endpoint returns a corporate CA | Inspection is scoped to a specific destination. |
| One or more return a public CA (Amazon, DigiCert, Microsoft) | Those endpoints are not being inspected; the issue may be scoped to specific service groups. |

Share the per-endpoint issuer output with your network security team.

---

### Step 3. Confirm certificate validation is the direct cause

Verify that the certificate substitution is what's blocking the HTTPS request by retrying the request with certificate verification disabled. This is for diagnostic purposes only and is not a supported runtime configuration.

```bash
# Replace <hostname> with the failing endpoint identified from
# the connectivity tester results or CID Hub Recent Activity.
# Example: hub-ac-registration-api.prd-51.aws.agilent.com

curl -v --insecure https://<hostname>
```

| Result | Interpretation |
|---|---|
| Succeeds while the normal request fails | Certificate validation is the direct cause. The corporate CA presented by the inspection appliance is not trusted by the CID. |
| Also fails | An additional issue is present. Review the `curl` output and see [TLS handshake failure](/troubleshooting/tls-handshake-failure). |

---

## Resolution

The supported resolution is an **SSL inspection bypass** for every CID internet endpoint affected by inspection. Provide the diagnostic output from the steps above to your network security team and request the bypass scope identified in Step 2.

Bypassing inspection does not weaken security for these connections: the traffic remains end-to-end encrypted using the destination server's legitimate certificate. The bypass instructs the appliance not to act as a TLS intermediary for verified Agilent and cloud service endpoints.

| Recommended action | Applicable when |
|---|---|
| Configure SSL inspection bypass for `*.agilent.com` | Step 2 showed a corporate CA for Agilent endpoints |
| Configure SSL inspection bypass for `*.amazonaws.com` | Step 2 showed a corporate CA for AWS endpoints |
| Configure SSL inspection bypass for `*.microsoft.com` and associated Microsoft domains | Step 2 showed a corporate CA for Microsoft endpoints |
| Configure SSL inspection bypass for all CID internet endpoints listed in [System requirements, Internet requirements](/reference/system-requirements#internet-requirements) | Step 2 showed a corporate CA across all tested domains |

---

## Related documents

- [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity)
- [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked)
- [TLS handshake failure](/troubleshooting/tls-handshake-failure)
- [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure)
- [DNS resolution failure](/troubleshooting/dns-resolution-failure)
- [Beep codes on startup](/troubleshooting/beep-codes-on-startup)
- [System requirements, Internet requirements](/reference/system-requirements#internet-requirements)
