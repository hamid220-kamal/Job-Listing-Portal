import type { MetadataRoute } from 'next';

const BASE_URL = 'https://job-listing-portal-ten-omega.vercel.app';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-listing-portal-ten-omega.vercel.app/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/companies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/salaries`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/auth/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/auth/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ];

    // Dynamic routes — fetch all job IDs
    let jobRoutes: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/jobs?limit=500`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            const jobs = Array.isArray(data) ? data : (data.jobs || []);
            jobRoutes = jobs.map((job: { _id: string; createdAt?: string }) => ({
                url: `${BASE_URL}/jobs/${job._id}`,
                lastModified: job.createdAt ? new Date(job.createdAt) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }));
        }
    } catch {
        // Silently skip dynamic routes if API is unreachable at build time
    }

    return [...staticRoutes, ...jobRoutes];
}
