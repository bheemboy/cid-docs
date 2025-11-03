---
sidebar_position: 4
title: "Configure Software Exceptions"
---

# Configure Software Exceptions on a CID

By default, all CIDs inherit their software configuration (drivers, add-ons, etc.) from the server's main software template (see "[define software template](define-software-template)").

However, you may need a specific CID to use a unique setup. For example, one CID might need a MicroGC driver and another might need a Headspace driver, without adding those drivers to all CIDs.

To do this, you must configure that specific CID to stop inheriting from the server. This allows you to manage its software components individually.

### How to Disable Inheritance
- Navigate to the "Software" settings for the specific CID you want to change.
- Locate the toggle switch labeled "Inherit Software Settings From Server".
- Switch this toggle to the Off position.

![Break Inheritance](img/break-inheritance.jpg)

Once inheritance is disabled, you can manage that CID's drivers and add-ons independently.

:::warning Important Consequence 
A CID that is not inheriting will **no longer receive software updates** from the server template.
Any changes made to the server's software template **will be ignored** by this CID. You are now responsible for managing this CID's software manually. 
:::
