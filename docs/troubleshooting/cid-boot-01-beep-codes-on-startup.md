---
sidebar_position: 7
slug: /cid-boot-01
---

# CID-BOOT-01: Beep Codes on Startup

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/Network Administrators
**Support Reference:** Boot / Activation Connectivity

---

## Symptom

The CID emits an audible beep pattern repeating every 30 seconds during or
after boot. The beep count indicates which stage of the boot-and-registration
sequence is failing.

- A repeating 1-, 2-, 3-, or 4-beep pattern from the CID chassis speaker
- The CID does not appear as **Connected** in the CID Hub
- For 1–3 beeps: the CID has not completed activation and remains in its
  factory state
- For 4 beeps: the CID has previously activated but cannot reach the
  registration API on this boot

---

## Confirm This Is the Right Document

Count the beeps in one full repetition. Use the table below to confirm and to
identify the failing stage.

| Result | Next Step |
|---|---|
| 1 beep | No network link detected on the House NIC. Continue with Step 1. |
| 2 beeps | The CID has network link but cannot reach the registration API on `*.agilent.com`. Continue with Step 2. |
| 3 beeps | The CID reached the registration API but no matching CID record was found in the CID Hub. Continue with Step 3. |
| 4 beeps | An activated CID cannot reach the registration API on this boot. Continue with Step 4. |
| No beeps but CID is offline in Hub | This page does not apply. Refer to [**CID-NET-01**](/cid-net-01) and the [CID Connectivity Tester](/troubleshooting/cid-connectivity-tester) instead. |

---

## Affected Services

A CID emitting a beep code has not completed the boot-and-registration
sequence and cannot be managed from the CID Hub. CDS clients cannot connect
to acquire data from instruments attached to the CID.

For the complete list of domains the CID requires for activation and
registration, see [System Requirements → Internet Requirements](/system-requirements#internet-requirements).

---

## Root Cause

Each beep count corresponds to a distinct failure stage:

- **1 beep — No network link.** The House NIC has no link, the cable is unplugged or faulty, or the switch port is disabled.
- **2 beeps — Registration API unreachable.** The House NIC has link and an IP address, but the CID cannot reach `*.agilent.com` on TCP 443. This is almost always a firewall, DNS, or routing problem on the customer's network.
- **3 beeps — No matching CID record in the CID Hub.** The CID reached the registration API but the Hub has no record matching this CID's House-NIC MAC address. Either the CID has not been added to the customer organization in the Hub, or it was added under a different MAC.
- **4 beeps — Activated CID cannot reach registration API on bootup.** A previously activated CID booted without connectivity to `*.agilent.com`. If OpenLab CDS is already installed on the CID, the CID continues booting after four beeps; if not, the four-beep pattern repeats every 30 seconds until connectivity is restored.

---

## Prerequisites

Before proceeding, please ensure the following conditions are met:

- Physical access to the CID and its connected House-NIC cable
- For 2- and 4-beep diagnosis: command-line access to the CID via SSH or direct console connection, with `nc`, `curl`, and `nslookup` available
- For 3-beep diagnosis: CID Hub access for the customer organization, with permission to view and add CIDs
- The 12-character House-NIC MAC address printed on the QR-code sticker affixed to the CID

---

## Diagnostic Steps

### Step 1 — Resolve a 1-beep pattern (no network link)

Verify the physical House-NIC connection and the upstream switch port:

```bash
ip link show
```

| Result | Interpretation |
|---|---|
| House-NIC interface shows `state DOWN` or `NO-CARRIER` | The cable is unplugged, faulty, or the switch port is disabled. Reseat the cable and verify the switch port is active. |
| House-NIC interface shows `state UP` | A 1-beep pattern with link present is unexpected. Reboot the CID; if the pattern persists, escalate to Agilent Support. |

---

### Step 2 — Resolve a 2-beep pattern (registration API unreachable)

Verify reachability of the registration API:

```bash
nslookup api.agilent.com
nc -zv api.agilent.com 443
```

| Result | Interpretation |
|---|---|
| `nslookup` fails | DNS is misconfigured. Refer to [**CID-NET-05** — DNS Resolution Failure](/cid-net-05). |
| `nc` returns `Connection refused` or times out | TCP 443 to `*.agilent.com` is blocked. Refer to [**CID-NET-01** — TCP Port 443 Blocked](/cid-net-01). |
| Both succeed but the CID continues to beep twice | An intermittent connectivity or TLS-inspection problem is likely. Refer to [**CID-NET-03** — SSL Inspection](/cid-net-03). |

---

### Step 3 — Resolve a 3-beep pattern (no matching CID record)

The CID has reached the Hub but the Hub does not recognize it. Confirm the
CID has been added to the customer organization in the CID Hub:

1. Read the 12-character House-NIC MAC address from the QR-code sticker on
   the CID chassis.
2. In the CID Hub, navigate to the CIDs list for the customer organization.
3. Confirm a CID record exists whose registered MAC matches the sticker
   exactly (no transposed characters, no mismatched case).

| Result | Interpretation |
|---|---|
| No matching record | Add the CID following [Activate a CID](/howto/activate-a-cid). |
| A record exists with a different MAC | The CID was added under the wrong MAC. Correct the MAC on the existing record, or remove and re-add. |
| A matching record exists | The Hub-side record is correct but the CID is not seeing it. Reboot the CID; if the 3-beep pattern persists, escalate to Agilent Support. |

---

### Step 4 — Resolve a 4-beep pattern (activated CID cannot reach API)

This pattern indicates a previously activated CID has lost connectivity to
`*.agilent.com`. The CID will continue to function for in-progress CDS
acquisitions if OpenLab CDS is already installed, but no Hub-driven
management is possible until connectivity is restored.

Run the same checks as Step 2:

```bash
nc -zv api.agilent.com 443
```

| Result | Interpretation |
|---|---|
| Connection fails | An outage or firewall change has blocked the CID's outbound path to `*.agilent.com`. Refer to [**CID-NET-01** — TCP Port 443 Blocked](/cid-net-01). |
| Connection succeeds but 4-beep pattern persists across reboot | Escalate to Agilent Support with the output of `journalctl -u cid-agent --since "1 hour ago"`. |

---

## Resolution

| Recommended Action | Applicable When |
|---|---|
| Reseat or replace the House-NIC cable; verify switch port is active | Step 1 confirmed no link |
| Apply the resolution from [**CID-NET-05**](/cid-net-05) | Step 2 showed DNS failure |
| Apply the resolution from [**CID-NET-01**](/cid-net-01) | Step 2 or Step 4 showed TCP 443 blocked |
| Apply the resolution from [**CID-NET-03**](/cid-net-03) | Step 2 succeeded but the 2-beep pattern persisted |
| Add or correct the CID record in the CID Hub | Step 3 identified a missing or mismatched record |
| Escalate to Agilent Support with `cid-agent` journal output | Step 1, 3, or 4 reached the "escalate" row |

---

## Related Documents

- [**CID-NET-01** — TCP Port 443 Blocked](/cid-net-01)
- [**CID-NET-03** — SSL Inspection / Certificate Substitution](/cid-net-03)
- [**CID-NET-05** — DNS Resolution Failure](/cid-net-05)
- [**CID Connectivity Tester**](/troubleshooting/cid-connectivity-tester) — GUI tool available on unactivated CIDs
- [**Activate a CID**](/howto/activate-a-cid) — required when Step 3 finds no Hub record
