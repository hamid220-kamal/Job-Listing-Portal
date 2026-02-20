"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Link from 'next/link';
import api from '@/utils/api';

interface Application {
    _id: string;
    job: {
        _id: string;
        title: string;
        company: string;
        location: string;
    };
    appliedAt: string;
    coverLetter?: string;
}

export default function CandidateDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    // Route guard — redirect non-candidates
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'candidate')) {
            router.push(user ? '/dashboard/employer' : '/auth/login');
        }
    }, [user, authLoading, router]);

    // Fetch candidate's applications
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/me');
                setApplications(res.data);
            } catch (err) {
                console.error('Failed to fetch applications:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'candidate') {
            fetchApplications();
        }
    }, [user]);

    if (authLoading || !user || user.role !== 'candidate') {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Welcome, {user.name}!
                    </h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Track your job applications and career progress.</p>
                </header>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Applications Sent</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{applications.length}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            padding: '1.5rem',
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Profile Status</p>
                        <p style={{ fontSize: '1rem', fontWeight: 600 }}>Active ✅</p>
                    </motion.div>
                </div>

                {/* Profile CTA */}
                <section style={{
                    padding: '2rem',
                    background: 'var(--gradient-primary, linear-gradient(135deg, #6366f1, #8b5cf6))',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Complete your profile</h2>
                        <p style={{ opacity: 0.9, maxWidth: '500px' }}>
                            Profiles with a resume and detailed bio get 3x more interview requests.
                        </p>
                    </div>
                    <Link href="/dashboard/candidate/profile">
                        <Button style={{
                            backgroundColor: '#ffffff',
                            color: '#1f2937'
                        }}>
                            Update Profile
                        </Button>
                    </Link>
                </section>

                {/* Applications List */}
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Your Applications</h2>

                {loading ? (
                    <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '3rem' }}>Loading applications...</p>
                ) : applications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            border: '2px dashed var(--border)',
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No applications yet</h3>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                            Start applying to jobs to track your progress here!
                        </p>
                        <Link href="/jobs">
                            <Button>Browse Jobs</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {applications.map((app, i) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                style={{
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: 'var(--surface)',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                }}
                            >
                                <div>
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{app.job.title}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                        {app.job.company} • {app.job.location} • Applied {new Date(app.appliedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '999px',
                                    backgroundColor: '#EFF6FF',
                                    color: '#2563EB',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                }}>
                                    In Review
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
