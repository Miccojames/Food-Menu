# BiteBoard

BiteBoard is a modern full-stack food menu and ordering application. It allows users to browse delicious food items, filter by categories, search, manage a cart, add favorites, and place orders. It also features a simple admin dashboard for managing the food catalog.

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
* Security Middleware (helmet, cors, morgan, express-rate-limit)

## Project Structure

* `frontend/`: Contains the Vue 3 + Quasar client application.
* `backend/`: Contains the Express.js REST API and MongoDB models.

## Prerequisites

* Node.js (v18 or higher recommended)
* MongoDB (running locally at `mongodb://localhost:27017` or a MongoDB Atlas URI)

## Installation & Setup

### 1. Database Setup

Ensure you have a MongoDB instance running locally. If not, install MongoDB and start the `mongod` service.

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (you can copy `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/biteboard
CLIENT_URL=http://localhost:9000
NODE_ENV=development
```

### 3. Seed Database

To populate the MongoDB database with initial categories and food items:

```bash
cd backend
npm run seed
```

### 4. Start the Backend Server

```bash
cd backend
npm run dev
```
The server should start on `http://localhost:5000`.

### 5. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (you can copy `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the Frontend Application

```bash
cd frontend
npm run dev
```
The frontend should start on `http://localhost:9000` (or another port depending on availability).

## API Endpoints

### Health
* `GET /api/health` - Check if the API is running.

### Foods
* `GET /api/foods` - Get all foods (supports `?search=`, `?category=`, `?page=`, `?limit=`).
* `GET /api/foods/:id` - Get a single food by ID.
* `POST /api/foods` - Create a new food item.
* `PUT /api/foods/:id` - Update a food item.
* `DELETE /api/foods/:id` - Delete a food item.

### Categories
* `GET /api/categories` - Get all categories.
* `POST /api/categories` - Create a category.
* `PUT /api/categories/:id` - Update a category.
* `DELETE /api/categories/:id` - Delete a category.

### Orders
* `POST /api/orders` - Place a new order.
* `GET /api/orders` - Get all orders.
* `GET /api/orders/:id` - Get order details by ID.
* `PUT /api/orders/:id/status` - Update order status (Pending, Preparing, Ready, Completed, Cancelled).
* `DELETE /api/orders/:id` - Delete an order.

## Development Notes

* The frontend communicates with the backend via Axios, configured in `frontend/src/services/api.js`.
* State for Cart and Favorites is managed by Pinia and persisted using `localStorage`.
* The admin panel (`/admin`) provides CRUD functionality for the food catalog.

## License

ISC
