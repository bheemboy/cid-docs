---
sidebar_position: 6
slug: /cid-net-06
---

# CID-NET-06: OpenLab Server Unreachable

**Product:** Agilent Connected Instrument Device (CID) for OpenLab CDS
**Audience:** Agilent Support, IT/Network Administrators
**Support Reference:** Network / Firewall Configuration

---

## Symptom

The CID cannot reach the on-premises OpenLab CDS Server (OLSS). This may manifest as:

- The CID emitting **2 beeps** repeatedly every 30 seconds during bootup or activation
- Recent Activities in the CID Hub showing one of the following errors:
  - `Could not resolve '<hostname>'`
  - `Server '<hostname>' (<IP>) is unreachable`
  - `Could not validate OpenLab server. 'https://<hostname>/openlab/olss/v1/health' is not responding`
  - `Could not validate OpenLab server. 'https://<hostname>/openlab/olss/v1/health' returned an error`
- CDS registration failing or not completing during activation
- Instruments unable to connect through the CID to OpenLab CDS

This issue is specific to the **on-premises OpenLab server** on your corporate network — it is distinct from connectivity to cloud services (AWS IoT, CID Hub, etc.). If cloud service endpoints are also unreachable, start with [**CID-NET-01: TCP Port 443 Blocked**](/cid-net-01) first.

---

## Confirm This Is the Right Document

Run the following command, substituting the hostname or FQDN of the OpenLab server registered in the CID Hub:

```bash
nmap -Pn -sT -p 443 --host-timeout 5s -n <openlab-server>
```

