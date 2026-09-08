# KrishiQ Backend (SIH26032)

> **Intelligent Agricultural Procurement Coordination Platform**  
> Core REST API service built with Node.js, Express.js, and TypeScript.

---

## 🏗️ Architecture & Folder Structure

The backend follows a layered, decoupled architecture designed for scalability, maintainability, and testability:

```text
backend/
├── src/
│   ├── config/             # Typed environment configuration
│   │   └── env.ts
│   ├── controllers/        # Request handling and HTTP response dispatching
│   │   └── healthController.ts
│   ├── middleware/         # Express middleware (logging, error handling, 404)
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   └── requestLogger.ts
│   ├── routes/             # REST route declarations
│   │   ├── healthRoutes.ts
│   │   └── index.ts
│   ├── schemas/            # Request validation schema foundations
│   │   └── index.ts
│   ├── services/           # Reusable business logic layer
│   │   └── healthService.ts
│   ├── types/              # Common TypeScript interfaces & envelopes
│   │   └── index.ts
│   ├── utils/              # Standardized API response and error utilities
│   │   └── apiResponse.ts
│   ├── app.ts              # Express application configuration & middleware pipeline
│   └── server.ts           # Server bootstrap, port binding, & shutdown handlers
├── .env.example            # Environment variables template
├── .env                    # Local environment settings
├── .gitignore              # Git ignored files & directories
├── package.json            # Node.js dependencies & scripts
├── tsconfig.json           # Strict TypeScript compiler options
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (if not already present):
```bash
cp .env.example .env
```

Default configuration:
```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api
CORS_ORIGIN=http://localhost:5173
```

### 3. Run in Development Mode
Starts the server with hot-reloading via `tsx watch`:
```bash
npm run dev
```

### 4. Build and Run in Production Mode
Compile TypeScript to JavaScript in `dist/` and run:
```bash
npm run build
npm start
```

---

## 🩺 Health Check Probe

Verify that the API server is up and responsive:

* **Method:** `GET`
* **URL:** `http://localhost:5000/api/health`
* **Expected Response:**
```json
{
  "success": true,
  "message": "KrishiQ Backend API is running healthy",
  "data": {
    "status": "healthy",
    "uptimeSeconds": 12,
    "timestamp": "2026-09-08T15:50:00.000Z",
    "environment": "development",
    "version": "1.0.0"
  }
}
```

---

## 🛡️ Standard Error Format

All errors return a consistent JSON response:
```json
{
  "success": false,
  "message": "Resource not found: GET /api/unknown"
}
```
