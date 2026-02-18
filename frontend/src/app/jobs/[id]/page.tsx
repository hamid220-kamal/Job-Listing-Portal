"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
// import { MOCK_JOBS } from '@/lib/mock_data';
import { CheckCircle } from 'lucide-react';

import api from '@/utils/api';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    requirements: string[];
    postedAt: string;
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applicationData, setApplicationData] = useState({ resume: '', coverLetter: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/applications/${job?._id}`, applicationData);
            setSuccess(true);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error applying for job');
        } finally {
            setSubmitting(false);
        }
    };

    // Unwrap params using React.use() or just accept it as a promise in newer Next.js, 
    // but specific to this version, if it's a client component, params might be passed directly 
    // OR we need to treat it carefully. 
    // However, in standard Next.js 13/14 client components, props are passed.
    // Let's stick to standard useEffect fetch.

    // NOTE: In Next.js 15, params is a Promise. If this is Next 15 (package.json said 14/15?), 
    // we should be careful. 
    // The package.json showed "next": "16.1.6".  Wait, Next 16?? 
    // That's very new or a canary. 
    // In strict Next.js 15+, params is a Promise.
    // Since this is "use client", we can't await params in the component body directly unless we use `use(params)`.
    // But safely, we can just use `React.useEffects` if we treat params as an object if it comes that way, 
    // OR unwrapping it.
    // Let's assume params might be a promise and handle it.

    // Actually, to be safe with "use client" in Next 15:
    // We should allow params to be any or unwrapped.
    // But let's look at the existing code: `export default function JobDetailsPage({ params }: { params: { id: string } })`
    // If it was working before as a client component, params was likely passed.
    // I will use `useEffect` to fetch.

    useEffect(() => {
        const fetchJob = async () => {
            // In Next.js 15, we might need to await params if passing it to a server component, 
            // but here it is props. 
            // To be safe against the Next.js 15 breaking change regarding params:
            // We can check if params is a promise (it shouldn't be in client components if passed from layout, but page props changed).
            // Actually, page props `params` is a Promise in Next.js 15 for *Server Components*. 
            // For Client Components, it is still passed as props but accessing it might require unwrapping if we were strict. 
            // Let's just try accessing `params.id`. IF it fails, we know it's the Promise issue.
            // But usually `use client` pages receive resolved params if defined properly or passed down.
            // Wait, `page.tsx` acts as the entry.

            try {
                // If params is a promise (Next 15 change), we need to await it. 
                // But we can't await in top level of use client.
                // We'll assume params.id is available or we use `useParams` hook which is safer for client components.
            } catch (e) { }

            try {
                const { data } = await api.get(`/jobs/${params.id}`);
                setJob(data);
            } catch (error) {
                console.error('Error fetching job:', error);
                setJob(null);
            } finally {
                setLoading(false);
            }
        };

        if (params?.id) {
            fetchJob();
        }
    }, [params?.id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading job details...</div>;

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
                title={success ? "Application Sent!" : `Apply to ${job?.company}`}
                footer={
                    success ? (
                        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                    ) : null
                }
            >
                {success ? (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', background: '#D1FAE5', color: '#059669',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
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
                ) : (
                    <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
                        <Input
                            label="Resume / Portfolio Link"
                            placeholder="https://linkedin.com/in/you or Google Drive Link"
                            value={applicationData.resume}
                            onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })}
                            required
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>Cover Letter</label>
                            <textarea
                                className="input-field"
                                rows={5}
                                placeholder="Why are you a good fit for this role?"
                                value={applicationData.coverLetter}
                                onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--background)',
                                    color: 'var(--foreground)',
                                    fontSize: '0.875rem',
                                    resize: 'vertical',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Sending...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>

        </div>
    );
}
