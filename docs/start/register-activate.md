---
sidebar_position: 2
sidebar_label: "Register and activate CIDs"
title: "Register and activate CIDs"
---

# Register and activate CIDs

This tutorial walks you through registering your OpenLab Server, defining software requirements, adding a CID to the CID Hub, and configuring the instrument. After completing these steps, your CID is online and ready for use.

**Prerequisites**

- You have an active CID Hub account. Your organization's account and the first set of administrator users are created by Agilent personnel upon purchase. Look for an invitation email from **CID Hub** \<no-reply@hub.cid.agilent.com\> to begin.
- You have completed the network and physical setup described in [Before you install](./getting-started).

## Register the OpenLab Server

Register your OpenLab Server information in the CID Hub so that CIDs can be associated with it.

1. Log in to the CID Hub at https://hub.cid.agilent.com/.
2. Click **OpenLab Servers** in the navigation bar.
3. Click **Register Server**.
4. Enter details about your server in the dialog and click **Save**.

See [Register an OpenLab Server](../howto/setup/register-a-server) for details.

## Define software requirements

Define the software configuration that the CID Hub applies to each CID linked to this server.

1. Click your server's entry in the list of OpenLab Servers.
2. Select the **CID Software** tab.
3. Select the CDS version you want to use.
4. Select the specific driver and add-on versions you want on the CIDs.

:::important
The CDS and driver versions you select for CIDs must match those installed on the CDS clients.
:::

See [Define a software template](../howto/setup/define-software-template) for details.

## Add the CID to the CID Hub

Add a record for your CID so that the CID Hub recognizes the device on its next connection.

1. Click the **CIDs** tab in the top navigation bar.
2. Click **Add**.
3. Enter information about your CID in the dialog and click **Save**.
   - Agilent recommends using 15 or fewer lowercase alphanumeric characters to name your CIDs (for example, `cid-gc35`).
   - The PIN code is the 8-character alphanumeric code on the QR code sticker on the CID. Enter it without the hyphen.
4. Wait for the CID to recognize the linked record in the CID Hub.
   Shortly after, the CID stops beeping and begins the activation process. The **Recent Activity** section of the CID summary tab shows event logs.
5. Confirm that the CID status shows **Ready** in the CIDs list.

## Configure the instrument in Control Panel

With the CID activated, configure it with your instrument in OpenLab Control Panel.

1. Open Control Panel and [add an instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FAddInstrument.htm).
2. [Configure the instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FConfigure_instrument.htm) following the Control Panel help instructions.

For more information, see the *Agilent OpenLab CDS Clients and Instrument Controllers* manual for your CDS version.

:::important
Using multiple instruments on a single CID is not supported.
:::
