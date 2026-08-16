# 🏗️ HomeFeast – Technical Architecture Document

## 1. System Architecture Overview

HomeFeast employs a modern client-server decoupled architecture designed for high responsiveness, resilience, and clean separation of concerns.

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 18 + Vite)               │
│  - Multi-City Provider Discovery & Faceted Filters     │
│  - Provider Kitchen Profile, Menus & Meal Passes      │
│  - Dabba Cart with Isolation & Live Coupon Engine      │
│  - Live Status Stepper Modal Tracker                   │
│  - Customer Dashboard with 7-Day Date Pause Tool       │
│  - Provider Management Portal (Menu/Plan CRUD, Orders) │
│  - Admin Operations Hub (KPIs, Verification, Disputes) │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST / Bearer JWT
┌──────────────────────────▼─────────────────────────────┐
│             Backend API Layer (Express.js)             │
│  - RBAC Middleware (CUSTOMER, PROVIDER, ADMIN)         │
│  - Pricing, Coupons & Server-side Tax Engine           │
│  - Live Order Pipeline & Delivery Simulator            │
│  - Automated Rating & Hygiene Recalculation Engine     │
└──────────────────────────┬─────────────────────────────┘
                           │ Atomic Read/Write
┌──────────────────────────▼─────────────────────────────┐
│          Persistent Storage (DatabaseStore)            │
│  - In-Memory Cache with Persistent Disk File Storage   │
│  - Auto-Seeding Fallback with 13 Users & 11 Providers  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Role-Based Access Control (RBAC) Matrix

| Endpoint Area | CUSTOMER | PROVIDER | ADMIN | GUEST / PUBLIC |
| :--- | :---: | :---: | :---: | :---: |
| **Browse / Search Cooks & Menus** | ✅ | ✅ | ✅ | ✅ |
| **Place Orders & Apply Coupons** | ✅ | ❌ | ❌ | ❌ (Prompts Login) |
| **Purchase Meal Subscription Passes** | ✅ | ❌ | ❌ | ❌ (Prompts Login) |
| **Pause Specific Delivery Dates** | ✅ | ❌ | ❌ | ❌ |
| **Live Track Dabba Status** | ✅ | ✅ | ✅ | ❌ |
| **Submit Meal Reviews (1-5★)** | ✅ | ❌ | ❌ | ❌ |
| **Raise Dispute Ticket** | ✅ | ❌ | ❌ | ❌ |
| **Manage Menu Dishes (CRUD)** | ❌ | ✅ (Own kitchen) | ✅ | ❌ |
| **Manage Meal Plans (CRUD)** | ❌ | ✅ (Own kitchen) | ✅ | ❌ |
| **Accept/Reject Incoming Orders** | ❌ | ✅ (Own kitchen) | ✅ | ❌ |
| **Advance Order Pipeline Status** | ❌ | ✅ (Own kitchen) | ✅ | ❌ |
| **Respond to Customer Reviews** | ❌ | ✅ (Own kitchen) | ✅ | ❌ |
| **Approve / Reject / Suspend Cooks** | ❌ | ❌ | ✅ | ❌ |
| **Resolve Disputes & Enter Notes** | ❌ | ❌ | ✅ | ❌ |
| **Access Platform Financial Analytics** | ❌ | ❌ | ✅ | ❌ |

---

## 3. Data Entity Relationships

```
┌───────────────┐        1:1       ┌──────────────────┐
│     User      ├─────────────────►│ Provider Profile │
│  (Auth, Role) │                  │ (FSSAI, Hygiene) │
└───────┬───────┘                  └────────┬─────────┘
        │ 1:N                               │ 1:N
        │                                   ├─────────────────► Menu Dishes (CRUD)
        │                                   ├─────────────────► Meal Plans (Daily/Weekly/Monthly)
        │                                   └─────────────────► Service Area & Timings
        │
        ├─────────────────► Orders (Items, Status, Courier)
        ├─────────────────► Subscriptions (Active Pass, Paused Dates)
        ├─────────────────► Reviews (Rating 1-5, Comments, Cook Reply)
        ├─────────────────► Complaints / Disputes (Priority, Resolution Notes)
        └─────────────────► In-App Notifications
```

---

## 4. Key Status Lifecycle State Machines

### 1. Home Cook Verification Lifecycle
```
[Registration] ──► PENDING_APPROVAL ──► APPROVED (Publicly Discoverable + Verified Badge)
                           │
                           ├──► REJECTED (With Reason)
                           │
                           └──► SUSPENDED ──► (Reactivated) ──► APPROVED
```

### 2. Live Order Delivery Pipeline
```
[Placed] ──► PENDING ──► ACCEPTED ──► PREPARING ──► OUT_FOR_DELIVERY ──► DELIVERED
               │
               └──► REJECTED / CANCELLED
```

### 3. Subscription Pass Lifecycle
```
[Purchased] ──► ACTIVE (Consuming Meals) ──► [Pause Date Toggled] ──► PAUSED (No delivery, credits saved)
                   │                                                     │
                   │                                                     └──► RESUMED ──► ACTIVE
                   │
                   └──► EXPIRED (All meals consumed or 30 days completed)
```

### 4. Dispute Resolution Lifecycle
```
[Logged by User] ──► OPEN ──► IN_REVIEW ──► RESOLVED (With Admin Action Notes) ──► CLOSED
```
