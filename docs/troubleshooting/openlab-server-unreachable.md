---
sidebar_position: 8
slug: /troubleshooting/openlab-server-unreachable
title: "OpenLab Server unreachable"
description: Diagnose and resolve failures when the CID cannot reach, validate, or register with the OpenLab CDS Server (OLSS).
toc_max_heading_level: 3
---

# OpenLab Server unreachable

**Product**: Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience**: Agilent Support, IT/network administrators
**Support reference**: Network / firewall configuration

:::caution
The diagnostic procedures on this page are intended for IT administrators familiar with Linux commands. Incorrect use of the underlying tools can misconfigure the CID and render it inoperable. Proceed only if you are comfortable working in a Linux environment.
:::

---

## Symptom

The CID cannot reach, validate, or register with the OpenLab CDS Server (OLSS) configured on the CID's record in CID Hub. This is distinct from connectivity to the Agilent and AWS cloud endpoints covered by the other troubleshooting pages. This may manifest as:

- A brand-new CID completes Hub-side activation but stalls on CDS registration, never reaching the **Connected** state.
- A brand-new CID reaches the OLSS server, but CDS registration fails when the OLSS or OpenLab ECM 3.x server presents a corporate or self-signed certificate that the CID does not trust.
- For an already-registered CID, the status in CID Hub shows **Server disconnected**. This status is triggered specifically by OLSS being unreachable or down; credential issues alone do not trigger it.
- In CID Hub, the Recent Activity view shows one of these error messages against the configured OLSS server:
  - `Could not resolve '<hostname>'.`
  - `Server '<hostname>' (<IP>) is unreachable.`
  - `FQDN provided '<hostname>' is not a valid OLSS.`
  - `Could not validate OpenLab server. 'https://<hostname>/openlab/olss/v1/health' is not responding.`
  - `Could not validate OpenLab server. 'https://<hostname>/openlab/olss/v1/health' returned an error.`
  - During activation, these messages are appended with `Retrying in 60 seconds.`
- Instruments connected to the CID cannot route data to OpenLab CDS.
- After an OLSS upgrade or relocation, an already-registered CID stops syncing with the server while local CDS acquisition continues.

---

## Root cause

The CID reaches the OLSS server over the customer network on TCP/443. OLSS deployments vary: it may sit on the same lab segment as the CID, in a corporate data center, on a remote site reached over a WAN, or in a cloud-hosted environment. Any firewall, router, ACL, micro-segmentation rule, or WAN / VPN policy on the path between the CID and the OLSS endpoint may need to be opened explicitly to permit CID-to-OLSS traffic.

The CID validates OLSS in a three-stage sequence and at two distinct times:

1. **DNS resolution** of the OLSS hostname or FQDN configured on the **Connect using** field of the server's CID Hub record.
2. **TCP/443 reachability** to the resolved IP (using `nmap -Pn -sT -p 443 --host-timeout 5s -n`; ICMP is not used).
3. **OLSS health endpoint** check (`/openlab/olss/v1/health`).

Validation timing:

- **During activation** (before CDS registration succeeds): if any stage fails, the CID logs the error and retries every 60 seconds indefinitely.
- **During regular bootup** (after a successful CDS registration): if any stage fails, the CID logs the error and continues bootup without retrying.

A failure at any stage prevents fresh CDS registration; for a registered CID, it interrupts ongoing synchronization until the server is reachable again.

---

## Confirm this is the right document

Use the following table to confirm that the OpenLab Server is the failing endpoint.

