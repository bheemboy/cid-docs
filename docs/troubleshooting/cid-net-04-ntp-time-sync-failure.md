---
sidebar_position: 4
slug: /cid-net-04
---

# CID-NET-04: NTP Time Synchronization Failure

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/Network Administrators
**Support Reference:** Network / Firewall Configuration

---

## Symptom

The CID system clock is not synchronized, drifting, or significantly offset from the correct time. This may manifest as:

- `chronyc tracking` reporting the clock is not synchronized or showing a large time offset
- TLS certificate validation failures on HTTPS connections, even when the network path appears healthy
- AWS API or IoT requests being rejected due to request timestamp mismatch
- CID Hub communication errors that correlate with clock drift

NTP communicates over **UDP port 123**, which is distinct from HTTPS traffic and is frequently omitted from firewall allowlists.

---

## Confirm This Is the Right Document

Run the following command:

```bash
chronyc tracking
```

| Result | Next Step |
|---|---|
| `System time` offset is large (seconds or greater), or `Reference ID` shows `7F7F0101` (unsynchronized) | This is the correct document. Continue below. |
| Clock is synchronized with low offset (milliseconds) | NTP is functioning correctly. If HTTPS failures persist, refer to **CID-NET-01**, **CID-NET-02**, or **CID-NET-03**. |

---

## Background

Accurate system time is a dependency for several CID functions:

- **TLS certificate validation** — Certificates contain validity periods. If the system clock is significantly wrong, valid certificates may be rejected as expired or not yet valid
- **AWS request signing** — AWS API and IoT requests include a timestamp that must be within a defined tolerance of actual time. Requests outside this window are rejected by AWS
- **Log correlation** — Inaccurate timestamps complicate troubleshooting and audit trails

The CID uses `*.pool.ntp.org` as its NTP time source. This requires outbound **UDP traffic on port 123** to be permitted by the firewall. Because UDP 123 is separate from TCP 443, it is often not included in firewall rules that otherwise permit HTTPS traffic.

---

## Prerequisites

Before proceeding, please ensure the following conditions are met:

- Command-line access to the CID via SSH or direct console connection
- The following utilities are available on the system: `chronyc`, `timedatectl`, and `nc` (netcat)
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable

---

## Diagnostic Steps

### Step 1 — Check Time Synchronization Status

Retrieve the current synchronization state and clock offset.

```bash
chronyc tracking
```

Key fields to review:

| Field | Healthy Value | Problem Indicator |
|---|---|---|
| `Reference ID` | A public NTP server address | `7F7F0101` — indicates no sync source |
| `System time` | Offset in milliseconds | Offset in seconds or greater |
| `Leap status` | `Normal` | `Not synchronised` |

For a summary view:

```bash
timedatectl status
```

Confirm that `NTP service: active` and `System clock synchronized: yes` are both present.

---

### Step 2 — List NTP Sources and Their Status

Displays all configured NTP sources and their current reachability and polling status.

```bash
chronyc sources -v
```

The `Reach` column uses an octal bitmask representing the last 8 poll attempts. A value of `377` indicates all recent polls succeeded. A value of `0` indicates the source has not been reachable.

Share the full output with your network security team. Unreachable sources (Reach = `0`) confirm that NTP traffic is being blocked.

---

### Step 3 — Test UDP Port 123 Connectivity

Directly tests whether outbound UDP traffic on port 123 is permitted to the NTP pool.

```bash
nc -uzv pool.ntp.org 123
```

> **Note:** UDP connectivity testing with `nc` is inherently limited — a successful result indicates the packet was sent but does not guarantee a response was received. A failed result reliably indicates the port is blocked.

**If the test fails or times out:** UDP port 123 is being blocked. Request that your IT team permit outbound UDP traffic on port 123, or provide an internal NTP server address for the CID to use.

---

### Step 4 — Attempt a Manual NTP Sync

Forces an immediate synchronization attempt and reports the result. This is useful for confirming whether the issue is connectivity-based or a configuration problem on the CID.

```bash
sudo chronyc makestep
```

Then re-run `chronyc tracking` to check whether the offset has been corrected. If the offset remains large after this command, NTP connectivity is not functioning.

---

### Step 5 — Verify NTP Hostname Resolution

Confirms that the CID can resolve NTP pool hostnames. DNS resolution failure can prevent NTP from functioning even if UDP 123 is permitted.

```bash
nslookup pool.ntp.org
```

If this fails, refer to **CID-NET-05: DNS Resolution Failure** before proceeding further.

---

## Resolution

Provide the diagnostic output from the steps above to your network security team and request the appropriate action:

| Recommended Action | Applicable When |
|---|---|
| Permit outbound UDP (port 123) to `*.pool.ntp.org` | Step 3 showed UDP 123 is blocked |
| Provide an internal NTP server address for CID configuration | UDP 123 to public NTP servers is not permitted per network policy |
| Verify DNS resolution for `pool.ntp.org` | Step 5 showed DNS resolution failure |

> **Note:** If an internal NTP server is to be used, the server address should be applied through the CID Hub configuration. Contact Agilent Support for assistance with NTP server configuration changes.

---

## Related Documents

- **CID-NET-01** — TCP Port 443 Blocked
- **CID-NET-02** — TLS Handshake Failure
- **CID-NET-03** — SSL Inspection / Certificate Substitution
- **CID-NET-05** — DNS Resolution Failure
