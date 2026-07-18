# CRM Application

A modern MERN stack CRM application for managing customer contacts, with role-based authentication (User/Admin), protected routes, an admin activity-log audit trail, and a clean dashboard experience.


## Overview

This project demonstrates a production-style full-stack architecture with:
- a React + TypeScript frontend for the user experience
- an Express backend for business logic and API routes
- MongoDB as the database layer
- JWT-based authentication with role-based access control (RBAC)
- an audit logging system for tracking contact changes

The application is structured to be easy to explain in an interview and simple to extend with future features such as CSV export and analytics.

## Core Features

- User signup and login, with an optional Admin role gated behind a server-side secret key
- Password hashing with bcrypt
- JWT authentication (access + refresh tokens) and protected routes
- Role-based access control: standard Users vs. Admins
- Contacts CRUD operations, scoped per user (Admins can view/manage all contacts)
- Search and pagination for contacts
- Admin-only activity log audit trail (every contact add/edit/delete is recorded)
- Admin dashboard stats endpoint (user counts by role)
- Responsive dashboard and contact management UI
- Clean modular structure for maintainability

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS v4
- React Hook Form
- React Toastify
- jwt-decode (client-side token/role checks)
- lucide-react (icons)

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- cookie-parser
- cors
- helmet
- morgan

### DevOps
- Docker (multi-stage builds for both frontend and backend)
- Docker Compose (local orchestration: frontend + backend + MongoDB)
- Nginx (serves the built frontend static files in its container)

## Architecture

### Frontend Flow
1. The user opens the app in the browser.
2. React Router handles navigation between login, signup, contacts, and (Admin-only) activity logs pages.
3. The frontend uses Axios to call the backend API, attaching the JWT via a request interceptor.
4. Protected pages require a valid, non-expired JWT stored in local storage; `ProtectedRoute` also enforces role checks for Admin-only pages by decoding the token client-side.
5. A response interceptor catches 401s globally, clears the stored token, and redirects to login.
6. The UI displays loading states, errors, and toast notifications for better user experience.

### Backend Flow
1. Express receives incoming API requests.
2. Routes direct requests to the correct controller.
3. `authMiddleware` verifies the JWT and attaches the user (including role) to the request; `authorize(...roles)` then gates role-restricted routes (e.g. Admin-only).
4. Controllers interact with Mongoose models to read or write data.
5. Contact create/update/delete actions write an entry to the `Log` collection via a shared audit logger, capturing who did what.
6. Responses follow a consistent JSON format with success, message, and data/errors fields.

### Database Design
- **Users** collection stores authentication data and a `role` field (`User` or `Admin`, default `User`).
- **Contacts** collection stores contact information for each authenticated user, linked via a `user` reference field. Admins can view/manage contacts across all users.
- **Logs** collection stores an audit trail (`userEmail`, `action`, `details`, timestamp) for every contact add/edit/delete, viewable by Admins only.

## Project Structure

### Frontend
- `frontend/src/pages` — page-level screens: `LoginPage`, `SignupPage`, `ContactsPage`, `LogsPage` (Admin only)
- `frontend/src/components` — reusable UI: `Layout`, `ContactModal`, `DeleteModal`, `ProtectedRoute`, `ToastProvider`
- `frontend/src/services/api.ts` — Axios instance with auth-header and 401-handling interceptors
- `frontend/src/App.tsx` — route configuration

### Backend
- `backend/src/app.js` — Express app setup
- `backend/src/server.js` — server startup logic
- `backend/src/config/database.js` — MongoDB connection setup
- `backend/src/controllers` — `authController`, `userController`, `contactController`, `adminController`
- `backend/src/middleware/auth.js` — JWT verification (`authMiddleware`) and role gating (`authorize`)
- `backend/src/models` — `User`, `Contact`, `Log` schema definitions
- `backend/src/routes` — `authRoutes`, `userRoutes`, `contactRoutes`, `adminRoutes`
- `backend/src/utils/logger.js` — shared audit-log writer used by the contacts controller

## Setup Instructions

Prerequisites: Node.js 18+ and npm, plus a MongoDB connection string (local MongoDB or a free MongoDB Atlas cluster).

### 1. Clone the repo

