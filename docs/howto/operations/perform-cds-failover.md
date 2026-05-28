---
sidebar_position: 2
title: "Run OpenLab CDS in failover"
sidebar_label: "Run CDS in failover"
description: "Access the Windows VM console on a CID and continue acquiring samples when the OpenLab Server is unavailable."
toc_max_heading_level: 2
---

# <mark>Run OpenLab CDS in failover mode</mark>

When a CID cannot reach its OpenLab Server, the CDS Acquisition client cannot connect to the instrument the normal way. You can, however, connect to the instrument by signing in to the CID's Windows VM console directly and operating OpenLab CDS Acquisition in failover mode. This page walks you through accessing the console and starting CDS in failover.

You will work in two places: CID Hub (from any internet-connected device, including a phone) to retrieve the current Windows VM password, and the Windows VM console on the CID itself to run CDS.

## Prerequisites

- You can sign in to CID Hub and see the CID.
- You know which CID controls the instrument. If not, see [Identify the CID](#identify-the-cid) below.
- You have network access to the CID.
- Use Chrome or Edge for the Windows VM console.

## Identify the CID

Skip this section if you already know the CID name.

Once the OpenLab Server is unreachable, OpenLab Control Panel cannot tell you which CID controls which instrument, so the mapping has to be available locally before an outage. Use whichever of the following you already have in place:

- A label on the instrument bench listing the CID's name and IP address.
- A naming scheme that ties each CID to its instrument (for example, `cid-1290lc-53` for the 1290 LC at bench 53). CID hostnames are limited to 15 lowercase alphanumeric characters.
- A printed **Instrument Controllers Report** or **Instrument Report** from OpenLab Control Panel, kept near the bench. Reprint it whenever instruments are added, moved, or renamed so the copy on the bench stays current.

If DNS is unavailable on your network during the outage, you will also need the CID's IP address for the direct-URL method below.

## Retrieve the CDS Desktop password

The Windows VM password rotates automatically every 24 hours, so you must read the current value from CID Hub each time you start a failover session.

1. Sign in to **CID Hub**. If lab computers cannot reach the internet during the outage, use a phone or any other internet-connected device.
2. Open the **CIDs** list and select the CID you identified above.
3. In the left sidebar, click **Administration**.
4. Under **CDS Desktop user**, note the username and click the eye icon to reveal the password. Copy both; you will need them in a moment.

## Open the Windows VM console

There are two ways to reach the console. Both end at the same Windows sign-in screen.

- **From CID Hub** is the preferred choice when the CID has lost its connection to the OpenLab Server but is still connected to CID Hub.
- **From a direct URL** is the fallback when the CID has also lost its connection to CID Hub.

### From CID Hub

1. On an internet-connected computer, open CID Hub in a browser.
2. Open the **CIDs** list and select the CID. In the left sidebar, click **Administration**.
3. Click **Launch CDS Desktop**.
4. Choose how to reach the CID:
   - **Local**: your computer is on the same corporate network as the CID (onsite or VPN). The console opens over a direct HTTPS connection to the CID.
   - **Remote**: your computer is on a different network. CID Hub opens a tunneled session so the console is reachable from outside the corporate network.
5. The Windows sign-in screen opens in a new browser tab.

### From a direct URL

The typical scenario is an internet outage that cuts off both the OpenLab Server (hosted in a data center) and CID Hub, while the lab LAN itself stays healthy. Instruments, CIDs, and bench PCs can still reach each other, so from a bench PC on that LAN you can go straight to the CID's console URL.

Since CID Hub is unreachable, the **Retrieve the CDS Desktop password** step above will not work either. You will need the current password through some other route, such as a phone on cellular data or any other device that still has internet access.

1. In Chrome or Edge, go to `https://<cid-name-or-ip>/aic-windows-desktop/`. Use the CID's name if DNS resolves it, otherwise its IP address.
2. The Windows sign-in screen opens.

:::note[Image placeholder — `windows-vm-signin.jpg`]
Browser tab showing the Windows VM console sign-in screen for a CID, with the **CDS Desktop user** field highlighted.
:::

## Sign in and start CDS in failover

1. Sign in with the **CDS Desktop user** credentials you copied from the Administration tab.
2. Launch **OpenLab Control Panel** from the Windows desktop. Because the OpenLab Server is unreachable, Control Panel prompts you to switch to failover mode. Accept the prompt.
3. From Control Panel, launch **OpenLab CDS Acquisition** and continue your work.

From this point on you are inside OpenLab CDS, not the CID. The **Acquisition Failover Users Guide** that ships with OpenLab CDS covers everything that happens next, including which methods and projects are available offline, restrictions on creating instruments or modifying settings, the (Q-)TOF Operational Continuity flow, audit-trail attribution for failover sessions, and how acquired results are returned to the Server. It is available from [OpenLab CDS Help](https://openlab.help.agilent.com/en/index.htm#t=mergedProjects%2FGuides%2FOpenLAB_CDS.htm).

## See also

- [Administer a CID](./cid-administration): retrieve credentials, restart services, and run recovery actions from the Administration tab.
- [View activity logs](../monitoring/view-activity-logs): review the CID's recent activity around the outage.
- [Remote access and support tunnels](../../security/remote-access): how the tunneled **Remote** option to the Windows VM console is brokered and audited.
