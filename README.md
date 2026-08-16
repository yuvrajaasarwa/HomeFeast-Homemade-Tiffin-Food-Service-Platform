# 🍲 HomeFeast – Homemade Tiffin & Food Service Platform

HomeFeast is a production-ready, full-stack web application that connects students, working professionals, elderly people, and foodies with verified local home cooks, homemade food providers, and daily tiffin services.

---

## 🌟 Key Highlights & Features

### 1. Multi-City Provider Discovery & Faceted Search
- **Multi-City Support**: Filter and browse authentic home kitchens in **Jaipur, Ajmer, Delhi NCR, Mumbai, Pune, Bengaluru, and Ahmedabad**.
- **Dynamic Faceted Filters**:
  - **Meal Type**: Pure Veg, Satvik Jain, Non-Veg / Mixed.
  - **Starting Price**: Under ₹50, ₹50–₹100, ₹100–₹150, ₹150+.
  - **Meal Plans**: Daily Meals, 7-Day Passes, 30-Day Passes.
  - **Regional Cuisines**: Rajasthani, North Indian, Punjabi, Jain Sattvic, Gujarati, South Indian, Maharashtrian, Bengali, Healthy & Fit.
  - **Sorting**: Top Rated, Starting Price (Asc/Desc), Most Popular, Newest.

### 2. Rich Home Cook Profiles & Interactive Menus
- **FSSAI Verification & Hygiene Audits**: Verified badges, hygiene audit scores, FSSAI registration numbers, and kitchen safety indicators.
- **Categorized Daily Menus**: Thalis, Curries, Breads & Rotis, Rice & Bowls, Healthy Combos with caloric & protein nutritional breakdowns.
- **Dabba Cart System**: Multi-item ordering with quantity management, provider isolation protection, packaging selection, delivery slot configuration, and live coupon codes (`FIRSTGHAR50`, `BATCH20`, `RAJASTHAN50`, `HEALTHY20`).

### 3. Flexible Subscription Meal Passes
- **Zero-Penalty Pause Guarantee**: Interactive 7-day calendar tool allowing subscribers to pause upcoming deliveries in 1 tap while automatically preserving meal credits.
- **Pass Tiers**: Daily (1 Meal), Weekly (7 Days / 7 Meals), and Monthly (30 Days / 30 Meals) with up to 25% savings.

### 4. Live Insulated Dabba Tracker
- Real-time stepper pipeline tracking:
  `Order Confirmed` ➔ `Fresh Homestyle Cooking` ➔ `Packed in Steel Dabba` ➔ `Rider Out for Delivery` ➔ `Delivered at Doorstep`.
- Delivery partner contact card with direct calling and vehicle details.

### 5. Role-Based Access Control (RBAC)
- **Customer Role**: Discovery, order placement, subscription passes, pause dates, 5-star verified reviews, dispute raising, in-app notifications.
- **Provider Role (Home Cook)**:
  - KPI overview (Today's orders, recurring subscribers, monthly earnings, average rating).
  - Live orders pipeline with 1-click status transitions (`ACCEPTED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).
  - Subscriptions queue with accept/reject capability.
  - Menu CRUD (Add dishes, edit prices, toggle real-time stock availability).
  - Meal Plans CRUD (Create daily, weekly, monthly passes).
  - Service area radius and lunch/dinner delivery time windows.
  - Customer review responses.
  - Initial `PENDING_APPROVAL` onboarding lifecycle.
- **Admin Role (Platform Governance)**:
  - Executive KPI dashboard (Total users, cooks, GMV revenue, active passes, open tickets).
  - Interactive visual revenue & city onboarding charts.
  - Provider verification desk (Approve, Award Verified Badge, Reject, Suspend, Reactivate).
  - User governance (Activate/Suspend accounts).
  - Dispute resolution desk with notes.
  - 1-click database sample seed reset tool.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@homefeast.test` | `password123` | Order food, manage passes, pause dates, track dabbas, write reviews |
| **Provider** | `provider@homefeast.test` | `password123` | Manage dishes, meal plans, live orders, accept subscriptions, replies |
| **Admin** | `admin@homefeast.test` | `password123` | Verify home cooks, platform analytics, dispute resolution, user governance |

> ⚡ **Tip**: The in-app Auth modal includes **1-Click Quick Demo Login buttons** for instant switching between roles!

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, Mongoose ODM (`mongoose`), JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS.
- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, Modern CSS Design System.
- **Database Engine**: MongoDB (Mongoose ODM) with complete Schemas (`User`, `Provider`, `MenuItem`, `MealPlan`, `Order`, `Subscription`, `Review`, `Complaint`, `Notification`, `Coupon`) and graceful fallback.
- **Testing**: Automated HTTP integration test suite (`backend/tests/api.test.js` and `backend/tests/e2e.test.js`).

---

## 🍃 MongoDB Configuration & Connection

The project is pre-configured with **Mongoose** and supports both **Local MongoDB** and **MongoDB Atlas Cloud**.

### Option A: Local MongoDB (Default)
1. Ensure your local MongoDB service is running (port `27017`).
2. The default connection URI in `.env` is:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/homefeast
   ```

### Option B: MongoDB Atlas Cloud (Free Cluster)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Copy your connection string and add it to `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/homefeast?retryWrites=true&w=majority
   ```

### Seed MongoDB Database
To populate or reset all MongoDB collections with rich sample data:
```bash
# From project root:
npm run seed:mongo

# Or from backend folder:
cd backend
npm run seed:mongo
```

### Check Live MongoDB Connection Status
You can verify the database connection status at:
- `http://localhost:5000/api/mongodb-status`
- `http://localhost:5000/api/health`

---

## 🚀 Getting Started Locally

### 1. Start the Backend Server
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 3. Run the Automated API Test Suite
```bash
cd backend
npm test
```
*Executes all 21 end-to-end assertions.*

---

## 📄 License & Attribution
Built with pride for homemade food enthusiasts and local home cooks across India.
