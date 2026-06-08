---
sidebar_position: 0
slug: /troubleshooting
title: Troubleshooting
description: Symptom-first index to the CID troubleshooting pages. Pick the row that matches what you observed.
---

# Troubleshooting

These pages help you diagnose and recover from common CID boot, network, and registration failures. Match what you observed to the right starting page; each page's *Confirm this is the right document* section will route you elsewhere if the symptom turns out to belong to a different failure mode.

:::caution
The diagnostic procedures linked from this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

## Where to start

| What you observed | Start with |
|---|---|
| The CID is emitting 1-, 2-, 3-, or 4 beeps on startup | [Beep codes on startup](/troubleshooting/beep-codes-on-startup) |
| The CID appears offline in CID Hub but is not beeping | [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) |
| Activation of a brand-new CID is stalling or failing with no specific error | [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) |
| Activation, monitoring, or software updates broke after a network change | [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) |
| You see a specific TCP, TLS, certificate, NTP, or DNS error in logs or the UI | The matching page in [All pages](#all-pages) |
| The CID record in CID Hub has the wrong MAC, or the Corporate NIC was replaced | See [Resolve a 3-beep pattern](/troubleshooting/beep-codes-on-startup#step-3-resolve-a-3-beep-pattern-no-matching-cid-record) in Beep codes on startup; then [Factory reset the CID](/howto/operations/cid-administration#factory-reset-the-cid) if the record must be re-added |
| You need to register a brand-new CID for the first time | [Activate a CID](/howto/onboarding/activate-a-cid) (a how-to, not a troubleshooting flow) |

## All pages

Pages are listed in the order they tend to apply when reading top-down: boot-time symptoms first, then a triage tool, then specific failure modes from the most foundational network layer to the application layer.

- [Beep codes on startup](/troubleshooting/beep-codes-on-startup). Use this when the CID is audibly beeping during or after boot.
- [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity). Start here when you suspect a network problem but no specific error has surfaced yet.
- [DNS resolution failure](/troubleshooting/dns-resolution-failure). Names cannot be resolved to IP addresses.
- [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked). Outbound HTTPS connections cannot be established.
- [NTP time synchronization failure](/troubleshooting/ntp-time-sync-failure). The CID clock has drifted; TLS validation may be a downstream effect.
- [TLS handshake failure](/troubleshooting/tls-handshake-failure). The TCP connection succeeds but the TLS session is terminated.
- [SSL inspection and certificate substitution](/troubleshooting/ssl-inspection). The TLS handshake completes but the wrong certificate is presented.
- [OpenLab Server unreachable](/troubleshooting/openlab-server-unreachable). The CID cannot reach, validate, or register with the OpenLab CDS Server.

## Related procedures

- [Activate a CID](/howto/onboarding/activate-a-cid)
- [Factory reset the CID](/howto/operations/cid-administration#factory-reset-the-cid)
- [Internet requirements](/reference/system-requirements#internet-requirements) in System requirements
