/**
 * Centralized API configuration to handle environment variables and fallbacks.
 * This ensures that the application works correctly even if .env files are missing,
 * such as in a fresh collaborator environment.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-listing-portal-ten-omega.vercel.app/api';

// The root URL of the backend server (for static files/uploads)
export const BACKEND_URL = API_URL.replace('/api', '');

// The root URL of the frontend website
export const SITE_URL = 'https://job-listing-portal-ten-omega.vercel.app';

export default {
    API_URL,
    BACKEND_URL,
    SITE_URL,
};
