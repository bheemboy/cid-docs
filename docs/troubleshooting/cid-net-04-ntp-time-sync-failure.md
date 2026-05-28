---
sidebar_position: 5
slug: /cid-net-04
title: "CID-NET-04: NTP time synchronization failure"
description: Diagnose and resolve clock drift on the CID caused by outbound UDP port 123 being blocked or by NTP hostname resolution failing.
toc_max_heading_level: 3
---

# CID-NET-04: NTP time synchronization failure

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/network administrators
**Support reference:** Network / firewall configuration

:::warning[For IT administrators only]
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID system clock has drifted from real time, breaking time-sensitive operations. This may manifest as:

- TLS certificate validation failures on HTTPS connections, even when the network path appears healthy.
- AWS API or AWS IoT requests rejected due to request-timestamp mismatch.
- **CID Hub** communication errors that correlate with clock drift.
- File and log timestamps on the CID drift from real time in a sustained way (not a brief skew at boot).

---

## Root cause

The CID uses `pool.ntp.org` as its NTP time source and synchronizes via the `chrony` service. Time synchronization requires outbound **UDP traffic on port 123** to be permitted by the network. Because UDP/123 is separate from TCP/443, it is frequently omitted from firewall rules that otherwise permit HTTPS.

Accurate system time is a hard dependency for several CID functions:

- **TLS certificate validation.** Certificates carry validity periods. A clock skewed by more than a few minutes can cause valid certificates to be rejected as expired or not-yet-valid.
- **AWS request signing.** AWS API and AWS IoT requests include a timestamp that must fall within a defined tolerance of actual time. Requests outside this window are rejected by AWS.
- **Log correlation.** Inaccurate timestamps complicate troubleshooting, audit reconstruction, and incident review.

---

## Confirm this is the right document

Run the following on the CID:

```bash
chronyc tracking
```

| Result | Next step |
|---|---|
| `System time` offset is large (seconds or greater), or `Reference ID` shows `7F7F0101` (no sync source) | This is the correct document. Continue below. |
| Clock is synchronized with a small offset (milliseconds) | NTP is functioning. If HTTPS failures persist, see [**CID-NET-01** — TCP port 443 blocked](/cid-net-01), [**CID-NET-02** — TLS handshake failure](/cid-net-02), or [**CID-NET-03** — SSL inspection and certificate substitution](/cid-net-03). |

You can also arrive here from [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00) if the NTP test there reported a `chronyc sources` REACH value below `377` for `pool.ntp.org`.

---

## Affected services

Sustained clock drift cascades into TLS certificate validation, AWS request signing, and **CID Hub** telemetry — every cloud-facing CID service is eventually affected. For the complete list of internet endpoints the CID requires, see [System requirements, Internet requirements](/reference/system-requirements#internet-requirements).

---

## Prerequisites

- Command-line access to the CID via SSH or direct console connection.
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable.

---

## Diagnostic steps

### Step 1. Check the time synchronization state

Retrieve the current synchronization state and clock offset.

```bash
chronyc tracking
```

Key fields:

| Field | Healthy value | Problem indicator |
|---|---|---|
| `Reference ID` | A public NTP server address | `7F7F0101` (no sync source) |
| `System time` | Offset in milliseconds | Offset in seconds or greater |
| `Leap status` | `Normal` | `Not synchronised` |

For a summary view:

```bash
timedatectl status
```

Confirm that `NTP service: active` and `System clock synchronized: yes` are both present.

---

### Step 2. Test UDP port 123 connectivity

Directly probe whether outbound UDP/123 is permitted to the NTP pool.

```bash
nc -uzv pool.ntp.org 123
```

:::note
UDP connectivity testing with `nc` is inherently limited. A successful result means the packet was sent but does not guarantee a response was received. A failed result reliably indicates the port is blocked.
:::

If the test fails or times out, UDP/123 is being blocked. Request that your network team permit outbound UDP/123 to `*.pool.ntp.org`.

---

### Step 3. Attempt a manual NTP sync

Force an immediate synchronization attempt. This isolates whether the issue is connectivity-based or a local `chrony` problem.

```bash
sudo chronyc makestep
```

Re-run `chronyc tracking` afterwards. If the offset remains large, NTP connectivity is not functioning and the cause lies upstream of the CID.

---

### Step 4. Verify NTP hostname resolution

Confirm the CID can resolve NTP pool hostnames. DNS failure can prevent NTP from functioning even when UDP/123 is permitted.

```bash
nslookup pool.ntp.org
```

If this fails, see [**CID-NET-05** — DNS resolution failure](/cid-net-05) before working further on NTP.

---

## Resolution

Provide the diagnostic output from the steps above to your network security team and request the appropriate action.

| Recommended action | Applicable when |
|---|---|
| Permit outbound UDP/123 to `*.pool.ntp.org` | Step 2 showed UDP/123 is blocked |
| Verify DNS resolution for `pool.ntp.org` | Step 4 showed DNS resolution failure |
| Investigate upstream chrony or routing issue with Agilent Support | Step 3 left a large offset despite UDP/123 reachable and DNS resolving |

For background on why `pool.ntp.org` is the only supported NTP source and how the wildcard interacts with firewalls that filter by IP, see [System requirements, Time synchronization](/reference/system-requirements#time-synchronization).

---

## Related documents

- [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00)
- [**CID-NET-01** — TCP port 443 blocked](/cid-net-01)
- [**CID-NET-02** — TLS handshake failure](/cid-net-02)
- [**CID-NET-03** — SSL inspection and certificate substitution](/cid-net-03)
- [**CID-NET-05** — DNS resolution failure](/cid-net-05)
- [System requirements, Internet requirements](/reference/system-requirements#internet-requirements)
