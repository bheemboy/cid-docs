---
sidebar_position: 4
title: "Apply Updates on CIDs"
---

# Apply Updates on CIDs

## Overview

Software updates for CIDs (Connected Instrument Devices) are a two-step process: **Download** and **Installation**.

1.  **Download:** When updates are assigned to a CID, they download automatically in the background.
2.  **Installation:** The updates **do not install automatically**. They wait for a CID administrator to manually trigger the installation from the CID Hub.

This manual control allows you to schedule installations at a specific time (e.g., outside of production hours) to avoid interrupting any work being performed on the CIDs.

### Three Methods for Installation

The CID Hub provides three flexible methods to install pending updates:

* **Method 1: Bulk Apply (Multiple CIDs):** Apply all pending updates to *multiple CIDs* at the same time.
* **Method 2: Apply All (Single CID):** Apply all pending updates to *one specific CID*.
* **Method 3: Apply Individually (Single Update):** Apply a *single, specific update* to one CID.

---

## Method 1: Apply Updates to Multiple CIDs (Bulk Action)

Use this method to efficiently update several CIDs at once from the main list.

1.  Navigate to the **CID List** page.
2.  Select the checkboxes for all the CIDs you wish to update.
3.  Click the **Apply Updates** (gear icon) button in the toolbar.

![OS Updates](img/apply-all-cids-list-page.jpg)

:::tip[IMPORTANT]
Before you click "Apply Updates," check the **Status** and **Updates** columns.
- **Status** = `Ready`: This is the **ideal state** for applying an update. It means the CID is online, but CDS is **not running**.
- **Status** = `Idle`, `Running`: This means that CDS software **is active** on the CID. Installing updates in this state is **not recommended** as it could interfere with production work.
- **Updates** = `Ready`: This confirms that all pending updates have been downloaded to the CID and are ready for installation.
:::

---

## Method 2: Apply All Pending Updates on a Single CID

Use this method to install all available updates for one specific device.

1.  From the CID List page, click on a CID's name to open its details page.
2.  Navigate to that CID's **Software** tab.
3.  Click the **"Apply All Updates"** button to install all pending updates for this device.

![Apply All on a CID](img/cid-software-page-apply-all.jpg)

---

## Method 3: Apply Individual Updates on a Single CID

Use this method to install a specific patch or update, for example, during troubleshooting or to stagger large updates.

1.  Navigate to the CID's **Software** tab (same as Method 2).
2.  Find the specific update you want to install in the list. The progress bar will show its status (e.g., "Downloading," "Ready to Install").
3.  Click the **"Install"** button for that single update.

![Install one on a CID](img/cid-software-page-apply-one.jpg)