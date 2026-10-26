---
title: Building SAMAR-AGOS at rSCENE 2026
date: 2026-10-08
summary: How Team Los Codigos turned scattered water-interruption reports into a monitoring and response platform for Catbalogan's water district during a 48-hour hackathon.
tags: hackathon, civic tech, firebase
---

<!-- TODO (Manuel): add your own story — what the 48 hours felt like, the hardest bug, what you'd do differently. Everything below sticks to facts from the project. -->

In October 2026, Team Los Codigos joined the **rSCENE 2026 Hackathon** in Catbalogan City — the Regional Smart Communities Exposition and Networking Engagement, organized by DOST Region VIII with the City Government of Catbalogan. The theme was *"The Living Tapestry — Weaving the Threads of Innovation and Heritage"*, and teams had 48 hours to build something useful for their community.

We built **SAMAR-AGOS**, a smart water monitoring and response platform.

## The problem

When the water goes out in Catbalogan, reports arrive as scattered calls and social media posts. Providers end up reacting late, and residents are left guessing when service will come back. There's no shared picture of what's happening, where, and how bad it is.

## The idea

SAMAR-AGOS connects the two sides:

- **Residents know what to expect.** They report problems and get advisories, then confirm when service is actually restored.
- **Water providers know where to act.** Community reports become operational evidence, and forecasting helps them act before a shortage gets severe.

The platform has three roles: **residents**, the **provider**, and **field responders** who receive work orders.

## What it does

- Community reports and incident tracking
- Consumption trends and demand forecasting
- A reservoir view with early warning for shortages
- Work orders for field responders
- A map of barangays and service zones, with weather data
- A demo mode that plays out scenarios — a dry season, a pump failure, a pipeline leak — using simulated readings

## How it's built

The stack:

- **Plain JavaScript modules** for the front end, no framework
- **Firebase Authentication** (including Google sign-in) and **Cloud Firestore** for realtime data
- **Firebase Hosting** for deployment
- **Leaflet** with marker clustering for the barangay and service-zone map
- **Open-Meteo** for weather data

The demo mode lets anyone see how the platform behaves during a crisis without waiting for a real one.

## Try it

SAMAR-AGOS is live at [samar-agos-ic9sb.web.app](https://samar-agos-ic9sb.web.app/). You can read more in the [case study](/projects/samar-agos).
