---
sidebar_position: 9
title: Perform CDS Failover
sidebar_label: Perform CDS Failover
description: How to access the Windows KVM console to perform failover operations when the OpenLab Server is unavailable.
---

# Performing CDS Failover on CIDs

When a standard AIC loses connection to the OpenLab Server, users typically Remote Desktop (RDP) into the unit or attach a physical keyboard and monitor.

However, because the Instrument Controller (AIC) within a CID is a virtualized Windows KVM, the failover process requires accessing the Windows Console via a web browser.

:::info
In normal operation, the CDS Client remotely interacts with the instrument via the CID. When the connection to the OpenLab Server is lost, you must access the **Windows KVM Console** directly to perform failover operations.
:::

Access to the **CID Hub** web interface is required to retrieve the current password to log in to the Windows console.

## Step 1: Identify the CID

You must first identify which CID is controlling the instrument you wish to use.

It is a best practice to use similar names for a CID and the Instrument it connects to, making identification easier during an outage. If the CID name does not match the instrument name, you can identify the correct unit using the CID's PIN and cross-referencing it with the "[devices page](view-devices)" in the CID Hub.

Alternatively, you can refer to a printed copy of the "Instrument Controllers Report" from the OpenLab Control Panel.

1.  Navigate to the **Instrument Controllers Report** or **Instrument Report** in the OpenLab Control Panel.
2.  Locate the target Instrument and note the **Instrument Controller** name or IP address.

:::tip
If the DNS server is not accessible, the CID's IP address will be required to access it from the local network.
:::

## Step 2: Retrieve the Maintenance Password

Unlike a standard AIC, the Windows password for the CID's internal KVM changes automatically for security.

1.  Log in to the **CID Hub**. 
    * *Note: If lab computers do not have internet access, this step can be performed from any internet-connected device, such as a smartphone.*
2.  Navigate to the **Administration** tab for the specific CID.
3.  Locate the **CDS Password** field.
4.  Click the "eye" icon to reveal the password.

## Step 3: Access the Windows Console

There are two methods to access the Windows KVM console depending on your network location.

### Method A: Launch via CID Hub (Recommended)

If you are already logged into the CID Hub from a workstation (with a monitor, mouse, and keyboard), this is the easiest method.

1.  In the CID Hub **Administration** tab, look for **CDS Desktop Access**.
2.  Click **Launch CDS Desktop**.
3.  Select your connection type:
    * **Local:** Select this if you are on the same corporate network as the CID (Onsite or VPN).
    * **Remote:** Select this if you are on a different network. This creates a tunneled session via the CID Hub to allow access to the console.

### Method B: Direct URL Access

If you know the IP address or Hostname of the CID and are on the same local network:

1.  Open a browser (Chrome/Edge).
2.  Enter the URL: `https://<CID-IP>/aic-windows-desktop/`
    * *Replace `<CID-IP>` with the actual IP address (or the CID name if DNS is accessible).*
3.  You will be presented with the Windows login screen.

## Step 4: Perform Failover Operations

Once the browser loads the Windows Console:

1.  Enter the username `AgilentCID`.
2.  Enter the **CDS Password** you retrieved in Step 2.
3.  Once logged into Windows, launch the **OpenLab CDS Acquisition** software.
4.  Proceed with analyzing samples in failover mode.

:::info
Refer to the *Acquisition Failover User Guide* in [OpenLab CDS Help](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FGuides%2FOpenLAB_CDS.htm).
:::