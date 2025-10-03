---
sidebar_position: 1.5
---

# Quick Start

## 1. Verify DNS/DHCP Requirements
If your DHCP server/s do not support dynamic DNS registration (RFC 2136) of Linux clients, then use the MAC address printed on the CID QR code to explicitly register CID hostnames in DNS and reserve IPs in DHCP. See "[DHCP and DNS requirements](requirements#dhcp-and-dns-requirements)" for details.

---

## 2. Verify Internet Requirements
Make sure that Firewall allows CIDs to connect to web sites hosted by Agilent as well as Microsoft web sites during activation and for downloading updates. See "[Internet requirements](requirements#internet-requirements)" for details.

---

## 3. Connect the CID
Connect CID to the instrument and your corporate network and power it on. See "[Supported Topologies](requirements#supported-topologies)" for details on making these connections.

- Connect the port labeled “Home” to the corporate network which connects the CID to the OpenLab Server and the internet.
- Connect the network port labeled “Instrument” directly to the instrument or to an instrument only network (LAN/VLAN).
-	Connect the power cable and turn on the CID.
-	On bootup the CID will connect via internet to the CID Hub and if successful, it will make 3 beeps every 30 seconds until the CID is [added to the Hub](#6-add-cid-to-the-cid-hub). See Troubleshooting tips at the end of "[Internet requirements](requirements#internet-requirements)" for other beep codes.

![CID layout](./img/layout-1.jpg)

---

## 4. Register OpenLab Server in CID Hub
Add details of your existing OpenLab Server in the CID Hub.
- Login to https://hub.cid.agilent.com/ (CID Hub)
- Click on “OpenLab Servers” from the navigation bar.
- Click on “Register Server”
- Provide details about your server in the pop-up dialog and hit save.

See "[Registering OpenLab Server](user-guide/server/registration)" for details.

---

## 5. Specify Software Configuration
Select software configuration to apply on the CIDs.
- Click on your server’s entry in the list of OpenLab Servers.
- Click on “CID Software” tab on the left side.
- Select the CDS version that you want to use.
- Select the latest Windows and Linux updates.
- Select driver versions that you want on the CIDs.

:::info Important
CDS and Driver versions that you select for CIDs must match what is installed on CDS clients.
:::

---

## 6. Add CID to the CID Hub
Add a record for you CID in the CID Hub.
- Click on the “CIDs” tab on the navigation bar on the top.
- Click on “Add”.
- Provide information about your CID in the pop-up dialog and hit save.
  - It is recommended to use 15 or less lowercase alphanumeric to name you CIDs. E.g., cid-gc35
  - PIN code is the 8-character alphanumeric code beneath the QR code sticker on the CIDs. Enter it without the dash (-).
- Shortly after adding the CID, the CID will recognize that a linked record is present in the CID Hub and stop beeping. Then it will start activation process. 
  - “Recent Activity” section of the CID’s summary tab will show logs of events occuring on the CID.
-	When the activation is complete, its status will be “Ready” in the CID’s list.

---

## 7. Configure Instrument in OpenLab Control Panel
- Follow instructions in the “OpenLab CDS - Client AIC Guide” to "[add an instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FAddInstrument.htm)" and "[configure](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FConfigure_instrument.htm)" it.

:::info
Using multiple instruments on a CID is not supported.
:::
