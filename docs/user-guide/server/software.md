---
sidebar_position: 2
title: Configuring Software Template
---

# Configuring CID Software Template

## Overview
As part of your server information, you need to specify software versions that are to be used in your CDS client server system. The configuration specified here is used as the **default software configuration template** to be deployed to CIDs attached to this server.
When an update is made to the template, the CIDs download the necessary software and wait for their installation to be manually triggered by an administrator. 

## Selecting CDS version
Newly added servers are automatically configured with the latest version of CDS available on the CDS Hub. Click on the change button to select a different version.

![Select CDS](./img/select-cds.jpg)

When a new minor version is available in the CID hub, the page will show "Update Available" next to the change button. When changing to a new version of CDS you must make sure that all other Clients, AICs, and CIDs connected to the server are also updated to exactly the same version.

## OS Updates
When security updates are available for Windows they are published on the CID Hub. The latest version of Windows Update is automatically selected.

Similarly, whenever CID agent updates or Linux security updates are available, they are published on the CID Hub. The latest version Linux Update is automatically selected.

## Instrument Drivers & Add-on Software
Based on the CDS version selected, minimum compatible versions of drivers and add-ons are automatically selected. If different versions are necessary, they can be selected by clicking on the change button next to the corresponding driver or add-on. 

![Select Drivers](./img/select-drivers.jpg)

:::caution
If CDS version is changed, the driver and add-on selections revert to the default. Necessary versions may need to be reselected.
:::
