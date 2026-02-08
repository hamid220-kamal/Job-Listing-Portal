import Link from 'next/link';
import { notFound } from 'next/navigation';
import Button from '@/components/Button';
import { MOCK_JOBS } from '@/lib/mock_data';

interface PageProps {
    params: {
        id: string;
    };
}

// Next.js 15+ allows params to be a Promise, but we'll stick to standard simple typing for now 
// or define generic PageProps if strictly needed. 
// For now, let's assume standard behavior for app router.

export async function generateMetadata({ params }: PageProps) {
    const job = MOCK_JOBS.find((j) => j.id === params.id);

    if (!job) {
        return { title: 'Job Not Found' };
    }

    return {
        title: `${job.title} at ${job.company} | Job Listing Portal`,
        description: `Apply for ${job.title} at ${job.company}.`,
    };
}

export default function JobDetailsPage({ params }: PageProps) {
    const job = MOCK_JOBS.find((j) => j.id === params.id);

    if (!job) {
        notFound();
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '4rem' }}>
            <Link href="/jobs" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--muted-foreground)',
                marginBottom: '2rem',
                fontSize: '0.875rem'
            }}>
                ← Back to Jobs
            </Link>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 350px',
                gap: '4rem',
                alignItems: 'start'
            }}>
                {/* Main Content */}
                <article>
                    <header style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{job.title}</h1>
                        <div style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                            {job.company} • {job.location}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: 'var(--secondary)',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}>
                                {job.type}
                            </span>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: 'var(--secondary)',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--foreground)'
                            }}>
                                {job.salary}
                            </span>
                        </div>
                    </header>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Description</h2>
                        <p style={{ lineHeight: 1.7, color: 'var(--foreground)', whiteSpace: 'pre-line' }}>
                            {job.description}
                        </p>
                    </section>

                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Requirements</h2>
                        <ul style={{
                            listStyle: 'disc',
                            paddingLeft: '1.5rem',
                            lineHeight: 1.7,
                            color: 'var(--foreground)'
                        }}>
                            {job.requirements.map((req, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem' }}>{req}</li>
                            ))}
                        </ul>
                    </section>
                </article>

                {/* Sidebar Application Card */}
                <aside style={{
                    position: 'sticky',
                    top: '6rem',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Interested?</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                        Apply now to start your journey with {job.company}.
                    </p>

                    <Button size="lg" style={{ width: '100%', marginBottom: '1rem' }}>
                        Apply Now
                    </Button>

                    <Button variant="secondary" style={{ width: '100%' }}>
                        Save Job
                    </Button>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                        Posted {job.postedAt}
                    </div>
                </aside>
            </div>
        </div>
    );
}
