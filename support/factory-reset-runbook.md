# Factory reset runbook (support only)

> **Internal support material. Do not publish.**
> This file lives outside the published `docs/` tree and is not built or synced
> to the production documentation site. It documents the manual, on-device
> factory reset that support engineers run with SSH or console access. The
> customer-facing reset flow (delete the CID in CID Hub, then reboot) is
> documented separately in *Administer a CID > Factory reset the CID*.

## Purpose

A factory reset returns a CID to a clean, unregistered state by clearing its
configuration and identity while leaving its installed software in place. The
reset is performed by `factory_reset.sh`, a self-contained script that runs
locally on the CID and needs no network connection.

This runbook covers the **manual** reset that you run directly on the device.
Use it for recovery, when the Hub-driven flow is the wrong tool or cannot run.

## When to use the manual reset

Use the manual, on-device reset when:

- **A CID must be recovered while keeping its Hub record.** The device's local
  configuration is corrupted or stuck, but its Hub record (name, history,
  software selections and inheritance, OpenLab Server registration) is good and
  should be preserved. After the reset the CID re-registers against that same
  record automatically, with no PIN entry and no need to re-add the device.
- **The device cannot be driven from the Hub.** The CID is offline, or sits at a
  site where Hub or CDN traffic is blocked, so the Hub-triggered reset cannot
  run or has stalled. The local script completes without network access.
- **A previous reset got stuck.** The CID is in the old "reset started but never
  completed" state. Running the script finishes the reset deterministically.
- **Console access is locked out.** The script resets the `agilentac` password
  as its first action, so a CID locked out of console access can be recovered.

### When not to use it

For routine decommission or reassignment, use the customer-facing flow instead:
delete the CID in CID Hub and reboot. That path is self-service for an account
administrator and does not require SSH or console access. See *Administer a CID >
Factory reset the CID*.

## Decide first: keep or delete the Hub record

The reset behaves the same on the device either way. What differs is how the CID
comes back, and that is governed entirely by whether the Hub record still exists
when the device reboots.

| Hub record at reboot | Outcome after reset |
| --- | --- |
| **Kept** | The CID re-registers against its existing record automatically. It returns as the same logical device, with no PIN entry and no re-add. |
| **Deleted** | The CID has no Hub presence. It must be registered from scratch using the standard PIN-based flow before it can be used. |

Decide which outcome you want before you start, and confirm the Hub record is in
the matching state.

## Prerequisites

- SSH access to the CID, or a keyboard and monitor connected to the chassis for
  console access. Either works, including with the network cable unplugged.
- The ability to authenticate as `agilentac` and run commands with `sudo`.
- No special environment setup is required to run the script.

## Before you reset

- Stop every acquisition running on the CID and disconnect any active
  instruments.
- Confirm that recently acquired data has reached the OpenLab Server. The CID
  does not store sample data locally, but anything in transit at the moment of
  the reset can be lost.
- If you intend to keep the Hub record, confirm it still exists. If you intend
  to register from scratch afterward, confirm the record is deleted and that you
  have the device PIN.

## Run the reset

1. Sign in to the CID over SSH or at the console as `agilentac`.
2. Run the reset script with `sudo`:

   ```
   sudo factory_reset.sh
   ```

3. Let the script run to completion. It reboots the CID when it finishes.

The script is idempotent. Running it again on a CID that is already reset
completes cleanly, and each run creates a new timestamped backup, so re-runs do
not overwrite earlier backups.

## What the reset changes

**Cleared or reset:**

- The `agilentac` (Linux) password, reset to its default. This is the first
  action the script takes.
- AWS IoT Thing name, certificates, and private keys.
- The agent data store (`Data.json`). After a successful reset it is rebuilt
  with the PIN set to `0000`, `is_registered` set to false, and `ac_name`,
  identity, certificates, `thing_name`, and OpenLab Server details removed.
- Recent activity and any pending Activity Log entries held on the device.
- Containers and their volumes, recreated from the locally stored agent image
  with fresh volumes.
- Cached downloads (KVM images, drivers, Linux Update files).
- The CID's network configuration, reset to defaults. (It is reapplied when the
  device connects to the Hub and activates.)
- System hardening is reapplied: UTC timezone, firewall, Cockpit, journald, RPC
  bind disable, and the status script are all reconfigured.

**Preserved:**

- The installed CID agent and its container image.
- Operating system packages.
- The hostname.

The reset does not download anything and does not call the installer scripts, so
it does not depend on Hub or CDN reachability.

## Activity Log behavior

The script writes **no** CID Hub Activity Log entries, not when it starts and not
when it completes. The only related entry is the deletion entry, written at the
time a CID is deleted from the Hub, if that is the path taken. Do not look for
"reset started" or "reset completed" entries; they are no longer produced.

## Backups

Before clearing anything, the script backs up the items it is about to remove to
a timestamped directory under `/var/backups/ac-agent/`. The backup captures the
AWS IoT Thing name, certificates and private keys, `Data.json`, recent device
activity, pending Activity Log entries, the root SSH authorized keys, and the
Cockpit configuration.

These backups are for engineering and support reference only, not for end users.
Confirm the exact backup path on the build you are working with before relying on
it for recovery.

## Verify the reset

1. Confirm the script completed without error and the CID rebooted.
2. Locate the device by its PIN in the Devices list and confirm the **Last
   Connected** time has started updating again. A resuming Last Connected time
   means the reset device is back on the network and waiting to be registered.
3. Confirm the expected re-registration behavior for the path you took:
   - **Record kept**: the CID re-registers automatically and becomes available
     without PIN entry.
   - **Record deleted**: the CID stays unregistered until you register it from
     scratch using the PIN-based flow.
4. Confirm the installed agent version, OS package versions, and hostname are
   unchanged immediately after the reset. They may change later when the CID
   connects to the Hub and activates.

## If the reset fails

- The script does not silently continue past a failure. On error it logs the
  name of the failing step to the journal and exits with a non-zero code. Check
  the journal on the CID for the failing step.
- The agent version restored on reset comes from the running container if one is
  present, otherwise from the latest image in `/opt/ac-agent-images`. If neither
  is available the script cannot select an agent version and stops. In that case
  the agent image must be restored (for example through a Linux Update) before
  the reset can complete.
- If a step failed partway, the pre-clear backup under `/var/backups/ac-agent/`
  holds the device's prior identity and configuration for recovery.

## Distribution

`factory_reset.sh` is present locally on the CID. Existing CIDs receive it
through a Linux Update. New devices ship with the script built into the image
alongside the agent installed on them. There is a single reset script on each
CID, and running it always resets the CID to the agent that was running on it.

## Escalation

If the reset cannot complete after restoring the agent image, or if the CID does
not re-register against a preserved Hub record after a successful reset, escalate
to engineering with the journal output and the path to the pre-clear backup
directory.
