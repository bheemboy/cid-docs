---
sidebar_position: 5
slug: /troubleshooting/ntp-time-sync-failure
title: "NTP time synchronization failure"
description: Diagnose and resolve clock drift on the CID caused by outbound UDP port 123 being blocked or by NTP hostname resolution failing.
toc_max_heading_level: 3
---

# NTP time synchronization failure

**Product**: Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience**: Agilent Support, IT/network administrators
**Support reference**: Network / firewall configuration

:::caution
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID system clock has drifted from real time, breaking time-sensitive operations. This may manifest as:

- TLS certificate validation failures on HTTPS connections, even when the network path appears healthy.
- AWS API or AWS IoT requests rejected due to request-timestamp mismatch.
- CID Hub communication errors that correlate with clock drift.
- File and log timestamps on the CID drift from real time in a sustained way (not a brief skew at boot).

---

## Root cause

The CID uses `pool.ntp.org` as its NTP time source and synchronizes via the `chrony` service. Time synchronization requires outbound **UDP traffic on port 123** to be permitted by the network. Because UDP/123 is separate from TCP/443, it is frequently omitted from firewall rules that otherwise permit HTTPS.

Accurate system time is a hard dependency for several CID functions:

- **TLS certificate validation**. Certificates carry validity periods. A clock skewed by more than a few minutes can cause valid certificates to be rejected as expired or not-yet-valid.
- **AWS request signing**. AWS API and AWS IoT requests include a timestamp that must fall within a defined tolerance of actual time. Requests outside this window are rejected by AWS.
- **Log correlation**. Inaccurate timestamps complicate troubleshooting, event reconstruction, and incident review.

---

## Confirm this is the right document

Run the following on the CID:

```bash
chronyc tracking
```

| Result | Next step |
|---|---|
| `System time` offset is large (seconds or greater), or `Reference ID` shows `7F7F0101` (no sync source) | This is the correct document. Continue below. |
| Clock is synchronized with a small offset (milliseconds) | NTP is functioning. If HTTPS failures persist, see [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked), [TLS handshake failure](/troubleshooting/tls-handshake-failure), or [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection). |

You can also arrive here from [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) if the NTP test there reported a `chronyc sources` REACH value below `377` for `pool.ntp.org`.

---

## Affected services

Sustained clock drift cascades into TLS certificate validation, AWS request signing, and CID Hub telemetry. Every cloud-facing CID service is eventually affected. For the complete list of internet endpoints the CID requires, see the [Internet requirements](/reference/system-requirements#internet-requirements) section of System requirements.

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

| Result | Next step |
|---|---|
| `Reference ID` is `7F7F0101`, `Leap status` is `Not synchronised`, or the offset is seconds or greater | Continue to Step 2. |
| `Leap status` is `Normal` with a millisecond-scale offset, and `timedatectl` reports `System clock synchronized: yes` | NTP is functioning. No further action is required on this page. |

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

| Result | Next step |
|---|---|
| The probe fails or times out | UDP/123 is blocked. See [Resolution](#resolution) and request that your network team permit outbound UDP/123 to `*.pool.ntp.org`. |
| The probe succeeds | UDP/123 is not confirmed blocked. Continue to Step 3. |

---

### Step 3. Attempt a manual NTP sync

Force an immediate synchronization attempt. This isolates whether the issue is connectivity-based or a local `chrony` problem.

```bash
sudo chronyc makestep
```

Re-run `chronyc tracking` afterwards. If the offset remains large, NTP connectivity is not functioning and the cause lies upstream of the CID.

| Result | Next step |
|---|---|
| The `System time` offset drops to milliseconds after the step | NTP is now synchronized. No further action is required on this page. |
| The `System time` offset remains large (seconds or greater) | The cause lies upstream of the CID. Continue to Step 4. |

---

### Step 4. Verify NTP hostname resolution

Confirm the CID can resolve NTP pool hostnames. DNS failure can prevent NTP from functioning even when UDP/123 is permitted.

```bash
nslookup pool.ntp.org
```

If this fails, see [DNS resolution failure](/troubleshooting/dns-resolution-failure) before working further on NTP.

| Result | Next step |
|---|---|
| `nslookup` returns an `Address` for `pool.ntp.org` | DNS is resolving. See [Resolution](#resolution) to investigate an upstream chrony or routing issue with Agilent Support. |
| `nslookup` reports `server can't find` or times out | DNS resolution is failing. See [DNS resolution failure](/troubleshooting/dns-resolution-failure) before working further on NTP. |

---

## Resolution

Provide the diagnostic output from the diagnostic steps to your network security team and request the appropriate action.

| Recommended action | Applicable when |
|---|---|
| Permit outbound UDP/123 to `*.pool.ntp.org` | Step 2 showed UDP/123 is blocked |
| Verify DNS resolution for `pool.ntp.org` | Step 4 showed DNS resolution failure |
| Investigate upstream chrony or routing issue with Agilent Support | Step 3 left a large offset despite UDP/123 reachable and DNS resolving |

For background on why `pool.ntp.org` is the only supported NTP source and how the wildcard interacts with firewalls that filter by IP, see the [Time synchronization](/reference/system-requirements#time-synchronization) section of System requirements.

---

## Related documents

- [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity)
- [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked)
- [TLS handshake failure](/troubleshooting/tls-handshake-failure)
- [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection)
- [DNS resolution failure](/troubleshooting/dns-resolution-failure)
- [Internet requirements](/reference/system-requirements#internet-requirements) in System requirements
