---
sidebar_position: 4
title: "Apply Updates on CIDs"
---

# Apply Updates on CIDs

## Overview

Software updates for CIDs are a two-step process: **Download** and **Installation**.

1. **Download:** When updates are assigned to a CID, they download automatically in the background.  
2. **Installation:** Updates are **not installed automatically**. A CID administrator must manually apply them from the CID Hub.

This manual control allows you to schedule installations at convenient times (for example, outside of production hours) to avoid interrupting any ongoing work.

---

## Installation Methods

The CID Hub provides three ways to apply pending updates:

- **Method 1: Apply Updates to Multiple CIDs (Bulk Action):** Apply all pending updates to *multiple CIDs* at once.  
- **Method 2: Apply All Updates on a Single CID:** Apply all pending updates to *one specific CID*.  
- **Method 3: Apply Individual Updates on a Single CID:** Apply a *single, specific update* on one CID.

---

## Method 1: Apply Updates to Multiple CIDs (Bulk Action)

Use this method to efficiently update several CIDs at once from the main list.

1. Navigate to the **CID List** page.  
2. Select the checkboxes for CIDs that have **Status = Ready** and **Updates = Ready**.  
3. Click the **Apply Updates** (gear icon) button in the toolbar.

![OS Updates](img/apply-all-cids-list-page.jpg)

### Status

- **New:** The CID record has been created, but the physical CID has not yet activated with it. Updates cannot be applied while it is in this state.  
- **Disconnected:** The CID is not connected to the CID Hub. Updates cannot be applied while disconnected.  
- **CDS not running:** The CID is online, but the OpenLab CDS VM is not running. Updates cannot be applied while CDS is stopped.  
- **Server disconnected:** The CID is online, and OpenLab CDS VM is running, but the CID cannot connect to the OpenLab Server. Applying updates while in this state is **not recommended**.  
- **Ready:** The CID is online, and , and OpenLab CDS VM is running, but CDS Acquisition software is **not running**. This is the recommended state for applying updates.  
- **In Use:** CDS is currently active on the CID. Applying updates while in use is **discouraged**, but not technically blocked.  

### Updates

- *(blank):* No pending updates are available.  
- **Downloading:** The CID is downloading one or more updates.  
- **Ready:** All pending updates have been downloaded and are ready to install.  
- **Updating:** Updates are currently being applied on the CID.  

---

## Method 2: Apply All Pending Updates on a Single CID

Use this method to apply all available updates for one specific CID.

1. On the **CID List** page, click the CID name to open its details page.  
2. Navigate to the **Software** tab.  
3. Click **Apply All Updates** to install all pending updates for that CID.

![Apply All on a CID](img/cid-software-page-apply-all.jpg)

---

## Method 3: Apply a Specific Update on a Single CID

Use this method to apply a single update, for example during troubleshooting or when you want to stagger larger updates.

1. Navigate to the CID’s **Software** tab (same as Method 2).  
2. Locate the update you want to install in the list. The progress bar shows its current status (for example, *Downloading* or *Ready to Install*).  
3. Click **Install** for that specific update.

![Install one on a CID](img/cid-software-page-apply-one.jpg)
