import Link from 'next/link';

interface JobCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    postedAt: string;
}

export default function JobCard({ id, title, company, location, type, salary, postedAt }: JobCardProps) {
    return (
        <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            backgroundColor: 'var(--background)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative'
        }}
            className="job-card"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                        <Link href={`/jobs/${id}`} style={{ textDecoration: 'none' }}>
                            {title}
                        </Link>
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{company}</p>
                </div>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--muted-foreground)',
                    backgroundColor: 'var(--secondary)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '999px'
                }}>
                    {type}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    📍 {location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    💰 {salary}
                </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Posted {postedAt}</span>
                <Link href={`/jobs/${id}`} style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--primary)',
                    textDecoration: 'none'
                }}>
                    View Details →
                </Link>
            </div>
        </div>
    );
}
