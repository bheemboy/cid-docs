---
sidebar_position: 3.5
title: "View CIDs"
---

# View List of CIDs

The CID's list page is the "Home" page for CID Hub, so this is the page you see when you login. You can specifically access this page by clicking on the CIDs tab on the top navigation bar.

By default the list is sorted by the CID name in descending order. The sort order can be change to descending, or ascending, or unsorted by clicking on the column title. 

You can apply filters to one or more columns in the CIDs list. Click on the chevron that appear to the right of the column name to show a popup which can be used to filter the list. 

![CIDs List Filter](./../img/cids-list-filter.jpg)

### Name
This shows the name of the CID in the CID Hub as well as the hostname for the physical CID. CDS clients must be able to resolve CIDs IP address using this name.

### Description
This is a user given text description for the CID.

### Status
Describes the current 
- `New`: The CID record has been created, but the physical CID has not yet activated with it. Updates cannot be applied while it is in this state.  
- `Disconnected`: The CID is not connected to the CID Hub. Updates cannot be applied while disconnected.  
- `CDS not running`: The CID is online, but the OpenLab CDS VM is not running. Updates cannot be applied while CDS is stopped.  
- `Server disconnected`: The CID is online, and OpenLab CDS VM is running, but the CID cannot connect to the OpenLab Server. Applying updates while in this state is **not recommended**.  
- `Ready`: The CID is online, and , and OpenLab CDS VM is running, but CDS Acquisition software is **not running**. This is the recommended state for applying updates.  
- `In Use`: CDS is currently active on the CID. Applying updates while in use is **discouraged**, but not technically blocked.  

### Updates
Shows whether any updates are required on the CID and if so, their current state 
- *(blank):* No pending updates are available.  
- `Downloading`: The CID is downloading one or more updates.  
- `Ready`: All pending updates have been downloaded and are ready to install.  
- `Updating`: Updates are currently being applied on the CID.


### Inherit
This column shows whether the CID is inherting its software settings from the [**server**](/howto/define-software-template) or it has been setup individually [**CID**](/howto/configure-software-exceptions).

### Allow Updates
This column indicates if the CID is locked down from changes or not. When a CID does not allow updates no changes can be applied to it. After applying necessary changes, you can disallow changes to your CIDs so that no one can make any 'accidental' changes. Changes can only be applied after someone actively unlocks and allows changes to be applied to is.

### Server Name (FQDN)
As the name suggests this shows the server to which the CID is connected. In a multi-server environment you might want to filter CIDs belonging to a particular server and act on them.

### Date Created
This is the date/time when the CID record was originally added in the CID Hub.

### Last Software Update
This is the date/time when any kind of software update was applied to the CID.


### Turn on/off 'Allow Updates'
The **Turn on 'Allow Updates'** (unlock icon) and **Turn off 'Allow Updates'** (lock icon) buttons above the table can be used to allow or disallow changes to one or more CIDs at once.

![Allow Disallow Changes](./../img/allow-disallow-changes.jpg)

### Apply Updates
The **Apply Updates** (gear icon) button can be used to initiate updates on one or more CIDs at once

![Apply Updates to Multiple CIDs](./../img/apply-all-cids-list-page.jpg)

### Export CID Data
The **Export CID Data** (download from cloud icon) button can be used to download the information about the selected CIDs in a json format.

![Export CID Data](./../img/export-cid.jpg)

### Print Software & Connectivity Reports
The **Print Report** (printer icon) button can be used to print information about the selected CIDs.
- **Software Report**: This report shows the summary information about CID including its IP address and versions of software that are currently installed on it.
- **Connectivity Report**: This report shows whether the CIDs are disconnected from their instrument and CID Hub IoT services.

![Print Report](./../img/print-reports.jpg)
