# 🏠 RentNest — Property Rental Platform API

A robust RESTful backend API for a property rental management platform built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. RentNest enables landlords to list properties, tenants to submit rental requests, and fully integrates **SSLCommerz** as a payment gateway.

---

## 📦 Tech Stack

| Layer        | Technology                                |
|:-------------|:------------------------------------------|
| Runtime      | Node.js                                   |
| Language     | TypeScript                                |
| Framework    | Express.js v5                             |
| ORM          | Prisma v7 (multi-file schema)             |
| Database     | PostgreSQL (via `@prisma/adapter-pg`)     |
| Auth         | JWT (access + refresh tokens)             |
| Payments     | SSLCommerz (Sandbox)                      |
| Hashing      | bcrypt                                    |

---

## 🗂️ Project Structure

```
RentNest-/
├── prisma/
│   ├── schema/             # Multi-file Prisma schema
│   │   ├── schema.prisma   # Generator + datasource config
│   │   ├── user.prisma
│   │   ├── properties.prisma
│   │   ├── rentalRequest.prisma
│   │   ├── payments.prisma
│   │   ├── reviews.prisma
│   │   ├── profile.prisma
│   │   └── enum.prisma
│   └── migrations/
├── generated/
│   └── prisma/             # Auto-generated Prisma client
├── src/
│   ├── app.ts              # Express app setup & route registration
│   ├── server.ts           # HTTP server entry point
│   ├── config/
│   │   └── index.ts        # Environment config
│   ├── lib/
│   │   └── prisma.ts       # Prisma client instance
│   ├── middlewares/
│   │   └── auth.ts         # JWT auth middleware
│   ├── utils/
│   │   ├── catchAsync.ts   # Async error wrapper
│   │   └── sendResponse.ts # Standardized response formatter
│   └── modules/
│       ├── auth/           # Login / token refresh
│       ├── user/           # Registration, profile, admin controls
│       ├── property/       # Property CRUD + rental request management
│       ├── Rental/         # Tenant rental requests
│       ├── Payments/       # SSLCommerz payment session & callbacks
│       └── review/         # Property reviews
├── .env                    # Local environment variables
├── .env.example            # Template for environment setup
├── prisma.config.ts        # Prisma configuration
├── tsconfig.json
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL database (local or hosted, e.g., Neon, Supabase)
- SSLCommerz sandbox credentials

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/RentNest-.git
cd RentNest-

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Then open .env and fill in all required values (see below)

# 4. Generate Prisma client
npx prisma generate

# 5. Run migrations
npx prisma migrate deploy

# 6. Start the development server
npm run dev
```

The API will be available at **`http://localhost:5000`**.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# Server
PORT=5000
APP_URL=http://localhost:5000

# Security
BCRYPT_SALT_ROUNDS=10

# JWT Tokens
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRES=1d
JWT_REFRESH_SECRET_KEY=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES=7d

