---
sidebar_position: 7
title: "Configure Instrument"
---

# Configure Instrument

## Overview

After a CID is activated, it automatically registers with your OpenLab Server as an Agilent Instrument Controller (AIC). Once registered, it will appear in the OpenLab Control Panel, allowing you to configure the physical instrument connected to it.

This process is identical to configuring an instrument on a standard AIC and is performed using the OpenLab Control Panel, not the CID Hub.

---

## Configuration Process

To configure your instrument, follow the standard procedures documented in the OpenLab Help & Learning resources.

1.  **Add the Instrument**: In the OpenLab Control Panel, add a new instrument and assign the CID as its instrument controller. For detailed steps, refer to the "[Add an Instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects/ControlPanel/AddInstrument.htm)" guide in the OpenLab Help & Learning.

2.  **Configure the Instrument**: Once added, configure the instrument modules and settings. For detailed instructions, see the "[Configure an Instrument](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FConfigure_instrument.htm)" guide.

:::info
Using multiple instruments on a single CID is not supported. Each CID is designed to control one instrument configuration.
:::

---

## Instrument Status in CID Hub

The CID Hub displays instrument status to help administrators determine when it is safe to perform software installations or system updates on a CID.

A CID is safe for maintenance when the connected instrument is not running and any active OpenLab sessions are "[closed](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FControlPanel%2FClose_connection.htm)" in the OpenLab Control Panel.

