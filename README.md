# BiteBoard

BiteBoard is a modern full-stack food menu and ordering application. It allows users to browse food items, filter by categories, search, manage a cart, place orders, and track their own order history. It also features an admin dashboard for managing the food catalog, categories, orders, and viewing sales stats.

## Tech Stack

**Frontend:**
* Vue 3
* Quasar Framework (via Vite plugin)
* Vite
* Pinia (State Management)
* Vue Router
* Axios

**Backend:**
* Node.js
* Express.js
* PostgreSQL (Neon) with Prisma ORM
* JWT authentication (`jsonwebtoken`) + `bcryptjs` password hashing
* `zod` input validation
* `multer` image uploads
* Security Middleware (helmet, cors, morgan, express-rate-limit)

## Project Structure

* `frontend/`: Contains the Vue 3 + Quasar client application.
* `backend/`: Contains the Express.js REST API, Prisma schema, and seed script.

## Prerequisites

* Node.js (v20 or higher recommended)
* A PostgreSQL database (local or hosted, e.g. Neon)

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (copy `.env.example`):

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/biteboard
CLIENT_URL=http://localhost:9000
NODE_ENV=development

JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d

# Admin account created by the seed script
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
```

Apply the Prisma schema and seed data (categories, foods, admin user — **orders are never touched by seed**):

```bash
cd backend
npx prisma db push
npm run seed
```

> ⚠️ Change `ADMIN_PASSWORD` before seeding. The seed hashes it with bcrypt.

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

The server starts on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (copy `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Frontend Application

```bash
cd frontend
npm run dev
```

The frontend starts on `http://localhost:9000`.

### 5. Log in as admin

Go to `http://localhost:9000/#/login` and sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
Customers can self-register (minimum 8-character password) and are assigned the `customer` role.

## API Endpoints

All responses use the shape `{ success, message?, data?, pagination? }`.

### Auth (public, rate-limited)
* `POST /api/auth/register` — create a customer account (`{ username, password }` ≥ 8 chars). Returns `{ ...user, token }`.
* `POST /api/auth/login` — returns `{ id, username, role, token }`.

### Health
* `GET /api/health` — check if the API is running.

### Foods
* `GET /api/foods` — public. Supports `?search=`, `?category=`, `?page=`, `?limit=` (max 100). Unavailable items are hidden.
  * `?all=true` — includes unavailable items (**admin token required** to take effect).
* `GET /api/foods/:id` — public.
* `POST /api/foods` — admin.
* `PUT /api/foods/:id` — admin.
* `DELETE /api/foods/:id` — admin. Returns `409` if the item has order history (set `available: false` instead).

### Categories
* `GET /api/categories` — public (includes `_count.foods`).
* `POST /api/categories` — admin.
* `PUT /api/categories/:id` — admin.
* `DELETE /api/categories/:id` — admin. Returns `409` while foods still reference it.

### Orders
* `POST /api/orders` — public (guests) or authenticated (links `userId`).
  * Body: `{ items: [{ foodId, quantity }], customerName, customerContact }`
  * Prices are always re-read from the database; quantities must be positive integers (max 100 each).
* `GET /api/orders` — **admin**. `?page=`, `?limit=` (max 100), `?status=Pending|Preparing|Ready|Completed|Cancelled`.
* `GET /api/orders/mine` — the logged-in user's orders.
* `GET /api/orders/stats` — **admin**. Revenue, counts by status, top-selling items, orders/day (last 30 days).
* `GET /api/orders/:id` — owner or admin. Includes `statusHistory`.
* `PUT /api/orders/:id/status` — **admin**. Records history; cancelled orders are **kept**, not deleted.
* `DELETE /api/orders/:id` — admin.

### Uploads
* `POST /api/upload/image` — **admin**, `multipart/form-data` with field `image` (jpg/png/webp/gif/avif, max 5 MB). Returns `{ url: "/uploads/..." }`; files are served from `/uploads`.

### Authentication

Send the JWT on protected routes:

```
Authorization: Bearer <token>
```

## Development Notes

* The frontend attaches the token via an axios request interceptor (`frontend/src/services/api.js`); a `401` response clears the session and redirects to login.
* Cart and favorites are stored in `localStorage` (Pinia persisted state).
* Route guards live in `frontend/src/router/index.js`; **server-side enforcement is the source of truth** — every mutating route requires `protect`/`requireAdmin`.
* Prices use Prisma `Decimal(10,2)` and are serialized to numbers in API responses.
* Uploaded images live in `backend/uploads/` (git-ignored, `.gitkeep` keeps the folder).

## Scripts

```bash
# root
npm run dev            # backend only
npm run dev:frontend   # frontend only
npm test               # backend integration tests (vitest + supertest)
npm run lint           # lint backend + frontend (oxlint)
npm run build          # build frontend

# backend
npm run seed           # upsert categories/foods + admin (never deletes orders)
npm run prisma:push    # sync schema with the database
```

## License

ISC
