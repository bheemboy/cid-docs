# CID-NET-02: TLS Handshake Failure

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/Network Administrators
**Support Reference:** Network / Firewall Configuration

---

## Symptom

The CID can establish a TCP connection to an external service endpoint on port 443, but the HTTPS session fails immediately with an SSL error. This error may appear in CID logs or when running manual diagnostics:

```
curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to <hostname>:443
```

TCP connectivity to port 443 is confirmed working (see [Confirm This Is the Right Document](#confirm-this-is-the-right-document) below). The connection is being terminated by a network device during the TLS handshake — before any encrypted data is exchanged.

---

## Confirm This Is the Right Document

Run the following command, substituting the hostname of the failing service:

```bash
nc -zv <hostname> 443
```

| Result | Next Step |
|---|---|
| `Connection succeeded` | This is the correct document. Continue below. |
| `Connection refused` or timeout | TCP port 443 is blocked. Refer to **CID-NET-01: TCP Port 443 Blocked** instead. |

---

## Affected Services

This failure can affect any CID service that communicates over HTTPS. The following endpoints are required by the CID and may be impacted:

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

When TCP connectivity is confirmed but HTTPS fails, the most common causes are:

- **Domain or SNI-based blocking** — The firewall reads the Server Name Indication (SNI) field in the TLS Client Hello and drops connections to disallowed domains (e.g., `*.amazonaws.com`)
- **TLS version filtering** — The firewall is configured to block specific TLS versions, preventing the handshake from completing
- **Firewall policy terminating TLS traffic** — A security rule is resetting the connection upon detection of TLS negotiation to certain destinations

> **Note:** If the firewall is performing SSL Inspection — substituting its own certificate for the server's — refer to **CID-NET-03: SSL Inspection / Certificate Substitution** instead, as that condition requires a different remediation path.

---

## Diagnostic Steps

### Step 1 — Observe the TLS Handshake Failure

This command initiates a full TLS negotiation and captures detailed output showing exactly where the connection is terminated.

```bash
openssl s_client -connect <hostname>:443 -debug 2>&1 | head -40
```

**Expected output (healthy connection):** A full certificate chain is returned from the server, followed by session details.

**Output confirming this issue:** The connection terminates immediately after the Client Hello with no response from the server. Example:

```
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to <hostname>:443
* Closing connection 0
```

Collect this output for your network security team.

---

### Step 2 — Rule Out SSL Inspection

Before proceeding, confirm that the failure is a hard block rather than SSL Inspection. SSL Inspection produces a different failure mode and requires a different resolution.

```bash
openssl s_client -connect <hostname>:443 2>/dev/null | openssl x509 -noout -issuer -subject
```

- **If the command returns a certificate** with a corporate or internal issuer — stop here and refer to **CID-NET-03: SSL Inspection / Certificate Substitution**.
- **If the command returns no certificate at all** — the connection is being blocked outright. Continue to Step 3.

---

### Step 3 — Test TLS Version Filtering

Some firewall policies block specific TLS versions. Run both commands to determine whether one version succeeds while the other fails.

```bash
# Test TLS 1.2 only
curl -v --tlsv1.2 --tls-max 1.2 https://<hostname>

# Test TLS 1.3 only
curl -v --tlsv1.3 https://<hostname>
```

| Result | Interpretation |
|---|---|
| TLS 1.2 succeeds, TLS 1.3 fails | Firewall is blocking TLS 1.3. Request that your IT team permit TLS 1.3 for outbound HTTPS traffic. |
| TLS 1.2 fails, TLS 1.3 succeeds | Firewall is blocking TLS 1.2. Request that your IT team permit TLS 1.2 for outbound HTTPS traffic. |
| Both fail | TLS version filtering is not the issue. The connection is being dropped based on destination domain. Continue to Step 4. |

---

### Step 4 — Determine the Scope of the Block

Identify whether the block is limited to a specific endpoint or applies broadly to a class of domains. This helps your IT team scope the required firewall changes.

```bash
# Test Agilent Hub connectivity
curl -v https://api.agilent.com

# Test AWS S3 connectivity
curl -v https://s3.amazonaws.com

# Test AWS IoT connectivity
curl -v https://iot.us-east-1.amazonaws.com

# Test Microsoft Update connectivity
curl -v https://windowsupdate.microsoft.com
```

Share the results of all four tests with your network security team. The pattern of failures will indicate whether a single domain group or multiple groups are being blocked.

---

### Step 5 — Trace the Network Path

Maps the network route from the CID to the destination. Reveals whether traffic is being intercepted or redirected to an internal appliance before reaching the external endpoint.

```bash
tracepath <hostname>
```

For more detailed per-hop output including packet loss statistics, use `mtr`:

```bash
mtr --report --tcp --port 443 <hostname>
```

To verify which ports are reachable at the destination, use `nmap`:

```bash
nmap -p 443 <hostname>
```

Provide the full output of these commands to your network security team. Internal IP addresses appearing near the end of the path, or traffic that does not reach the expected destination, indicate interception or redirection.

---

## Resolution

Provide the diagnostic output from the steps above to your network security team and request the appropriate action:

| Recommended Action | Applicable When |
|---|---|
| Permit TLS 1.3 for outbound HTTPS traffic | Step 3 showed TLS 1.3 failing while TLS 1.2 succeeded |
| Permit TLS 1.2 for outbound HTTPS traffic | Step 3 showed TLS 1.2 failing while TLS 1.3 succeeded |
| Add domain allowlist rules for the affected service group(s) | Step 4 identified one or more blocked domain groups |
| Review proxy or traffic redirection rules | Step 5 showed unexpected intermediate hops |

The complete list of domains requiring outbound HTTPS access is provided in the [Affected Services](#affected-services) section above.

---

## Related Documents

- **CID-NET-01** — TCP Port 443 Blocked
- **CID-NET-03** — SSL Inspection / Certificate Substitution
- **CID-NET-04** — NTP Time Synchronization Failure
- **CID-NET-05** — DNS Resolution Failure
