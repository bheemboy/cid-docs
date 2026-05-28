---
sidebar_position: 2
title: "Manage account settings"
description: "View your organization's CID Hub account and update the address, contacts, and other editable details."
toc_max_heading_level: 2
---

# <mark>Manage account settings</mark>

Use the **Account** page in CID Hub to review your organization's account details and keep the address, phone number, and contacts current. Administrators in your account can edit; other users can view.

## Prerequisites

- You must be signed in to CID Hub. Any signed-in user in your account can view the Account page.
- To make changes, you must have the **Administrator** role. See [Manage users and roles](./manage-users-and-roles).

## Open the Account page

1. Click the **Settings** (gear) icon in the top-right corner of the top navigation bar.
2. Select **Account**.

   The **Account Summary** page opens with your organization's details.

   ![Account Summary Page](../../img/account-summary-page.jpg)

## Account Summary

The Account Summary page shows:

- **Company name** and **address**.
- **Country** and **phone**.
- **Primary contact** and **Secondary contact**.
- **Comments**.
- Read-only counts of **Servers**, **CIDs**, and **Users** registered to the account.
- **Date created** and **Date modified**.
- **Purchase date** and **SMA expiry date**, when set by Agilent.

## Edit account details

1. On the Account Summary page, click the **Edit** (pencil) icon.

   ![Edit Account Icon](../../img/edit-account-icon.jpg)

2. The **Edit Details** dialog opens. Update any of the editable fields: address, country, phone, primary or secondary contact, comments. The company name is also editable but must remain unique across all CID Hub accounts (matching is case-insensitive); it cannot be blank.

   ![Edit Account Dialog](../../img/edit-account-dialog.jpg)

3. Enter a justification in the **Reason/description for this change** field. This field is required and is recorded with the change in the activity log.

4. Click **Update** to save, or **Cancel** to discard your edits.

:::note
Fields labeled **(ETT)**, along with **Purchase date** and **SMA expiry date**, are managed by Agilent for licensing and internal record-keeping. They appear on the summary when set, but you cannot edit them from your account. Contact Agilent support if any of these values is wrong.
:::

## See also

- [Manage users and roles](./manage-users-and-roles): invite users, assign Administrator or User roles, and remove access.
- [View activity logs](../monitoring/view-activity-logs): review who changed which account details and when.
