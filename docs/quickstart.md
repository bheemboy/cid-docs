---
sidebar_position: 1.5
---

# Quick Start

## Verify DNS/DHCP Requirements
If your DHCP server/s do not support dynamic DNS registration (RFC 2136) of Linux clients, then use the MAC address printed on the CID QR code to explicitly register CID hostnames in DNS and reserve IPs in DHCP. See "[DHCP and DNS requirements](requirements#dhcp-and-dns-requirements)"" for details.

## Verify Internet Requirements
Make sure that Firewall allows CIDs to connect to web sites hosted by Agilent as well as Microsoft web sites during activation and for downloading updates. See "[Internet requirements](requirements#internet-requirements)"" for details.

## Register OpenLab Server in CID Hub
Add details of your existing OpenLab Server in the CID Hub.
- Login to https://hub.cid.agilent.com/ (CID Hub)
- Click on “OpenLab Servers” from the navigation bar.
- Click on “Register Server”
- Provide details about your server in the pop-up dialog and hit save.

:::note
The selection for “Connect to” must match exactly with the format that is used when installing CDS Client system and is displayed in “Connect to” when logging in to CDS.
:::
