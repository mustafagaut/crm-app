CRM Application

A modern MERN stack CRM application for managing customer contacts, with role-based authentication (User/Admin), protected routes, an admin activity-log audit trail, and a clean dashboard experience.

Overview

This project demonstrates a production-style full-stack architecture with:


a React + TypeScript frontend for the user experience
an Express backend for business logic and API routes
MongoDB as the database layer
JWT-based authentication with role-based access control (RBAC)
an audit logging system for tracking contact changes


The application is structured to be easy to explain in an interview and simple to extend with future features such as CSV export and analytics.

Core Features


User signup and login, with an optional Admin role gated behind a server-side secret key
Password hashing with bcrypt
JWT authentication (access + refresh tokens) and protected routes
Role-based access control: standard Users vs. Admins
Contacts CRUD operations, scoped per user (Admins can view/manage all contacts)
Search and pagination for contacts
Admin-only activity log audit trail (every contact add/edit/delete is recorded)
Admin dashboard stats endpoint (user counts by role)
Responsive dashboard and contact management UI
Clean modular structure for maintainability


Tech Stack

Frontend


React 19
TypeScript
Vite
React Router DOM
Axios
Tailwind CSS v4
React Hook Form
React Toastify
jwt-decode (client-side token/role checks)
lucide-react (icons)


Backend


Node.js
Express 5
MongoDB
Mongoose
JWT (jsonwebtoken)
bcrypt
express-validator
cookie-parser
cors
helmet
morgan


Architecture

Frontend Flow


The user opens the app in the browser.
React Router handles navigation between login, signup, contacts, and (Admin-only) activity logs pages.
The frontend uses Axios to call the backend API, attaching the JWT via a request interceptor.
Protected pages require a valid, non-expired JWT stored in local storage; ProtectedRoute also enforces role checks for Admin-only pages by decoding the token client-side.
A response interceptor catches 401s globally, clears the stored token, and redirects to login.
The UI displays loading states, errors, and toast notifications for better user experience.


Backend Flow


Express receives incoming API requests.
Routes direct requests to the correct controller.
authMiddleware verifies the JWT and attaches the user (including role) to the request; authorize(...roles) then gates role-restricted routes (e.g. Admin-only).
Controllers interact with Mongoose models to read or write data.
Contact create/update/delete actions write an entry to the Log collection via a shared audit logger, capturing who did what.
Responses follow a consistent JSON format with success, message, and data/errors fields.


Database Design


Users collection stores authentication data and a role field (User or Admin, default User).
Contacts collection stores contact information for each authenticated user, linked via a user reference field. Admins can view/manage contacts across all users.
Logs collection stores an audit trail (userEmail, action, details, timestamp) for every contact add/edit/delete, viewable by Admins only.


Project Structure

Frontend


frontend/src/pages — page-level screens: LoginPage, SignupPage, ContactsPage, LogsPage (Admin only)
frontend/src/components — reusable UI: Layout, ContactModal, DeleteModal, ProtectedRoute, ToastProvider
frontend/src/services/api.ts — Axios instance with auth-header and 401-handling interceptors
frontend/src/App.tsx — route configuration


Backend


backend/src/app.js — Express app setup
backend/src/server.js — server startup logic
backend/src/config/database.js — MongoDB connection setup
backend/src/controllers — authController, userController, contactController, adminController
backend/src/middleware/auth.js — JWT verification (authMiddleware) and role gating (authorize)
backend/src/models — User, Contact, Log schema definitions
backend/src/routes — authRoutes, userRoutes, contactRoutes, adminRoutes
backend/src/utils/logger.js — shared audit-log writer used by the contacts controller


Setup Instructions

1. Backend


Open the backend folder.
Copy .env.example to .env and fill in real values (see Environment Variables below).
Install dependencies with npm install.
Start the server with npm start.


2. Frontend


Open the frontend folder.
Install dependencies with npm install.
Create a .env file with the backend URL:

VITE_API_URL=http://localhost:5000/api



Start the frontend with npm run dev.



Note: the API base URL is currently hardcoded in frontend/src/services/api.ts rather than read from VITE_API_URL. Update that file to read import.meta.env.VITE_API_URL before deploying, so the frontend points at your deployed backend instead of localhost.



Environment Variables

Backend


PORT
CLIENT_URL
MONGO_URI
JWT_SECRET
JWT_REFRESH_SECRET
ADMIN_SECRET_KEY — required passkey a signup request must supply to be granted the Admin role


Frontend


VITE_API_URL


API Overview

Authentication


POST /api/auth/signup — supports an optional role: "Admin" + adminSecretKey to self-register as Admin
POST /api/auth/login


Users


GET /api/users/profile — returns the authenticated user's profile


Contacts


GET /api/contacts — supports page, limit, search query params
POST /api/contacts
PUT /api/contacts/:id
DELETE /api/contacts/:id


Admin (Admin role required)


GET /api/admin/logs — most recent 100 audit log entries
GET /api/admin/dashboard-stats — total users, admin count, standard user count