# SSLCommerz Payment Gateway
SSLCOMMERZ_STORE_ID=your_sslcommerz_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sslcommerz_store_password
```

---

## 🗄️ Database Schema Overview

### Models

| Model           | Description                                             |
|:----------------|:--------------------------------------------------------|
| `User`          | System users (TENANT, LANDLORD, ADMIN roles)            |
| `Profile`       | Extended user profile data                              |
| `Property`      | Rental property listings                                |
| `RentalRequest` | Tenant requests to rent a property                      |
| `Payment`       | Payment records linked to approved rental requests      |
| `Review`        | Property reviews after completed and paid rentals       |

### Enums

| Enum                  | Values                                               |
|:----------------------|:-----------------------------------------------------|
| `Role`                | `TENANT`, `LANDLORD`, `ADMIN`                        |
| `Status`              | `ACTIVE`, `BANNED`                                   |
| `PropertyStatus`      | `AVAILABLE`, `UNAVAILABLE`                           |
| `PropertyCategory`    | `APARTMENT`, `HOUSE`, `VILLA`, `DUPLEX`, `STUDIO`, `OFFICE`, `COMMERCIAL`, `SHOP` |
| `RentalRequestStatus` | `PENDING`, `APPROVED`, `REJECTED`                    |
| `PaymentStatus`       | `PENDING`, `PAID`, `FAILED`, `CANCELLED`             |

---

## 📡 API Endpoints

### 🔑 Authentication — `/api/auth`

| Method | Endpoint          | Description              | Auth Required |
|:-------|:------------------|:-------------------------|:--------------|
| `POST` | `/api/auth/register` | Register a new user    | None          |
| `POST` | `/api/auth/login`    | Login and get JWT tokens | None        |

---

### 👤 Users — `/api/auth` / `/api/admin`

| Method   | Endpoint              | Description                     | Auth Required          |
|:---------|:----------------------|:--------------------------------|:-----------------------|
| `GET`    | `/api/auth/me`        | Get current user profile        | TENANT, LANDLORD, ADMIN |
| `GET`    | `/api/admin/users`    | Get all users                   | ADMIN only             |
| `PUT`    | `/api/admin/users/:id`| Update user status (ban/unban)  | ADMIN only             |
| `DELETE` | `/api/admin/users/:id`| Delete a user account           | ADMIN only             |

---

### 🏘️ Properties — `/api/properties`

| Method   | Endpoint                      | Description                             | Auth Required           |
|:---------|:------------------------------|:----------------------------------------|:------------------------|
| `POST`   | `/api/properties`             | Create a new property listing           | LANDLORD                |
| `GET`    | `/api/properties`             | Get all available properties (public)   | None                    |
| `GET`    | `/api/properties/:id`         | Get a single property's details         | None                    |
| `GET`    | `/api/categories`             | Get all property categories             | None                    |
| `GET`    | `/api/admin/properties`       | Get all properties (admin view)         | ADMIN only              |
| `PUT`    | `/api/properties/:id`         | Update a property                       | LANDLORD, ADMIN         |
| `DELETE` | `/api/properties/:id`         | Delete a property                       | LANDLORD, ADMIN         |
| `PUT`    | `/api/requests/:id`           | Approve or reject a rental request      | LANDLORD, ADMIN         |
| `GET`    | `/api/landlord/requests`      | Get all rental requests for landlord    | LANDLORD                |

---

### 📋 Rental Requests — `/api/rentals`

| Method | Endpoint              | Description                              | Auth Required              |
|:-------|:----------------------|:-----------------------------------------|:---------------------------|
| `POST` | `/api/rentals`        | Submit a new rental request for a property | TENANT                   |
| `GET`  | `/api/rentals`        | Get current tenant's rental requests     | TENANT                     |
| `GET`  | `/api/rentals/:id`    | Get a specific rental request's details  | TENANT, LANDLORD, ADMIN    |
| `GET`  | `/api/admin/rentals`  | Get all rental requests                  | ADMIN only                 |

---

### 💳 Payments — `/api/payments`

| Method | Endpoint                | Description                                                                            | Auth Required              |
|:-------|:------------------------|:---------------------------------------------------------------------------------------|:---------------------------|
| `POST` | `/api/payments/create`  | Create a payment session for an **approved** rental via SSLCommerz                    | TENANT                     |
| `POST` | `/api/payments/confirm` | SSLCommerz callback webhook — confirms/fails/cancels payment and updates DB            | Public (Webhook)           |
| `GET`  | `/api/payments`         | Get user's payment history (scoped by role)                                            | TENANT, LANDLORD, ADMIN    |
| `GET`  | `/api/payments/:id`     | Get detailed payment record                                                            | TENANT, LANDLORD, ADMIN    |

#### Payment Flow

```
Tenant ──► POST /api/payments/create
                │
                ▼
         SSLCommerz Gateway (sandbox)
                │
        (User completes payment)
                │
                ▼
        POST /api/payments/confirm  ◄── SSLCommerz callback
                │
                ▼
         Payment status updated in DB
         (PAID / FAILED / CANCELLED)
```

---

### ⭐ Reviews — `/api/reviews`

| Method | Endpoint        | Description                                          | Auth Required |
|:-------|:----------------|:-----------------------------------------------------|:--------------|
| `POST` | `/api/reviews`  | Create a review for a property (must have PAID rental) | TENANT      |

> **Note:** A tenant can only review a property after their rental request is `APPROVED` **and** payment status is `PAID`.

---

## 🔒 Authentication

All protected routes use **JWT Bearer tokens** passed in the `Authorization` header or via an HTTP-only cookie.

```http
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle

- **Access Token**: Short-lived (`1d`), used for API requests.
- **Refresh Token**: Long-lived (`7d`), stored in an HTTP-only cookie.

### User Roles

| Role       | Capabilities                                                                     |
|:-----------|:---------------------------------------------------------------------------------|
| `ADMIN`    | Full system access — manage users, properties, and view all data                 |
| `LANDLORD` | Create/manage own properties, approve/reject rental requests                     |
| `TENANT`   | Browse properties, submit rental requests, pay, and leave reviews                |

---

## 💳 SSLCommerz Payment Integration

RentNest integrates with the **SSLCommerz sandbox** for payment processing.

### How it works

1. **Landlord approves** a tenant's rental request → A `PENDING` payment record is automatically created in the database.
2. **Tenant calls** `POST /api/payments/create` with the `rentalRequestId`.
3. The backend creates an SSLCommerz session and returns a `gatewayUrl`.
4. **Tenant is redirected** to the SSLCommerz gateway page.
5. After payment, SSLCommerz **POSTs to** `/api/payments/confirm`.
6. The backend verifies the `tran_id` and updates the payment status accordingly.

---

## 📤 Standard API Response Format

All responses follow this consistent structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { }
}
```

---

## 🛠️ Available Scripts

| Script          | Command            | Description                        |
|:----------------|:-------------------|:-----------------------------------|
| Development     | `npm run dev`      | Start with hot-reloading via tsx   |
| Build           | `npm run build`    | Compile TypeScript to JavaScript   |
| Production      | `npm start`        | Run compiled `dist/server.js`      |
| Prisma Generate | `npx prisma generate` | Regenerate Prisma Client        |
| Migrations      | `npx prisma migrate dev` | Run DB migrations (dev)     |

---

## 📝 License

ISC
