---
sidebar_position: 2
title: "Register & Activate CIDs"
---

# Register & Activate CIDs

---

:::info[IMPORTANT]
Before you can register a server or add a CID, you must have an active CID Hub account. Your organization's account and the first set of administrator users are created by Agilent personnel upon purchase. 

Look for an invitation email from **CID Hub** \<no-reply@hub.cid.agilent.com\> to begin.
:::

## 1. Register OpenLab Server

1. Register your OpenLab Server information in the CID Hub.
2. Log in to the CID Hub at https://hub.cid.agilent.com/.
3. Click on “OpenLab Servers” in the navigation bar.
4. Click on “Register Server”.
5. Provide details about your server in the pop-up dialog and click **Save**.

See "[Register an OpenLab Server](../howto/register-a-server)" for details.

---

## 2. Define Software Requirements

1. Define the software configuration to apply to the CIDs.
2. Click on your server’s entry in the list of OpenLab Servers.
3. Click on “CID Software” tab on the left side.
4. Select the CDS version you want to use.
5. Select the specific driver and add-on versions you want on the CIDs.

See "[Define a Software Template](../howto/define-software-template)" for details.


:::info[Important]
**The CDS and Driver versions you select for CIDs must match those installed on the CDS clients.**
:::

---

## 3. Add the CID to the CID Hub
1. Add a record for your CID in the CID Hub.
2. Click on the “CIDs” tab in the top navigation bar.
3. Click on “Add”.
4. Provide information about your CID in the pop-up dialog and click **Save**.
  - We recommend using 15 or fewer lowercase alphanumeric characters to name your CIDs (e.g., `cid-gc35`).
  - The PIN code is the 8-character alphanumeric code on the QR code sticker on the CID. Enter it without the hyphen (`-`).
- Shortly after the CID is added, it will recognize that a linked record exists in the CID Hub, stop beeping, and begin the activation process.
  - The “Recent Activity” section of the CID summary tab shows logs of events occurring on the CID.
5. When activation is complete, its status will be "Ready" in the CIDs list.

---

## 4. Configure the Instrument in OpenLab Control Panel
1. The CID is ready to be congigured with your instruments.
2. Follow the instructions in the "[Control Panel Help](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FControlPanelBanner.htm) to [add an instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FAddInstrument.htm) and [configure an instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FConfigure_instrument.htm).

For more information see the manual “Agilent OpenLab CDS Clients and Instrument Controllers” for your CDS version (e.g. https://www.agilent.com/cs/library/usermanuals/public/CDS_v2.8_ClientAICGuide_en.pdf)


:::info[IMPORTANT]
**Using multiple instruments on a single CID is not supported.**
:::