| Result | Next Step |
|---|---|
| Port 443 shows `open` | TCP connectivity is confirmed. The failure is at the OLSS service level. Continue below to [Step 3](#step-3--check-the-olss-health-endpoint). |
| Port 443 shows `filtered` or `closed`, or the scan times out | This is the correct document. Continue below from [Step 1](#step-1--confirm-dns-resolution). |
| Hostname could not be resolved | DNS resolution has failed. Refer to [**CID-NET-05: DNS Resolution Failure**](/cid-net-05) first, then return here. |

---

## Background

The CID communicates with the on-premises OpenLab CDS Server (OLSS) over the **corporate network** on TCP port 443. Unlike cloud service endpoints (which traverse the internet and perimeter firewalls), the OLSS server is typically in a data center VLAN while the CID is in a lab VLAN — on different subnets that may have restricted access between them. Firewalls or access control lists between VLANs may need to be opened to permit the CID to reach the OpenLab server.

The CID validates OLSS connectivity at two points:

- **During activation** (before CDS registration) — if validation fails, the CID retries every 60 seconds until the server becomes reachable
- **During regular bootup** (after successful CDS registration) — if validation fails, the CID logs the error and continues bootup without retrying

The validation sequence is:

1. DNS resolution of the OLSS hostname
2. TCP port 443 reachability check (using `nmap`)
3. OLSS health endpoint check (`/openlab/olss/v1/health`)

A failure at any step prevents CDS registration and instrument communication.

---

## Affected Services

When the OpenLab server is unreachable, the following CID functions are impacted:

- **CDS registration** — the CID cannot register with the OpenLab server during activation
- **Instrument communication** — instruments connected to the CID cannot communicate with OpenLab CDS
- **Data acquisition** — acquisition methods and sample analysis cannot be performed through the CID

---

## Prerequisites

Before proceeding, please ensure the following conditions are met:

- Access to the CID via Cockpit (see [CID Connectivity Tester → Accessing the App](/troubleshooting/cid-connectivity-tester#accessing-the-app)) — use the built-in **Terminal** tab to run diagnostic commands. Alternatively, command-line access via SSH or direct console connection
- The OpenLab server hostname as configured in the CID Hub (visible under the server's **Connect using** field)
- Authorization from your IT or network security team to execute network diagnostic commands, if applicable

All diagnostic utilities used below (`nmap`, `nc`, `curl`, `nslookup`) are pre-installed on the CID's Oracle Linux OS.

---

:::tip[First Step]
Before running manual diagnostics, use the [CID Connectivity Tester](/troubleshooting/cid-connectivity-tester) — a built-in GUI tool that tests all required endpoints and is available even on unactivated CIDs. Select the OpenLab server hostname from the endpoint list or enter it manually.
:::

## Diagnostic Steps

### Step 1 — Confirm DNS Resolution

The CID must be able to resolve the OpenLab server hostname. If the CID and the OpenLab server are on different subnets or use different DNS servers, resolution may fail even though the server is otherwise reachable.

```bash
nslookup <openlab-server>
```

| Result | Next Step |
|---|---|
| Returns one or more IP addresses | DNS is working. Continue to [Step 2](#step-2--check-tcp-port-443-connectivity). |
| Returns `NXDOMAIN`, `SERVFAIL`, or times out | DNS resolution is failing for the OpenLab server. Refer to [**CID-NET-05: DNS Resolution Failure**](/cid-net-05). |

> **Note:** The OpenLab server may be registered with a hostname, an FQDN, or an IP address in the CID Hub. If **Connect using** is set to an IP address, DNS resolution is not required and this step can be skipped.

---

### Step 2 — Check TCP Port 443 Connectivity

This is the same check the CID Linux Agent performs during activation and bootup. It tests whether a TCP connection can be established to the OpenLab server on port 443.

```bash
nmap -Pn -sT -p 443 --host-timeout 5s -n <openlab-server>
```

| nmap Result | Interpretation |
|---|---|
| `open` | TCP port 443 is reachable on the OpenLab server. Continue to [Step 3](#step-3--check-the-olss-health-endpoint). |
| `filtered` | A firewall between the CID and the OpenLab server is silently dropping traffic on port 443. See [Resolution — Firewall Between CID and OLSS](#firewall-between-cid-and-olss). |
| `closed` | The OpenLab server is actively refusing connections on port 443. The server may be running but the OLSS web service is not listening. See [Resolution — OLSS Web Service Not Running](#olss-web-service-not-running). |

For a simpler connectivity test, you can also use `nc`:

```bash
nc -zv <openlab-server> 443
```

---

### Step 3 — Check the OLSS Health Endpoint

TCP connectivity on port 443 does not guarantee that the OLSS application is running and healthy. The CID validates the OLSS service by calling the health endpoint.

```bash
curl -sk https://<openlab-server>/openlab/olss/v1/health
```

| Result | Interpretation |
|---|---|
| HTTP 200 response | The OLSS service is running and healthy. The CID should be able to connect. If activation is still failing, the issue may be with credentials or compatibility — contact Agilent Support. |
| Connection refused or timeout | The OLSS web service is not running on the server, or is not installed. See [Resolution — OLSS Web Service Not Running](#olss-web-service-not-running). |
| HTTP 4xx or 5xx error | The OLSS service is running but returning an error. This may indicate a misconfiguration or service failure on the OpenLab server. See [Resolution — OLSS Health Endpoint Error](#olss-health-endpoint-error). |

---

### Step 4 — Verify the OpenLab Server Is the Correct Type

The CID is only compatible with OpenLab CDS **Server** installations. If the OpenLab server is a **Workstation** or **Client** installation type, compatibility validation will fail even when network connectivity is working.

Check the server type using the server info endpoint:

```bash
curl -sk https://<openlab-server>/openlab/olss/v1/serverinfo
```

In the JSON response, look for the installation type field. If the response indicates a type other than **Server**, the CID cannot register with this OpenLab installation.

---

### Step 5 — Check Compatibility Between CID and OLSS Versions

The CID verifies that the OpenLab server version is not older than the CID version. A server that is older than the CID will cause a compatibility failure.

```bash
curl -sk https://<openlab-server>/openlab/olss/v1/serverinfo
```

In the JSON response, compare the `olssVersion` and `cidVersion` values. If `olssVersion` is older than `cidVersion`, the CID will reject the connection with an error such as:

```
Server version 'X' is older than CID version 'Y'
```

If this is the case, the OpenLab server must be upgraded to a version that is equal to or newer than the CID version.

---

### Step 6 — Trace the Network Path

If TCP port 443 connectivity is failing, tracing the network path can help identify where traffic is being blocked — particularly useful when the CID and OpenLab server are on different VLANs separated by internal firewalls.

```bash
mtr --report --tcp --port 443 <openlab-server>
```

Provide the full output to your network security team. A path that terminates at an internal IP address before reaching the OpenLab server indicates traffic is being blocked at that point in the network.

---

## Resolution

Based on the diagnostic results, apply the appropriate resolution below.

### Firewall Between CID and OLSS

If Step 2 showed `filtered` state (or Step 6 showed traffic being dropped at an internal hop):

- Request that your IT team permit **outbound TCP port 443** from the CID's IP address to the OpenLab server's IP address
- If the CID and OpenLab server are on different VLANs or subnets, verify that the internal firewall or router permits traffic between the two network segments
- Check whether any network access control (NAC) or micro-segmentation policies are restricting east–west traffic within the corporate network

### OLSS Web Service Not Running

If TCP port 443 is open but the health endpoint (Step 3) is not responding:

- Verify that the OpenLab CDS server is powered on and booted
- Log in to the OpenLab server and check whether the OLSS Windows service is running
- If the service is stopped, start it and wait for the health endpoint to respond
- If the service fails to start, check the OpenLab application logs on the server for errors

### OLSS Health Endpoint Error

If the health endpoint (Step 3) returns an HTTP error:

- Check the OpenLab server's event logs for OLSS service errors
- Verify that the OLSS database and storage services are running on the server
- If the server was recently updated or restarted, allow time for all OLSS services to come online
- Contact Agilent Support for assistance with OLSS service errors

### Incorrect Server Installation Type

If Step 4 showed that the OpenLab installation is not a **Server** type:

- The CID cannot register with Workstation or Client installations
- Install OpenLab CDS using the Server installation type, or re-register the CID against a different OpenLab Server installation

### Version Compatibility Failure

If Step 5 showed that the OpenLab server version is older than the CID version:

- Upgrade the OpenLab CDS server to a version that is equal to or newer than the CID version
- Contact Agilent Support for upgrade guidance

---

## Related Documents

- [**CID-NET-01** — TCP Port 443 Blocked](/cid-net-01)
- [**CID-NET-02** — TLS Handshake Failure](/cid-net-02)
- [**CID-NET-05** — DNS Resolution Failure](/cid-net-05)
- [CID Connectivity Tester](/troubleshooting/cid-connectivity-tester)
