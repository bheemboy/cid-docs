---
sidebar_position: 1
slug: /troubleshooting/beep-codes-on-startup
title: "Beep codes on startup"
description: Identify and resolve the 1-, 2-, 3-, or 4-beep activation pattern emitted by a CID during or after boot.
toc_max_heading_level: 3
---

# Beep codes on startup

**Product**: Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience**: Agilent Support, IT/network administrators
**Support reference**: Boot / activation connectivity

:::caution
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID emits an audible beep pattern, repeating every 5 minutes, during or after boot. The beep count identifies which stage of the boot-and-registration sequence is failing.

- A repeating 1-, 2-, 3-, or 4-beep pattern from the CID chassis speaker.
- The CID does not appear as **Connected** in CID Hub.
- For 1, 2, or 3 beeps: the CID has not completed activation and remains in its factory state.
- For 4 beeps: a previously activated CID cannot reach the registration API on this boot.

---

## Root cause

Each beep count corresponds to a distinct failure stage in the activation sequence. One underlying cause, four observable forms:

- **1 beep, no network link**. The Corporate NIC has no DHCP-assigned address: the cable is unplugged, the switch port is disabled, or the Corporate and Instrument NIC cables are swapped and the instrument network has no DHCP server.
- **2 beeps, registration API unreachable**. The Corporate NIC has link and an IP address, but the CID cannot reach the Registration API on TCP 443. Almost always a firewall, DNS, or routing problem on the customer's network. Swapped Corporate / Instrument NIC cables can also produce this pattern when the instrument network has its own DHCP server.
- **3 beeps, no matching CID record in CID Hub**. The CID reached the registration API and the CID Hub recognized its MAC, but no CID record is linked to that MAC. Either the CID has not been added to the customer organization in CID Hub, or it was added under a different MAC.
- **4 beeps, activated CID cannot reach registration API on boot**. A previously activated CID booted without connectivity to the Registration API. A registered CID with OpenLab CDS already installed emits the 4-beep pattern once and continues booting; an unregistered or partially activated CID repeats the pattern every 5 minutes until connectivity is restored.

---

## Confirm this is the right document

Count the beeps in one full repetition, then use the following table to confirm the page applies and to identify the failing stage.

| You observe | Next step |
|---|---|
| 1 beep | No network link on the Corporate NIC. Continue with Step 1. |
| 2 beeps | The CID has network link but cannot reach the registration API. Continue with Step 2. |
| 3 beeps | The CID reached the registration API but no matching CID record was found in CID Hub. Continue with Step 3. |
| 4 beeps | A previously activated CID cannot reach the registration API on this boot. Continue with Step 4. |
| No beeps, but CID is offline in CID Hub | This page does not apply. See [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) instead. |

---

## Affected services

A CID emitting a beep code has not completed the boot-and-registration sequence and cannot be managed from CID Hub. CDS clients cannot connect to acquire data from instruments attached to the CID.

