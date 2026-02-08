import Link from 'next/link';
import Button from '@/components/Button';
import JobFilter from '@/components/JobFilter';
import JobCard from '@/components/JobCard';
import { MOCK_JOBS } from '@/lib/mock_data';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--muted)',
        padding: '6rem 0',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              marginBottom: '1.5rem',
              lineHeight: 1.1
            }}>
              Find your next <span style={{ color: 'var(--accent)' }}>dream job</span> today.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
              Connect with top companies and startups. No spam, just quality listings.
              Human-verified and authentic opportunities.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/jobs">
                <Button size="lg">Browse Jobs</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="secondary" size="lg">Post a Job</Button>
              </Link>
            </div>
          </div>

          <JobFilter />
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Featured Opportunities</h2>
          <Link href="/jobs">
            <Button variant="ghost">View all jobs →</Button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {MOCK_JOBS.slice(0, 6).map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '4rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>10k+</div>
            <div style={{ color: 'var(--muted-foreground)' }}>Active Jobs</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>500+</div>
            <div style={{ color: 'var(--muted-foreground)' }}>Companies</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>100k+</div>
            <div style={{ color: 'var(--muted-foreground)' }}>Candidates</div>
          </div>
        </div>
      </section>
    </div>
  );
}
