# 📡 HomeFeast REST API Documentation

This document outlines all public and authenticated endpoints available on the HomeFeast backend API (`http://localhost:5000/api`).

---

## 🔒 Authentication & Headers

Protected routes require the `Authorization` header containing a valid Bearer JWT:
```http
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Registers a new customer or provider account.
- **Request Body**:
  ```json
  {
    "name": "Pooja Verma",
    "email": "pooja@example.com",
    "password": "password123",
    "phone": "+91 98290 55555",
    "city": "jaipur",
    "area": "Vaishali Nagar",
    "address": "House 12, Officers Campus",
    "role": "CUSTOMER" // or "PROVIDER"
  }
  ```
- **Response `(201 Created)`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": "cust_101", "name": "Pooja Verma", "email": "pooja@example.com", "role": "CUSTOMER" }
  }
  ```

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT token.
- **Request Body**:
  ```json
  {
    "email": "customer@homefeast.test",
    "password": "password123"
  }
  ```

### `GET /api/auth/me`
Returns current authenticated user details and active provider/customer profile.

### `PUT /api/auth/profile`
Updates current user profile details (name, phone, city, area, address).

---

## 2. Provider Discovery & Management (`/api/providers`)

### `GET /api/providers`
Public discovery endpoint supporting multi-criteria search, filters, sorting, and pagination.
- **Query Parameters**:
  - `search`: Keyword for provider name, cuisine, locality, or dish name.
  - `city`: Target city (e.g. `jaipur`, `delhi`, `mumbai`).
  - `mealType`: `veg`, `non_veg`, `jain`.
  - `cuisine`: Regional cuisine (e.g. `Rajasthani`, `Punjabi`).
  - `mealPlan`: `DAILY`, `WEEKLY`, `MONTHLY`.
  - `minPrice`, `maxPrice`: Numerical filter for starting price.
  - `rating`: Minimum rating threshold (e.g. `4.0`, `4.8`).
  - `sortBy`: `rating`, `price_asc`, `price_desc`, `most_popular`, `newest`.
  - `page`: Page index (default: `1`).
  - `limit`: Items per page (default: `9`).

### `GET /api/providers/:id`
Returns a single provider profile with nested menu dishes, available subscription meal plans, verified customer reviews, and service area settings.

### `GET /api/providers/dashboard/stats`
*(Provider Role Required)* Returns provider KPIs (today's orders, active passes, pending requests, monthly earnings, rating) along with recent orders pipeline and reviews.

### `PUT /api/providers/:id/service-area`
*(Provider Role Required)* Updates provider delivery radius (km), served localities list, and lunch/dinner time slots.

---

## 3. Menu Dishes Management (`/api/menu`)

### `GET /api/menu`
Lists all dishes (supports filtering by `providerId` and `category`).

### `POST /api/menu`
*(Provider Role Required)* Creates a new dish.
- **Request Body**:
  ```json
  {
    "providerId": "prov_1",
    "name": "Desi Ghee Phulka Thali",
    "category": "Thali",
    "mealType": "veg",
    "price": 99,
    "description": "4 hot phulkas with dal and sabzi",
    "calories": 490,
    "protein": "16g"
  }
  ```

### `PUT /api/menu/:id`
*(Provider Role Required)* Updates an existing dish.

### `PATCH /api/menu/:id/toggle-stock`
*(Provider Role Required)* Toggles live stock availability (`in_stock` / `sold_out`).

### `DELETE /api/menu/:id`
*(Provider Role Required)* Deletes a dish.

---

## 4. Meal Plans (`/api/plans`)

### `GET /api/plans`
Lists subscription passes (supports `providerId` and `type` filters).

### `POST /api/plans`
*(Provider Role Required)* Creates a Daily, Weekly, or Monthly package.

### `PUT /api/plans/:id` & `DELETE /api/plans/:id`
*(Provider Role Required)* Updates or deletes a meal pass.

---

## 5. Orders Lifecycle (`/api/orders`)

### `POST /api/orders`
*(Customer Role Required)* Places a new order with server-side validation and coupon code discounting.
- **Accepted Coupons**: `FIRSTGHAR50` (₹50 off), `BATCH20` (20% off), `RAJASTHAN50` (₹50 off), `HEALTHY20` (20% off).

### `GET /api/orders`
Retrieves customer order history or provider incoming orders depending on active role.

### `PATCH /api/orders/:id/status`
*(Provider or Admin Role Required)* Advances order status (`PENDING` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` or `CANCELLED`).

### `POST /api/orders/:id/advance-status`
Simulates live status pipeline transitions.

---

## 6. Subscriptions & Pause Dates (`/api/subscriptions`)

### `POST /api/subscriptions`
*(Customer Role Required)* Purchases a Daily, Weekly, or Monthly tiffin pass.

### `GET /api/subscriptions/active`
Returns customer's currently active subscription pass.

### `POST /api/subscriptions/:id/pause-date`
*(Customer Role Required)* Toggles a specific delivery date (up to 5 dates per pass) to pause and preserve meal credits.

### `PATCH /api/subscriptions/:id/status`
*(Provider or Admin Role Required)* Updates subscription status (`ACTIVE`, `PAUSED`, `EXPIRED`, `CANCELLED`).

---

## 7. Reviews & Ratings (`/api/reviews`)

### `POST /api/reviews`
*(Customer Role Required)* Submits a 1–5 star review for a completed order with automatic provider rating re-aggregation.

### `POST /api/reviews/:id/reply`
*(Provider Role Required)* Home cook posts a reply note to a customer review.

---

## 8. Disputes & Complaints Desk (`/api/complaints`)

### `POST /api/complaints`
*(Customer Role Required)* Logs a support ticket with priority level (`LOW`, `MEDIUM`, `HIGH`).

### `GET /api/complaints`
Retrieves user tickets or all platform tickets for Admin.

### `PATCH /api/complaints/:id`
*(Admin Role Required)* Resolves a ticket and appends administrative resolution notes.

---

## 9. Admin Platform Governance (`/api/admin`)

### `GET /api/admin/dashboard`
Returns platform KPIs (GMV revenue, total users, home cooks, active passes, open disputes) and visual time-series chart data.

### `PUT /api/admin/providers/:id/approve`
Approves a pending home kitchen and awards the public Verified Badge.

### `PUT /api/admin/providers/:id/reject`
Rejects an applicant provider with an optional reason.

### `PUT /api/admin/providers/:id/suspend` & `PUT /api/admin/providers/:id/reactivate`
Suspends or reactivates a provider account.

### `PATCH /api/admin/users/:id/status`
Toggles user status (`ACTIVE` / `SUSPENDED`).

### `POST /api/admin/reset-database`
Resets the platform database to pristine sample seed data for testing.

---

## 10. System & Database Endpoints

### `GET /api/mongodb-status`
Returns real-time MongoDB Mongoose connection state, host, database name, and model document counts.

### `GET /api/health`
Returns platform health status, active database engine, city coverage, and key platform totals.