| Where you came from | Next step |
|---|---|
| CID Hub Recent Activity shows one of the OLSS error messages listed in Symptom | This is the correct document. Continue below. |
| A brand-new CID stalls on CDS registration after Hub-side activation completes | This is the correct document. Continue below. |
| The CID reaches the server but registration fails, and the OLSS or ECM 3.x server uses a corporate or self-signed certificate | This is the correct document. See [Untrusted OpenLab or ECM server certificate](#untrusted-openlab-or-ecm-server-certificate) in Resolution. |
| You ran [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity) but the failing endpoint is the customer OLSS server, not an Agilent or AWS endpoint | This is the correct document. The connectivity tester does not test OLSS; continue below. |
| Cloud service endpoints (Agilent, AWS, Microsoft) are also unreachable | Resolve the cloud-side failure first; see [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked). Return here once cloud connectivity is restored. |
| DNS resolution for the OLSS hostname fails | See [DNS resolution failure](/troubleshooting/dns-resolution-failure). |

---

## Affected services

Impact depends on whether the CID has previously completed CDS registration.

- **Brand-new CID (CDS registration not yet completed)**. CDS registration cannot proceed during activation, so the CDS application stack on the CID remains uninitialized and no CDS acquisition workflows can be started against it. The physical instrument-to-CID link over the Instrument NIC is not affected.
- **Already-registered CID (CDS Failover mode)**. Local data acquisition continues using cached configuration and project state, and the instrument-to-CID link is unaffected. Results are cached locally and uploaded to OLSS once connectivity is restored. Operations that require OLSS at request time fail until OLSS is reachable; this includes method downloads, user authentication against OLSS, project sync, and license checks.

Cloud-facing CID services (activation against CID Hub, AWS IoT telemetry, software updates) are unaffected by an OLSS outage.

---

## Prerequisites

- Command-line access to the CID via Cockpit (see [Access the connectivity tester](/troubleshooting/verify-internet-connectivity#access-the-connectivity-tester)), SSH, or direct console connection.
- The OLSS hostname or FQDN as registered in CID Hub (visible under the server's **Connect using** field).
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable.

---

## Diagnostic steps

### Step 1. Confirm DNS resolution

The CID must be able to resolve the OLSS hostname. The CID and OLSS may sit on different subnets with different DNS servers; resolution can fail even when the server is otherwise reachable.

```bash
# Replace <openlab-server> with the OLSS hostname or FQDN from
# the CID Hub Connect using field.
# Example: olss.lab.example.com

nslookup <openlab-server>
```

| Result | Next step |
|---|---|
| Returns one or more IP addresses | DNS is working. Continue to Step 2. |
| Returns `NXDOMAIN`, `SERVFAIL`, or times out | DNS resolution is failing. See [DNS resolution failure](/troubleshooting/dns-resolution-failure). |

:::note
If **Connect using** is set to an IP address rather than a hostname, DNS resolution is not used and this step can be skipped.
:::

---

### Step 2. Check TCP/443 reachability

This is the same check the CID's Linux agent performs during activation and bootup.

```bash
# Replace <openlab-server> with the OLSS hostname or FQDN from
# the CID Hub Connect using field.
# Example: olss.lab.example.com

nmap -Pn -sT -p 443 --host-timeout 5s -n <openlab-server>
```

| nmap result | Next step |
|---|---|
| Port `443/tcp open` | TCP reachability is confirmed. Continue to Step 3. |
| Port `443/tcp filtered` | A firewall on the path is silently dropping traffic on TCP/443. See [Firewall between CID and OLSS](#firewall-between-cid-and-olss). |
| Port `443/tcp closed` | The OLSS host is reachable but actively refusing TCP/443. The OLSS services may be stopped. See [OLSS services not running](#olss-services-not-running). |
| Host did not respond / timeout | The OLSS host is unreachable. Continue to Step 5 to characterize the network path. |

---

### Step 3. Check the OLSS health endpoint

TCP reachability does not guarantee the OLSS application is running and healthy. The CID validates OLSS by calling the health endpoint.

```bash
# Replace <openlab-server> with the OLSS hostname or FQDN from
# the CID Hub Connect using field.
# Example: olss.lab.example.com

curl -sk https://<openlab-server>/openlab/olss/v1/health
```

| Result | Next step |
|---|---|
| HTTP 200 response | OLSS is healthy. Continue to Step 4 to verify type and version compatibility. |
| Connection refused or timeout | The OLSS services are not running on the server, or not installed. See [OLSS services not running](#olss-services-not-running). |
| HTTP 4xx or 5xx error | OLSS is responding but returning an error. See [OLSS health endpoint error](#olss-health-endpoint-error). |

---

### Step 4. Check the OLSS type and version compatibility messages

If Steps 1–3 all succeed but activation still fails, the cause is usually an OLSS type or version compatibility mismatch. Both surface explicitly in CID Hub Recent Activity:

- **Incorrect installation type**. The CID requires the OpenLab installation type to be **Server**; Workstation and Client installations are not compatible. A type mismatch is surfaced by the agent during configuration. See [Incorrect server installation type](#incorrect-server-installation-type).
- **OLSS server version too old**. The OLSS server must be at a version equal to or newer than the OLSS tier included with the CID's CDS installation. A version mismatch surfaces in Recent Activity as `Error: Server's version '<X>' is older than CID version '<Y>'`, where `<X>` is the external OLSS version and `<Y>` is the OLSS version included with the CDS install in the CID's Windows VM. Both numbers are printed for you. See [Version compatibility failure](#version-compatibility-failure).

If you want to verify the OLSS server's running version independently, run the following from any host with network access to the OLSS server:

```bash
# Replace <openlab-server> with the OLSS hostname or FQDN from
# the CID Hub Connect using field.
# Example: olss.lab.example.com

curl -sk https://<openlab-server>/openlab/olss/v1/serverinfo
```

The response includes a `version` object (`majorVersion.minorVersion.buildVersion`) for the OLSS server. The CID-side OLSS version is determined by the CDS version installed on the CID; the simplest source is the Recent Activity message described earlier, which prints both numbers when the failure occurs. The CDS version can also be looked up in Control Panel on any CDS client or AIC running the same version of CDS.

| Result | Next step |
|---|---|
| Recent Activity reports `Server's version '<X>' is older than CID version '<Y>'`, or the `serverinfo` `version` is older than the CID-side OLSS version | The external OLSS server is too old. See [Version compatibility failure](#version-compatibility-failure). |
| Recent Activity reports a type-mismatch failure, or the OLSS host is known to be a Workstation or Client installation | The installation type is not supported. See [Incorrect server installation type](#incorrect-server-installation-type). |
| Type and version both match, but CDS registration still fails and the OLSS or OpenLab ECM 3.x server presents a corporate or self-signed certificate | The certificate is untrusted. See [Untrusted OpenLab or ECM server certificate](#untrusted-openlab-or-ecm-server-certificate). |

---

### Step 5. Characterize the network path

If Step 2 showed the host unreachable or traffic timing out, use `mtr` to identify where in the path the traffic is being dropped. This is most useful when the CID and OLSS are on different network segments separated by firewalls or routing boundaries.

```bash
# Replace <openlab-server> with the OLSS hostname or FQDN from
# the CID Hub Connect using field.
# Example: olss.lab.example.com

mtr --report --tcp --port 443 <openlab-server>
```

Provide the full output to your network team. A path that loses packets at an intermediate hop indicates the block sits on the network path rather than on the OLSS host itself.

| Result | Next step |
|---|---|
| Packets are lost at an intermediate hop before reaching the OLSS host | A firewall or routing boundary on the path is dropping TCP/443. See [Firewall between CID and OLSS](#firewall-between-cid-and-olss). |
| The path completes to the OLSS host but the final hop refuses or drops TCP/443 | The OLSS host is reachable but not accepting TCP/443. See [OLSS services not running](#olss-services-not-running). |
| The path completes and TCP/443 reaches the OLSS host | The network path is clear; re-run Step 3 to check the OLSS health endpoint. |

---

## Resolution

Apply the appropriate sub-resolution based on the diagnostic results.

### Firewall between CID and OLSS

If Step 2 showed `filtered` state, or Step 5 showed packets being lost at an intermediate hop:

- Request that your network team permit outbound **TCP/443** from the CID's Corporate NIC IP to the OLSS server's IP.
- If the CID and OLSS sit on different network segments, verify that every firewall, router, NAC, or WAN / VPN policy along the path permits TCP/443 traffic between the two segments.
- Recheck Step 2 once the rule is in place.

### OLSS services not running

If TCP/443 is `closed` (Step 2) or the health endpoint refuses or times out (Step 3):

- Verify the OpenLab Server is powered on and fully booted.
- On the OLSS server, confirm the OpenLab Shared Services stack is running (the OLSS web tier and its dependent Windows services). If any are stopped, start them and wait for the health endpoint to respond.
- If a service fails to start, review the OpenLab application logs on the server.

### OLSS health endpoint error

If the health endpoint (Step 3) returns HTTP 4xx or 5xx:

- Review the OLSS server's event logs for OLSS service errors.
- Verify the OLSS database and storage subsystems are running.
- If the server was recently updated or restarted, allow time for all OLSS services to come online before retrying.
- If the error persists, contact Agilent Support.

### Incorrect server installation type

If Recent Activity reports a type-mismatch failure against the configured OLSS server, or activation fails after Steps 1–3 succeed and the OLSS server is known to be a Workstation or Client installation:

- The CID cannot register with Workstation or Client installations; only the **Server** installation type is supported.
- Either install OpenLab CDS using the Server installation type on the destination host, or update the CID's record in CID Hub to point at a different OpenLab Server.

### Version compatibility failure

If Recent Activity reported `Server's version '<X>' is older than CID version '<Y>'`:

- Upgrade the external OpenLab CDS Server to a version equal to or newer than `<Y>` (the OLSS tier included with the CID's CDS installation).
- Alternatively, contact Agilent Support to discuss an agent exception that allows the older OLSS server version.

### Untrusted OpenLab or ECM server certificate

If Steps 1–3 succeed but CDS registration fails because the OLSS or OpenLab ECM 3.x server presents a corporate or self-signed certificate, the CID does not trust the certificate's issuing CA. The Step 3 health check uses `curl -sk`, which skips certificate validation, so it succeeds even when the certificate is untrusted; the trust failure surfaces later, during AIC configuration and CDS registration.

- Import the issuing CA (the root and any intermediate certificates) into CID Hub. See [Manage certificate authorities](/howto/setup/manage-certificate-authorities).
- Reboot the CID, or wait for the next certificate authority synchronization, then retry registration.
- For which servers require a CA import, see the [SSL certificate requirements](/reference/system-requirements#ssl-certificate-requirements) section of System requirements.

---

## Related documents

- [Verify CID internet connectivity](/troubleshooting/verify-internet-connectivity)
- [TCP port 443 blocked](/troubleshooting/tcp-port-443-blocked)
- [TLS handshake failure](/troubleshooting/tls-handshake-failure)
- [DNS resolution failure](/troubleshooting/dns-resolution-failure)
- [Beep codes on startup](/troubleshooting/beep-codes-on-startup)
