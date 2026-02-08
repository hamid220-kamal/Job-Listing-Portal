import Button from '@/components/Button';
import { MOCK_JOBS } from '@/lib/mock_data';
import Link from 'next/link';

export const metadata = {
    title: 'Employer Dashboard | Job Listing Portal',
};

export default function EmployerDashboard() {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Employer Dashboard</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Manage your job postings and candidates.</p>
                </div>
                <Link href="/jobs/new">
                    <Button>+ Post New Job</Button>
                </Link>
            </div>

            <div style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                }}>
                    <div>Job Title</div>
                    <div>Status</div>
                    <div>Applicants</div>
                    <div>Views</div>
                    <div>Actions</div>
                </div>

                {MOCK_JOBS.slice(0, 3).map((job) => (
                    <div key={job.id} style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                        alignItems: 'center',
                        fontSize: '0.875rem'
                    }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>{job.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{job.location} • {job.type}</div>
                        </div>
                        <div>
                            <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '999px',
                                backgroundColor: '#ECFDF5',
                                color: '#059669',
                                fontSize: '0.75rem',
                                fontWeight: 600
                            }}>
                                Active
                            </span>
                        </div>
                        <div>
                            12 Candidates
                        </div>
                        <div>
                            1.2k
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" style={{ color: 'var(--destructive, #ef4444)' }}>Close</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
