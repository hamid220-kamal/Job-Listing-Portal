# FSD - Functional Specification Document

## 1. Introduction
This document describes the functional architecture of the Job Listing Portal, detailing the data flow, component interactions, and API structure.

## 2. System Architecture
The system follows a hybrid architecture, allowing for isolated development and remote authentication.

### 2.1. Backend (Express.js)
- **Features**: Modularized into auth, jobs, applications, profile, dashboard, health, and search.
- **Database**: MongoDB (Mongoose).
- **Communication**: REST API.

### 2.2. Frontend (Next.js 15)
- **Framework**: App Router with Client-side rendering for interactivity.
- **Styling**: Vanilla CSS with glassmorphic design tokens.
- **State**: React Context (`AuthContext`).

## 3. Data Models
### 3.1. User
- `name`, `email`, `password`, `role` (candidate, employer).
- `avatar`, `headline`, `bio`, `skills`, `experience`, `education`, `resume` (for candidates).
- `company`, `logo`, `industry`, `companyDescription`, `website` (for employers).

### 3.2. Job
- `title`, `company`, `location`, `type`, `salary`, `description`, `postedBy`.

### 3.3. Application
- `jobId`, `candidateId`, `resume`, `coverLetter`, `status`.

## 4. API Endpoints
- `/api/auth`: Login, Signup, Logout, Refresh, Me.
- `/api/jobs`: CRUD for job listings.
- `/api/applications`: Job applications and management.
- `/api/profile`: User profile management with media uploads.
- `/api/search`: Advanced job search and filtering.
- `/api/dashboard`: Statistical summaries for dashboards.

## 5. UI/UX Components
- **Navbar & Footer**: Global navigation.
- **Hero & Search**: Home page search bar and introductory animations.
- **Job Cards**: Reusable cards for job listings.
- **Dashboards**: Modular sections for statistics and management.
- **Modals & Toast**: interactive elements and user feedback.
