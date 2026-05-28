---
sidebar_position: 1
sidebar_label: "Before you install"
title: "Before you install"
---

# Before you install

This tutorial walks you through preparing your network environment and physically connecting a CID before activation. It is intended for network IT administrators who configure the lab infrastructure.

:::important
The following steps must be completed before installing CIDs and connecting them to OpenLab CDS.
:::

**Prerequisites**

- You have administrative access to your corporate network, firewall, DHCP, and DNS systems.
- You have the CID hardware and power cables on hand.
- You have reviewed the [system requirements](../reference/system-requirements).
- Your Agilent project team provides a Site Preparation Checklist during project kickoff. Use it alongside this tutorial to confirm your lab is ready.

## Enable CID connectivity

Before a CID can activate and receive updates, it needs outbound internet access to specific Agilent and cloud service endpoints.

1. Make sure that each CID has an internet connection for activation, security updates, monitoring, and other maintenance activities.
2. Configure the network and firewalls to allow connections from the CIDs to the required internet sites (see the complete list in [system requirements](../reference/system-requirements#internet-requirements)).
3. Review the applicable [SSL certificate requirements for HTTPS](../reference/system-requirements#ssl-certificate-requirements-for-https) before proceeding.

## Enable CID network readiness

When first connected, the CID automatically obtains its network settings using DHCP. After activation, you can assign a static network configuration. CDS clients must resolve CID hostnames to their IP addresses for proper operation.

1. If your DHCP servers support dynamic DNS registration for Linux systems, confirm that the DHCP server registers the CID hostname automatically with the DNS server.
2. Otherwise, register the desired CID hostnames in DHCP and DNS using the device MAC address (found on the QR code label).
3. Verify that CDS clients can resolve the CID hostnames.

See [DHCP and DNS requirements](../reference/system-requirements#dhcp-and-dns-requirements) for more detail.

## Connect the CID to your network

With the network configured, you can now physically place and cable the CID.

1. Make sure that the number and location of electrical outlets for your CIDs and instruments are planned.
2. Place the CID next to the instrument and make sure that the device has proper ventilation during operation. Do not place CIDs on top of one another, in a sealed enclosure, or near any heat sources.
3. Connect the CID LAN ports:
   a. **House (Corporate) NIC** connects to the corporate LAN and provides access to the OpenLab Server and the internet.
   b. **Instrument NIC** connects to the analytical instruments, either directly or through an instrument-dedicated LAN or VLAN.
4. Connect the power cable and turn on the CID.
5. On startup, the CID connects to the CID Hub via the internet.
   If successful, it beeps three times every 30 seconds until you [add the CID to the Hub](register-activate#add-the-cid-to-the-cid-hub). See [Beep codes on startup](/troubleshooting/beep-codes-on-startup) for the meaning of other beep patterns.

![CID deployment layout showing CDS clients on the corporate LAN connecting to the CID, the CID's outbound link to CID Hub, and the CID's Instrument NIC connecting to the attached instrument.](../img/layout-1.jpg)

## Register and activate your CIDs

Your lab is now ready for your CIDs. Continue to [Register and activate your CIDs](register-activate).

:::note
For technical assistance, contact [Agilent Technical Support](https://www.agilent.com/en/support).
:::