```bash
git clone https://github.com/mustafagaut/crm-app.git
cd crm-app
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create the `.env` file:

macOS / Linux / Git Bash:
```bash
cp .env.example .env
```
Windows PowerShell:
```powershell
copy .env.example .env
```

Open `backend/.env` and fill in real values:
```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<any long random string>
JWT_REFRESH_SECRET=<any different long random string>
ADMIN_SECRET_KEY=<any secret string, used to create an Admin account>
```

Start the backend:
```bash
npm start
```
Expect: `Server running on port 5000`. Verify at `http://localhost:5000/health` — should return `{"success":true,"message":"CRM API is running"}`.

### 3. Frontend setup

Open a **new terminal** (keep the backend running in the first one):

```bash
cd crm-app/frontend
npm install
```

Create the `.env` file:

macOS / Linux / Git Bash:
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```
Windows PowerShell:
```powershell
"VITE_API_URL=http://localhost:5000/api" | Out-File -Encoding utf8 .env
```

Start the frontend:
```bash
npm run dev
```
Vite will print a local URL, typically `http://localhost:5173` — open it in a browser to use the app.

The API base URL is read from `VITE_API_URL` in `frontend/src/services/api.ts` (falling back to `http://localhost:5000/api` if unset), so the frontend automatically targets whichever backend URL is configured in its `.env`.

### Alternative: run everything with Docker

Instead of steps 2 and 3 above, the whole stack (frontend, backend, and a local MongoDB) can be started with a single command using Docker Compose. No local Node.js install, no manual `.env` setup for the database.

Prerequisite: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
docker compose up --build
```

This builds and starts three containers:
- `crm-mongo` — MongoDB 7, on port `27017`
- `crm-backend` — the Express API, on port `5000`
- `crm-frontend` — the built React app served via Nginx, on port `5173`

Once it's up:
- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/health`

Notes:
- The bundled Mongo container starts empty — it's a separate local database, not your Atlas cluster, so you'll need to sign up a fresh user the first time.
- Backend secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `ADMIN_SECRET_KEY`) are still read from `backend/.env` (`docker-compose.yml` uses `env_file` for these) — `PORT`, `MONGO_URI`, and `CLIENT_URL` are overridden automatically to the correct Docker-network values regardless of what's in `.env`.
- To stop everything: `Ctrl+C`, then `docker compose down` (add `-v` to also delete the Mongo data volume and start fresh next time).
- To rebuild after a code change: `docker compose up --build` again.

## Environment Variables

### Backend
- `PORT`
- `CLIENT_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `ADMIN_SECRET_KEY` — required passkey a signup request must supply to be granted the `Admin` role

### Frontend
- `VITE_API_URL`

## API Overview

### Authentication
- `POST /api/auth/signup` — supports an optional `role: "Admin"` + `adminSecretKey` to self-register as Admin
- `POST /api/auth/login`

### Users
- `GET /api/users/profile` — returns the authenticated user's profile

### Contacts
- `GET /api/contacts` — supports `page`, `limit`, `search` query params
- `POST /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`

### Admin (Admin role required)
- `GET /api/admin/logs` — most recent 100 audit log entries
- `GET /api/admin/dashboard-stats` — total users, admin count, standard user count

## Live Deployment

- **Frontend:** https://crm-app-flax-nine.vercel.app
- **Backend:** https://crm-app-kbnu.onrender.com
- **Backend health check:** https://crm-app-kbnu.onrender.com/health

## Deployment Notes

- Frontend is deployed on Vercel.
- Backend is deployed on Render.
- MongoDB is hosted on MongoDB Atlas.
- `CLIENT_URL` (Render) and `VITE_API_URL` (Vercel) must be set to each other's deployed URLs for CORS and API calls to work. Vite bakes `VITE_API_URL` in at build time, so changing it on Vercel requires a redeploy, not just a saved setting.
- Render's free tier spins down after inactivity; the first request after idle time can take 30-50 seconds to respond.

## Creating an Admin User

The signup UI only collects name, email, and password — there is no role selector in the frontend. To create an Admin account, call the signup endpoint directly (e.g. with Postman or curl) and include the extra fields the UI doesn't expose:

```
POST /api/auth/signup
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "yourpassword",
  "role": "Admin",
  "adminSecretKey": "<value of ADMIN_SECRET_KEY on the backend>"
}
```

If `adminSecretKey` is missing or doesn't match the server's `ADMIN_SECRET_KEY`, the request is rejected with a 403 and no Admin account is created. Regular signups through the UI always default to the `User` role.

### Demo Admin account (for review)

- **Email:** `admin@test.com`
- **Password:** `password@123`