For the complete list of domains the CID requires for activation and registration, see the [Internet requirements](/reference/system-requirements#internet-requirements) section of System requirements.

---

## Prerequisites

- Physical access to the CID and to the Corporate NIC cable.
- For 2- and 4-beep diagnosis: command-line access to the CID via SSH or direct console connection, with `nc`, `curl`, and `nslookup` available.
- For 3-beep diagnosis: CID Hub access for the customer organization, with permission to view and add CIDs.
- The 12-character Corporate NIC MAC address printed on the QR-code sticker affixed to the CID chassis.

---

## Diagnostic steps

### Step 1. Resolve a 1-beep pattern (no network link)

Verify the physical Corporate NIC connection and the upstream switch port:

```bash
ip link show
```

| Result | Next step |
|---|---|
| Corporate NIC interface shows `state DOWN` or `NO-CARRIER` | The cable is unplugged, faulty, or the switch port is disabled. Reseat the cable and verify the switch port is active. |
| Corporate NIC interface shows `state UP` | Confirm the cables are in the correct ports. If the Corporate NIC and Instrument cables are swapped and the instrument network has no DHCP server, the CID still beeps once. Restore the correct cable assignment, then reboot. |
| Pattern persists after both checks | Reboot the CID. If the 1-beep pattern continues, open a support ticket with Agilent Support and note the beep count and the steps already attempted. |

---

### Step 2. Resolve a 2-beep pattern (registration API unreachable)

Verify reachability of the registration API:

```bash
nslookup hub-ac-registration-api.prd-51.aws.agilent.com
nc -zv hub-ac-registration-api.prd-51.aws.agilent.com 443
```

| Result | Next step |
|---|---|
| `nslookup` fails | DNS is misconfigured. See [DNS resolution failure](/troubleshooting/dns-resolution-failure). |
| `nc` returns `Connection refused` or times out | TCP 443 to the Registration API is blocked. See [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked). |
| Both succeed, but the CID continues to beep twice | The network layer is reachable; the registration call itself is being blocked or rejected. Work through [TLS handshake failure](/troubleshooting/tls-handshake-failure), [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection), and [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure) in that order. |
| Cables look correct from the front but the CID still beeps twice | Confirm the Corporate NIC cable is in the Corporate NIC port and the Instrument cable is in the Instrument NIC port. A cable swap can produce two beeps when the instrument network has its own DHCP server. |

For a broader first-pass triage across all network failure modes, run [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) before working through the linked pages individually.

---

### Step 3. Resolve a 3-beep pattern (no matching CID record)

The CID has reached CID Hub but the Hub does not recognize it. Confirm the CID has been added to the customer organization:

1. Read the 12-character Corporate NIC MAC address from the QR-code sticker on the CID chassis.
2. In CID Hub, navigate to the CIDs list for the customer organization.
3. Confirm a CID record exists whose registered MAC matches the sticker exactly (no transposed characters, no mismatched case).

| Result | Next step |
|---|---|
| No matching record | Add the CID following [Activate a CID](/howto/onboarding/activate-a-cid). |
| A record exists with a different MAC | The CID was added under the wrong MAC, or the Corporate NIC has been replaced since activation and the sticker no longer reflects the in-service MAC. Correct the MAC on the existing record, or remove and re-add the CID via [Factory reset the CID](/howto/operations/cid-administration#factory-reset-the-cid). |
| A matching record exists | The Hub-side record is correct, but the CID is not seeing it. Reboot the CID. If the 3-beep pattern persists, open a support ticket with Agilent Support and note the Corporate NIC MAC and the matching Hub record. |

---

### Step 4. Resolve a 4-beep pattern (activated CID cannot reach API)

This pattern indicates a previously activated CID has lost connectivity to the Registration API. If OpenLab CDS is already installed on the CID, the 4-beep pattern is emitted once and the CID continues booting; in-progress CDS acquisitions continue to function, but no Hub-driven management is possible until connectivity is restored. If the CID is partially activated (OpenLab CDS not yet installed), the 4-beep pattern repeats every 5 minutes.

Run the same reachability checks as Step 2:

```bash
nslookup hub-ac-registration-api.prd-51.aws.agilent.com
nc -zv hub-ac-registration-api.prd-51.aws.agilent.com 443
```

| Result | Next step |
|---|---|
| `nslookup` fails | DNS resolution for the Registration API has broken since activation. See [DNS resolution failure](/troubleshooting/dns-resolution-failure). |
| `nc` returns `Connection refused` or times out | An outage or firewall change has blocked the CID's outbound path to the Registration API. See [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked). |
| Both succeed, but the 4-beep pattern recurs across reboot | The network layer is reachable; the registration call itself is being blocked or rejected. Work through [TLS handshake failure](/troubleshooting/tls-handshake-failure), [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection), and [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure) in that order. If the pattern still persists, open a support ticket with Agilent Support and note that the 4-beep pattern recurs despite the Registration API being reachable. |

---

## Resolution

Apply the action for the diagnostic step that identified the cause.

| Recommended action | Applicable when |
|---|---|
| Reseat or replace the Corporate NIC cable; verify the switch port is active | Step 1 confirmed no link |
| Restore the correct Corporate / Instrument cable assignment | Step 1 or Step 2 identified swapped cables |
| Apply the resolution from [DNS resolution failure](/troubleshooting/dns-resolution-failure) | Step 2 or Step 4 showed DNS failure |
| Apply the resolution from [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked) | Step 2 or Step 4 showed TCP 443 blocked |
| Work through [TLS handshake failure](/troubleshooting/tls-handshake-failure), [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection), and [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure) | Step 2 or Step 4 succeeded on TCP but the beep pattern persisted |
| Add or correct the CID record in CID Hub | Step 3 identified a missing or mismatched record |
| Open a support ticket with Agilent Support | Step 1, 3, or 4 reached an "escalate" row |

---

## Related documents

- [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity)
- [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked)
- [TLS handshake failure](/troubleshooting/tls-handshake-failure)
- [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection)
- [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure)
- [DNS resolution failure](/troubleshooting/dns-resolution-failure)
- [Activate a CID](/howto/onboarding/activate-a-cid)
- [Factory reset the CID](/howto/operations/cid-administration#factory-reset-the-cid)
