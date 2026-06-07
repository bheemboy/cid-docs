---
sidebar_position: 2
sidebar_label: "Register and activate CIDs"
title: "Register and activate CIDs"
---

# Register and activate CIDs

Use this page to register your OpenLab Server, define its software template, add the CID to CID Hub, and configure the instrument so the CID is ready for use. This page is for the lab administrator or IT operator completing the first CID setup workflow.

## Prerequisites

Before you start, make sure you have the account access and setup information required to complete this task.

- You must have an active CID Hub account. Agilent creates your organization's account and the first administrator users after purchase. Look for an invitation email from **CID Hub** \<no-reply@hub.cid.agilent.com\> to begin.
- The network and physical setup must be complete as described in [Before you install](./getting-started).

## Register the OpenLab Server

Register the OpenLab Server in CID Hub so that you can associate CIDs with it.

1. Log in to [CID Hub](https://hub.cid.agilent.com/).
2. Click **OpenLab Servers** in the navigation bar.
3. Click **Register Server**.
4. Enter the server details in the dialog.
5. Click **Save**.

For detailed field guidance, see [Register an OpenLab Server](../howto/setup/register-a-server).

## Define software requirements

Define the software template that CID Hub applies to each CID linked to this server.

1. Click your server entry in the OpenLab Servers list.
2. Select the **CID Software** tab.
3. Select the OpenLab CDS version you want to use.
4. Select the driver and add-on versions you want on the CIDs.

:::note
The OpenLab CDS and driver versions you select for CIDs must match the versions installed on the CDS clients.
:::

For template details, see [Define a software template](../howto/setup/define-software-template).

## Add the CID to CID Hub

Add a record for the CID so that CID Hub recognizes the device on its next connection.

1. Select the **CIDs** tab in the top navigation bar.
2. Click **Add**.
3. Enter the CID information in the dialog.
   - Agilent recommends using 15 or fewer lowercase alphanumeric characters to name a CID, for example `cid-gc35`.
   - The PIN code is the 8-character alphanumeric code on the CID QR code sticker. Enter it without the hyphen.
4. Click **Save**.
5. Wait for the CID to recognize the linked record in CID Hub.
   The CID stops beeping shortly afterward and begins the activation process. The **Recent Activity** section of the CID summary tab shows activity log entries.
6. Confirm that the CID status shows **Ready** in the CIDs list.

For the complete activation procedure, see [Activate a CID](../howto/onboarding/activate-a-cid).

## Configure the instrument in OpenLab Control Panel

With the CID activated, configure the instrument in OpenLab Control Panel.

:::caution
Do not configure multiple instruments on one CID. The second instrument configuration is not supported and can fail.
:::

1. Complete the steps in [Configure an instrument](../howto/onboarding/configure-instrument).

## See also

- [Before you install](./getting-started): Prepare the network and physical connections before activation.
- [Register an OpenLab Server](../howto/setup/register-a-server): Enter the server details that CIDs use during activation.
- [Define a software template](../howto/setup/define-software-template): Set the OpenLab CDS, driver, and add-on versions for each server.
- [Activate a CID](../howto/onboarding/activate-a-cid): Create the CID record and monitor the activation process.
- [Configure an instrument](../howto/onboarding/configure-instrument): Attach the instrument to the CID in OpenLab Control Panel.
