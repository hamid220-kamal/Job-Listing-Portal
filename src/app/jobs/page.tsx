import JobFilter from '@/components/JobFilter';
import JobCard from '@/components/JobCard';
import { MOCK_JOBS } from '@/lib/mock_data';

export const metadata = {
    title: 'Search Jobs | Job Listing Portal',
    description: 'Browse thousands of active job listings.',
};

export default function JobsPage() {
    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <header style={{ padding: '4rem 0 2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Browse Jobs
                </h1>
                <p style={{ color: 'var(--muted-foreground)', maxWidth: '600px' }}>
                    Find the role that fits your skills and career aspirations.
                    Filter by location, role, and job type.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Sidebar Filters (Desktop) / Top Filters (Mobile) */}
                <aside style={{ position: 'sticky', top: '5rem' }}>
                    <JobFilter />
                </aside>

                {/* Job List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 500 }}>
                            Showing {MOCK_JOBS.length} jobs
                        </span>
                        <select style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'transparent'
                        }}>
                            <option>Most Recent</option>
                            <option>Highest Salary</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {MOCK_JOBS.map((job) => (
                            <JobCard key={job.id} {...job} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
