---
sidebar_position: 14
title: CID Administration 
sidebar_label: CID Administration
description: Guide for CID device access, credential management, and system recovery actions.
toc_max_heading_level: 2
---

# CID Administration

This guide provides details on accessing the Connected Instrument Device (CID) for maintenance and explains the system recovery actions available in the Hub.

## Accessing the Administration Page

To access the administration controls for a specific device:

1.  Navigate to the **CIDs** list in the main header.
2.  Select the specific CID you wish to manage.
3.  Click the **Administration** tab in the left sidebar menu.

![CID Administration Page](../img/cid-administration.jpg)

:::info
To perform any administrative actions or restarts described below, the **Allow Changes** toggle must be enabled on the interface.
:::

## Device Access Credentials

The CID uses a secure credential management system to ensure device security. These credentials allow access to the physical device components, not the CID Hub website.

* **Rotation:** Passwords are **automatically recycled every 24 hours**.
* **Reset:** Performing a **Factory Reset** will also reset these passwords.

### CDS Desktop User
* **Purpose:** Allows access to the console of the **Windows Virtual Machine**.
* **Usage:** Use this credential when you launch the CDS Desktop to interact directly with the instrument software running inside the VM.

### Cockpit User
* **Purpose:** Allows access to the **Linux Cockpit** tool on the host system.

:::warning Restricted Access
The Cockpit interface requires deep knowledge of the Linux environment. **Do not use this account unless explicitly directed by CID Hub Support.** Incorrect configuration in Cockpit can render the device unusable.
:::

## System Actions & Recovery

The CID architecture consists of a Linux Host system running a Windows Virtual Machine (VM) that contains the OpenLab CDS instrument software. Use the table below to determine the appropriate action for your maintenance needs.

### Level 1: Service & System Restarts
*Use these for standard maintenance or to clear stuck states.*

| Action | Target | When to use |
| :--- | :--- | :--- |
| **Restart CID Agent** | CID Software Agent | Use when the agent is behaving erratically. <br/>*(Note: This restart does not fix cloud connectivity issues, as the device must be online to receive the command.)* |
| **Restart CDS Desktop** | Windows VM | The OpenLab software is frozen, but the Linux system is responsive. |
| **Reboot System** | Linux Host | The entire device is sluggish, unresponsive, or requires a clean boot. |

### Level 2: Reset OpenLab CDS (VM Re-image)
*Use this if the instrument software is corrupted.*

Clicking **Reset OpenLab CDS** on the Administration tab will:
1.  **Drop** the existing Windows Virtual Machine.
2.  **Recreate** the VM from the original image.

:::warning
This action wipes the virtual machine state. Any local configurations inside the Windows environment not saved to the server will be lost.
:::

### Level 3: Factory Reset (Linux Environment Reset)
*Use this for deep system recovery, to decommission a device, or to rename a CID.*

A Factory Reset wipes the underlying Linux operating system and triggers a fresh re-provisioning of the device.

**Prerequisites:**
* **Close Connections:** Ensure all instrument connections are closed.
* **Verify Data:** Although the CID does not store data locally, ensure all acquired data is visible in the backend storage before proceeding to avoid losing data currently in transit.

**Steps to perform a Factory Reset:**

1.  Navigate to the **Summary** tab.
2.  Click the **Delete CID** button.
3.  **Physically restart** the CID hardware (toggle the power button on the unit).

Upon reboot, the CID will detect it has been removed from the Hub and will automatically initiate the factory reset sequence.