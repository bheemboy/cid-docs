---
sidebar_position: 3
title: "Configure an instrument"
---

# <mark>Configure an instrument</mark>

After a CID has activated and registered with your OpenLab Server, it appears in Control Panel as an Analytical Instrument Controller (AIC). This page is for the lab technician who is attaching a physical instrument to the CID and configuring it through Control Panel. The procedure is identical to configuring an instrument on a conventional AIC; the work happens in Control Panel, not in CID Hub.

## Prerequisites

- The CID must be activated and registered with the OpenLab Server. (The CID's name should appear in Control Panel.)
- The physical instrument must be connected to the CID's Instrument NIC and powered on.
- You must have Control Panel credentials with permission to add and configure instruments.

:::caution
Do not configure multiple instruments on one CID. The second instrument configuration can cause failures and is not supported.
:::

## Add and configure the instrument

To attach an instrument to a CID:

1. Open Control Panel and sign in.

2. Confirm the CID is listed as an available instrument controller.

![Control Panel Instruments view with the CID's name highlighted in the list of available instrument controllers](../../img/olcp-controller-list.png)

3. Add the instrument and assign the CID as its instrument controller. Follow the [Add an Instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects/ControlPanel/AddInstrument.htm) guide in OpenLab Help & Learning.

![Control Panel Add Instrument wizard with the CID selected as the instrument controller](../../img/olcp-add-instrument.png)

4. Configure the instrument's modules and settings. Follow the [Configure an Instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects/ControlPanel/Configure_instrument.htm) guide.

![Control Panel instrument configuration view showing the instrument modules and settings](../../img/olcp-config-instrument.png)

## How instrument status affects the CID

The CID's status in CID Hub reflects the state of the instrument you just configured:

- **In Use**. At least one instrument session is open on the CID. Software updates and maintenance actions on the CID are blocked or discouraged in this state.
- **Ready**. All instrument sessions on the CID are closed. The CID is safe to update or service.

When you finish a session, [close the connection](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects/ControlPanel/Close_connection.htm) in Control Panel so your administrator can apply updates during scheduled maintenance windows.

## See also

- [Activate a CID](./activate-a-cid): the activation flow that must complete before an instrument can be attached.
- [Configure network cards](./configure-network-cards): set the Instrument NIC into the same subnet as the connected instrument.
- [Add an Instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects/ControlPanel/AddInstrument.htm): full Control Panel procedure for adding an instrument.
- [Configure an Instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects/ControlPanel/Configure_instrument.htm): full Control Panel procedure for configuring modules and settings.
- [Close a connection](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects/ControlPanel/Close_connection.htm): how to release a CID for maintenance after a session.
