---
sidebar_position: 0
slug: /troubleshooting
title: Troubleshooting
description: Symptom-first index to the CID troubleshooting pages. Pick the row that matches what you observed.
---

# Troubleshooting

These pages help you diagnose and recover from common CID boot, network, and registration failures. Match what you observed to the right starting page; each page's *Confirm this is the right document* section will route you elsewhere if the symptom turns out to belong to a different failure mode.

:::warning[For IT administrators only]
The diagnostic procedures linked from this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

## Where to start

| What you observed | Start with |
|---|---|
| The CID is emitting 1-, 2-, 3-, or 4 beeps on startup | [**CID-BOOT-01** — Beep codes on startup](/cid-boot-01) |
| The CID appears offline in **CID Hub** but is not beeping | [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00) |
| Activation of a brand-new CID is stalling or failing with no specific error | [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00) |
| Activation, monitoring, or software updates broke after a network change | [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00) |
| You see a specific TCP, TLS, certificate, NTP, or DNS error in logs or the UI | The matching **CID-NET-NN** page in [Network and connectivity](#network-and-connectivity) below |
| The CID record in **CID Hub** has the wrong MAC, or the Corporate NIC was replaced | [**CID-BOOT-01**, Step 3 — Resolve a 3-beep pattern](/cid-boot-01#step-3-resolve-a-3-beep-pattern-no-matching-cid-record); then [Factory reset the CID](/howto/operations/cid-administration#factory-reset-the-cid) if the record must be re-added |
| You need to register a brand-new CID for the first time | [Activate a CID](/howto/onboarding/activate-a-cid) (a how-to, not a troubleshooting flow) |

## All pages

### Boot

- [**CID-BOOT-01** — Beep codes on startup](/cid-boot-01)

### Network and connectivity

- [**CID-NET-00** — Verify CID internet connectivity](/cid-net-00). Start here when you suspect a network problem but no specific error has surfaced yet.
- [**CID-NET-01** — TCP port 443 blocked](/cid-net-01)
- [**CID-NET-02** — TLS handshake failure](/cid-net-02)
- [**CID-NET-03** — SSL inspection and certificate substitution](/cid-net-03)
- [**CID-NET-04** — NTP time synchronization failure](/cid-net-04)
- [**CID-NET-05** — DNS resolution failure](/cid-net-05)
- [**CID-NET-06** — OpenLab server unreachable](/cid-net-06)

## Related procedures

- [Activate a CID](/howto/onboarding/activate-a-cid)
- [Factory reset the CID](/howto/operations/cid-administration#factory-reset-the-cid)
- [System requirements, Internet requirements](/reference/system-requirements#internet-requirements)
