# PRD - Job Listing Portal

## 1. Overview
The Job Listing Portal is a modern MERN-stack application (Next.js 15, Express, MongoDB) designed to connect talent with organizations. It focuses on a premium user experience, security, and performance.

## 2. Target Audience
- **Candidates**: Individuals looking for job opportunities, tracking applications, and showcasing their skills.
- **Employers**: Organizations looking to post jobs, manage applicants, and showcase their brand.

## 3. Key Features
### 3.1. Authentication
- Secure JWT-based auth with HTTP-only cookie refresh tokens.
- Role-based access control (Candidate vs. Employer).

### 3.2. Job Management
- Employers can create, read, update, and delete job postings.
- Advanced search with keyword, location, and type filters.

### 3.3. Application System
- Candidates can apply to jobs with resumes and cover letters.
- Real-time application tracking for candidates.
- Applicant management for employers.

### 3.4. Profile & Dashboard
- Visual dashboards with statistics (Matches, Applications, Hires).
- Profile builder with Cloudinary-powered media uploads (Avatar, Logo, Resume).

## 4. Technical Requirements
- **Frontend**: Next.js 15 (App Router), TypeScript, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary for media.
- **Security**: Helmet, Rate Limiting, Mongo Sanitize, JWT Refresh Rotation.
- **Performance**: Lazy loading, SEO optimization, efficient database indexing.

## 5. Success Metrics
- Seamless user onboarding.
- High engagement through interactive UI.
- Fast page loads and efficient search results.
