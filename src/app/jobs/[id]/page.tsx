"use client";

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { MOCK_JOBS } from '@/lib/mock_data';
import { CheckCircle } from 'lucide-react';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
    const job = MOCK_JOBS.find((j) => j.id === params.id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!job) {
        notFound();
    }

    return (
        <div className="container" style={{ padding: '4rem 0', display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>

            {/* Main Content */}
            <article>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/jobs" style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', textDecoration: 'none' }}>
                        ← Back to Jobs
                    </Link>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
                        {job.title}
                    </h1>
                    <div style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)' }}>
                        {job.company} • {job.location}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <span style={{ backgroundColor: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500 }}>
                        {job.type}
                    </span>
                    <span style={{ backgroundColor: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>
                        {job.salary}
                    </span>
                </div>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Description</h2>
                    <p style={{ lineHeight: 1.7, color: 'var(--foreground)', whiteSpace: 'pre-line' }}>
                        {job.description}
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Requirements</h2>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: 1.7, color: 'var(--foreground)' }}>
                        {job.requirements.map((req, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>{req}</li>
                        ))}
                    </ul>
                </section>
            </article>

            {/* Sidebar - Sticky */}
            <div style={{ position: 'sticky', top: '8rem' }}>
                <div style={{
                    padding: '2rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--surface)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Interested?</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                        Apply now to start your journey with {job.company}.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Button style={{ width: '100%', background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-glow)', border: 'none' }} onClick={() => setIsModalOpen(true)}>
                            Apply Now
                        </Button>
                        <Button variant="secondary" style={{ width: '100%' }}>Save Job</Button>
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                        Posted {job.postedAt}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Application Sent!"
                footer={
                    <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                }
            >
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: '#D1FAE5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <CheckCircle size={32} />
                    </div>
                    <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                        Your application to <strong>{job.company}</strong> has been submitted.
                    </p>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                        You can track the status of your application in your dashboard.
                    </p>
                </div>
            </Modal>

        </div>
    );
}
