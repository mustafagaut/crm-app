# CRM Application

A modern MERN stack CRM application designed for managing customer contacts with secure authentication, protected routes, and a clean dashboard experience.

## Overview

This project demonstrates a production-style full-stack architecture with:
- a React frontend for the user experience
- an Express backend for business logic and API routes
- MongoDB as the database layer
- JWT-based authentication for secure access

The application is structured to be easy to explain in an interview and simple to extend with future features such as activity logs, role-based access, CSV export, and analytics.

## Core Features

- User signup and login
- Password hashing with bcrypt
- JWT authentication and protected routes
- Contacts CRUD operations
- Search and pagination for contacts
- Responsive dashboard and contact management UI
- Clean modular structure for maintainability

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator
- cookie-parser
- cors
- helmet
- morgan

## Architecture

### Frontend Flow
1. The user opens the app in the browser.
2. React Router handles navigation between login, signup, dashboard, and contacts pages.
3. The frontend uses Axios to call the backend API.
4. Protected pages require a valid JWT token stored in local storage.
5. The UI displays loading states, errors, and toast notifications for better user experience.

### Backend Flow
1. Express receives incoming API requests.
2. Routes direct requests to the correct controller.
3. Controllers interact with Mongoose models to read or write data.
4. Authentication middleware verifies JWT tokens before protected routes are accessed.
5. Responses follow a consistent JSON format with success, message, and data fields.

### Database Design
- Users collection stores authentication data.
- Contacts collection stores contact information for each authenticated user.
- Each contact is linked to a user through a reference field.

## Project Structure

### Frontend
- frontend/src/pages - page-level screens such as login, signup, dashboard, and contacts
- frontend/src/components - reusable UI components and layout
- frontend/src/services - API layer for backend communication
- frontend/src/App.jsx - route configuration

### Backend
- backend/src/app.js - Express app setup
- backend/src/server.js - server startup logic
- backend/src/config - database connection setup
- backend/src/controllers - business logic for auth and contacts
- backend/src/middleware - JWT protection and request validation helpers
- backend/src/models - MongoDB schema definitions
- backend/src/routes - API endpoints for auth and contacts

## Setup Instructions

### 1. Backend
1. Open the backend folder.
2. Copy the example environment file and update the values.
3. Install dependencies with npm install.
4. Start the server with npm start.

### 2. Frontend
1. Open the frontend folder.
2. Install dependencies with npm install.
3. Create a .env file with the backend URL:
   - VITE_API_URL=http://localhost:5000/api
4. Start the frontend with npm run dev.

## Environment Variables

### Backend
- PORT
- CLIENT_URL
- MONGO_URI
- JWT_SECRET
- JWT_REFRESH_SECRET

### Frontend
- VITE_API_URL

## API Overview

### Authentication
- POST /api/auth/signup
- POST /api/auth/login

### Contacts
- GET /api/contacts
- POST /api/contacts
- PUT /api/contacts/:id
- DELETE /api/contacts/:id

## Deployment Notes

- Frontend can be deployed on Vercel.
- Backend can be deployed on Render.
- MongoDB should be hosted on MongoDB Atlas.

## Why This Project Is Interview-Ready

This project demonstrates:
- clean separation of concerns
- secure authentication logic
- modular API structure
- reusable frontend components
- a practical CRUD implementation for a business application
