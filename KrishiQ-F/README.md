# KrishiQ (????-Q)

> **Intelligent Agricultural Procurement Coordination Platform**  
> Reducing farmer waiting times and eliminating Mandi congestion through dynamic journey optimization and real-time operational coordination.

---

## ?? About KrishiQ

**KrishiQ** is not merely a slot-booking or farmer registration tool. It is an **intelligent coordination and decision-support layer** built for government procurement centres (APMC Mandis) in India.

### Core Value Propositions:
1. **Total Journey Optimization**: Unlike naive tools that only recommend the geographically closest centre, KrishiQ recommends the Mandi that minimizes the farmer's *total procurement journey time* (Travel Time + Live Queue Wait + Weighbridge Unloading).
2. **Sequential Live Queue Visualizer**: Gives farmers total transparency on their exact token position, time remaining, and arrival expectations.
3. **8-Stage Procurement Tracking**: Complete digital provenance from slot booking and gate arrival to Fair Average Quality (FAQ) assay grading, electronic gross/tare weighment, and direct benefit transfer (DBT) MSP payout.
4. **Centre Operator Workstation**: Live bottleneck detection, dynamic operator load rebalancing, and high-tempo queue management.
5. **Government Administrator Command Centre**: Proactive 4-hour congestion forecasting, regional network telemetry map, and one-click directive dispatching.
6. **What-If Policy Simulator**: Interactive sandbox modeling demand spikes, auxiliary counter deployments, and operating hour extensions.

---

## ?? Persona Experiences

### ?? 1. Farmer Experience (`/farmer`)
* **Dashboard (`/farmer/dashboard`)**: Clear answer to *"Where and when should I go to sell my produce?"* with live token status, recommended centre rationale, and approaching notifications.
* **Find Centre (`/farmer/centres`)**: 2-column layout with an interactive regional map, travel radius rings, and total journey time comparison bars.
* **Live Queue (`/farmer/queue`)**: Sequential token stream (`? Completed`, `? Serving`, `? Waiting`, `? You`), 30-minute velocity mini-chart, ETA confidence meter, and demo simulation triggers.
* **Procurement Stages (`/farmer/procurement`)**: 8-stage progress tracker with digital moisture assay slips and weighment records.
* **Payment Ledger (`/farmer/payment`)**: Direct Benefit Transfer (DBT) records linked with Aadhaar and PFMS reference IDs.

### ?? 2. Centre Operator Experience (`/centre`)
* **Operations Dashboard (`/centre/dashboard`)**: Top KPI counters, currently serving hero card, next farmer station, and live queue table.
* **Bottleneck Alerting**: Active bottleneck detection with 1-click operator rebalancing to resolve weighbridge choke points.
* **Quality & Grading Modal**: Electronic Fair Average Quality (FAQ) testing and dockage verification.

### ??? 3. Government Administrator Command Centre (`/admin`)
* **Network Overview (`/admin/dashboard`)**: State procurement command center with critical congestion alerts, regional map nodes, and actionable system recommendations (*Prediction ? Problem ? Action ? Impact*).
* **What-If Simulator (`/admin/simulator`)**: Interactive policy simulator testing sudden demand spikes with real-time before/after impact calculations and hourly clearance curves.

---

## ??? Tech Stack

* **Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS v4
* **Icons**: Lucide React
* **Charts & Data Visualizations**: Recharts
* **Routing**: React Router DOM

---

## ?? Running Locally

```bash
# Clone the repository
git clone https://github.com/cheenumalu/KrishiQ.git
cd KrishiQ/KrishiQ-F

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```
