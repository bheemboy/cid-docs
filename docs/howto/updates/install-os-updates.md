---
sidebar_position: 3
title: "Install OS updates"
---

# Install OS updates

The CID runs two operating systems: Oracle Linux on the host and Windows IoT inside the embedded CDS VM. Microsoft and Oracle security patches are published to CID Hub shortly after Microsoft and Oracle release them. This page is for the lab administrator or IT operator who confirms the selection and triggers the install.

CID Hub keeps each server template and CID pointed at a current Windows update and a current Linux update by default. When the currently selected update is later obsoleted or removed from CID Hub, the selection switches automatically to the latest applicable release and the new update downloads in the background, ready for an administrator to trigger the install.

:::important
Operating system patches close known security vulnerabilities. Apply them promptly after they appear in **Updates Ready** state. Delayed OS updates leave the CID and the connected instruments exposed.
:::

## Prerequisites

- You must have an administrator role to install OS updates.
- **Allow Changes** must be on for each CID you intend to update.

## Install the selected OS updates

OS updates install through the same methods as any other software change. Use [Apply updates](./apply-updates) and pick the method that matches the rollout you want:

- Update several CIDs at once from the **CIDs** list.
- Apply all pending changes to a single CID from its **Software** tab.
- Install the Windows update or the Linux update on its own from the **Software** tab when you want to stagger the rollout.

When OS updates are installed together with other changes, CID Hub installs them in the [installation order](./apply-updates#installation-order) shown on the Apply updates page.

## What to expect during the install

OS updates behave a little differently from CDS and driver installs.

- **The CDS VM reboots after a Windows update.** Some Windows updates require the embedded VM to restart. **Recent activity** on the CID's **Summary** page reports the reboot and marks the install complete once the VM is back online. OpenLab CDS sessions running on the CID are interrupted during this reboot, which is why it is best to install OS updates when no instruments are running on the CID.
- **Windows updates retry automatically.** If a Windows update install fails, the CID retries the install up to 5 times at 60-second intervals before reporting the update as failed. The CID keeps running on its current Windows patch level.
- **Linux updates install packages, then the CID agent.** A Linux update can include OS packages, a new CID agent, or both. Packages install first; if any package fails (after the same 5-retry, 60-second pattern), the agent step is skipped and the CID stays on its current Linux update version. If the agent itself fails to start, the previous agent is restored automatically.

For the full failure-handling picture across all components, see [What happens on failure](./apply-updates#what-happens-on-failure) on the Apply updates page.

## See also

- [Apply updates](./apply-updates): trigger the install for one CID or for many.
- [Define a software template](../setup/define-software-template): override the default OS update selection for a group of CIDs.
- [Configure software exceptions](../setup/configure-software-exceptions): override the default OS update selection on a single CID.
- [View activity logs](../monitoring/view-activity-logs): review the history of OS update installs, restarts, and failures.
