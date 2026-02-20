# Job Listing Portal


A full-stack MERN application for connecting Job Seekers with Employers. Built with **Next.js**, **Express**, and **MongoDB**.

## 🚀 Key Features

- **Authentication**: Secure Login/Signup with JWT (Access + Refresh Tokens).
- **Hybrid Architecture**:
  - **Deployed Auth**: Centralized authentication server.
  - **Local Development**: Isolated backend development for other features.
- **Role-Based Access**: Specialized dashboards for **Candidates** and **Employers**.
- **Job Management**: create, edit, delete, and search jobs.
- **Applications**: Apply to jobs and track status.

---

## 📂 Project Structure

- **`frontend/`**: Next.js 15 App Router application.
- **`backend/`**: Express.js server with Feature-Based Architecture.

---

## 🤝 Collaboration Workflow (How to work on this repo)

We use a **Hybrid Workflow** to ensure security (no shared secrets) while allowing easy collaboration.

### Role 1: Frontend Developer (Zero Config)
*Goal: Build UI components without running the backend.*

1.  Clone the repository.
2.  Open `frontend/` terminal.
3.  Run:
    ```bash
    npm run dev
    ```
4.  **That's it!** The app automatically connects to our **Deployed Backend API**. You can login, view jobs, and interact with real production data immediately.

### Role 2: Backend Developer (Isolated Dev)
*Goal: Build new backend features (Profile, Jobs, etc.) without breaking production.*

1.  Clone the repository.
2.  Open `backend/` terminal.
3.  Run:
    ```bash
    npm run dev
    ```
4.  **Automatic Fallback:** Since you don't have the `.env` file, the server will:
    - Connect to your **Local MongoDB**.
    - Use **Remote Auth Verification**: It verifies tokens by asking the Deployed Server.
    - **Result:** You can login (via frontend) and your local backend accepts the token, even though you don't have the secret key!
5.  **Important:** To test your local backend with the frontend, create `frontend/.env.local` with:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
6.  **Get Data:** Run this command to populate your local DB with test user/jobs:
    ```bash
    npm run seed:local
    ```

### Role 3: Admin / Lead (You)
*Goal: Manage production, deployment, and secrets.*

- You have the `.env` file.
- You can run against Cloud DB: `npm run dev:cloud`
- You can run against Local DB: `npm run dev:local`
- You can deploy to Vercel.

---

## 🛠️ Setup & Scripts

### Prerequisites
- Node.js (v18+)
- MongoDB (Community Edition) installed locally (for Backend Developers).

### Backend Scripts
Run these inside `backend/`:

| Command | Description |
|OS|Status|
|---|---|
| `npm run dev` | Auto-detects mode. (Cloud if `.env` exists, Local if not). |
| `npm run dev:cloud` | **Diff**: Forces connection to MongoDB Atlas (requires `.env`). |
| `npm run dev:local` | **Diff**: Forces connection to Local MongoDB. |
| `npm run seed:cloud` | **Reset**: Wipes Cloud DB and seeds fresh data. |
| `npm run seed:local` | **Reset**: Wipes Local DB and seeds fresh data. |

### Frontend Scripts
Run these inside `frontend/`:

| Command | Description |
|---|---|
| `npm run dev` | Starts Next.js dev server (localhost:3000). |
| `npm run build` | Builds for production. |

---

## 🌐 Deployment (Vercel)

Both Frontend and Backend are configured for Vercel Serverless deployment.

### Backend Deployment
1.  Import `backend/` folder to Vercel.
2.  Environment Variables:
    - `MONGO_URI`: Your Atlas Connection String.
    - `JWT_SECRET`: Your Secret Key.
    - `NODE_ENV`: `production`

### Frontend Deployment
1.  Import `frontend/` folder to Vercel.
2.  Environment Variables:
    - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.vercel.app/api`

---

## 🔐 Security & Architecture

- **.gitignore**: Explicitly ignores `.env`. Secrets are never pushed.
- **Remote Verification**: `POST /api/auth/validate-token` allows local backends to trust production tokens without sharing keys.
- **Rate Limiting**: Protected against brute-force attacks.
- **Helmet**: Secure HTTP headers.

---

## 📝 Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Framer Motion, Axios.
- **Backend**: Express.js, Mongoose, JWT, bcryptjs.
- **Database**: MongoDB Atlas (Production), MongoDB Local (Development).
