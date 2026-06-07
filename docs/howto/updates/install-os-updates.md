---
sidebar_position: 3
title: "Install OS updates"
---

# <mark>Install OS updates</mark>

The CID runs two operating systems: Oracle Linux on the host and Windows IoT inside the embedded OpenLab CDS virtual machine (VM). Microsoft and Oracle security patches are published to CID Hub shortly after Microsoft and Oracle release them. This page is for the lab administrator or IT operator who confirms the selected updates and starts the install.

CID Hub keeps each server template and CID pointed at a current Windows update and a current Linux update by default. If the selected update is later obsoleted or removed from CID Hub, CID Hub automatically switches the selection to the latest applicable release. The new update downloads in the background so it is ready for an administrator to install.

:::important
Operating system patches close known security vulnerabilities. Apply them promptly after they appear in the **Updates Ready** state. Delayed OS updates leave the CID and the connected instruments exposed.
:::

## Prerequisites

Before you start, make sure these prerequisites are met.

- You must have an administrator role to install OS updates.
- Each CID you plan to update must have **Allow Changes** turned on.

## Install the selected OS updates

Use this procedure to start the selected OS updates without duplicating the general update workflow.

1. Open [Apply updates](./apply-updates).
2. Start the install by using the method that matches your rollout:
   - **To update several CIDs at once**. Use the **CIDs** list.
   - **To apply all pending changes to one CID**. Use the CID's **Software** tab.
   - **To install only the Windows update or the Linux update**. Use the CID's **Software** tab and start only that update.
3. If you install OS updates with other changes, see the [Installation order](./apply-updates#installation-order) section of Apply updates.

:::caution
Do not install OS updates while instruments are running on the CID. A Windows update can restart the embedded VM and interrupt active OpenLab CDS sessions.
:::

## What to expect during the install

OS updates behave differently from OpenLab CDS and driver installs.

- **The CDS VM reboots after a Windows update**. Some Windows updates require the embedded VM to restart. **Recent activity** on the CID's **Summary** page reports the reboot and marks the install complete after the VM is back online.
- **Windows updates retry automatically**. If a Windows update installation fails, the CID retries the installation up to 5 times at 60-second intervals before reporting the update as failed. The CID keeps running on its current Windows patch level.
- **Linux updates install packages, then the CID agent**. A Linux update can include OS packages, a new CID agent, or both. Packages install first. If any package fails after the same 5-retry, 60-second pattern, the agent step is skipped and the CID stays on its current Linux update version. If the agent fails to start, the previous agent is restored automatically.

For the full failure-handling behavior across all components, see the [What happens on failure](./apply-updates#what-happens-on-failure) section of Apply updates.

## See also

See these related pages for update planning and follow-up tasks.

- [Apply updates](./apply-updates): trigger the install for one CID or for many.
- [Define a software template](../setup/define-software-template): override the default OS update selection for a group of CIDs.
- [Configure software exceptions](../setup/configure-software-exceptions): override the default OS update selection on a single CID.
- [View activity logs](../monitoring/view-activity-logs): review the history of OS update installs, restarts, and failures.
