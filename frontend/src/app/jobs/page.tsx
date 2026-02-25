import { Metadata } from 'next';
import JobsPageClient from './JobsClient';

export const metadata: Metadata = {
    title: 'Browse Jobs | Job Listing Portal',
    description: 'Find your next career opportunity. Browse through thousands of job listings in technology, design, marketing, and more. Filter by location, job type, and salary.',
    keywords: ['search jobs', 'job listings', 'career opportunities', 'hiring now', 'remote jobs', 'full-time jobs', 'software engineer jobs'],
    openGraph: {
        title: 'Find Your Dream Job',
        description: 'Thousands of job opportunities are waiting for you. Start your search today.',
        images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop']
    }
};

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function JobsPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="spin" size={40} color="var(--accent)" />
            </div>
        }>
            <JobsPageClient />
        </Suspense>
    );
}
