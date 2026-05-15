---
sidebar_position: 1
slug: /
---

# Introduction

![CID image](./img/cid.jpg)

The **Agilent Connected Instrument Device (CID)** for **OpenLab CDS** is a pre-configured IoT solution that includes the OpenLab Instrument Controller software, drivers, and add-ons. OpenLab CDS client systems connect to the CID over the corporate network (intranet) to operate the attached instruments. Software configuration and management for the CID are centralized through a web application called **CID Hub**.

The **CID Hub** is an invitation-only web application. When an organization <mark>purchases</mark> CIDs, Agilent administrators create the organization's account and register the initial customer-side administrators. These initial admins will receive an email invitation from **CID Hub** \<no-reply@hub.cid.agilent.com\> to activate their accounts and set their initial passwords.

<mark>The CID is one of two deployment options for OpenLab CDS, alongside the traditional **Agilent Instrument Controller (AIC)** — OpenLab CDS instrument-controller software installed on a customer-managed Windows PC. The CID alternative replaces that PC with Agilent-supplied IoT hardware managed centrally through CID Hub; it is not mandatory, and CID and AIC deployments can coexist within the same OpenLab CDS environment. See [CID vs AIC](./security/cid-vs-aic.md) for a side-by-side comparison and the [Security](./security/security-model.md) category for the CID's trust model, network exposure, and identity posture.</mark>

![CID layout](./img/layout-1.jpg)
