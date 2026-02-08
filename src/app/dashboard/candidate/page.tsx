import Button from '@/components/Button';
import { MOCK_JOBS } from '@/lib/mock_data';
import Link from 'next/link';

export const metadata = {
    title: 'Candidate Dashboard | Job Listing Portal',
};

export default function CandidateDashboard() {
    const appliedJobs = MOCK_JOBS.slice(0, 2);

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Applications</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Track the status of your job applications.</p>
            </header>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Profile Summary Card */}
                <section style={{
                    padding: '2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Complete your profile</h2>
                        <p style={{ opacity: 0.9, maxWidth: '500px' }}>
                            Profiles with a resume and detailed bio get 3x more interview requests.
                        </p>
                    </div>
                    <Button style={{
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)'
                    }}>
                        Update Profile
                    </Button>
                </section>

                {/* Applications List */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Applications</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {appliedJobs.map((job) => (
                            <div key={job.id} style={{
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                padding: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: 'var(--background)'
                            }}>
                                <div>
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{job.title}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{job.company} • Applied 2 days ago</p>
                                </div>
                                <div>
                                    <span style={{
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '999px',
                                        backgroundColor: '#EFF6FF',
                                        color: '#2563EB',
                                        fontSize: '0.875rem',
                                        fontWeight: 500
                                    }}>
                                        In Review
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
