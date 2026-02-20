"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Link from 'next/link';
import api from '@/utils/api';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    createdAt: string;
}

export default function EmployerDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    // Route guard — redirect non-employers
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'employer')) {
            router.push(user ? '/dashboard/candidate' : '/auth/login');
        }
    }, [user, authLoading, router]);

    // Fetch employer's posted jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs');
                // Filter jobs posted by this employer
                const myJobs = res.data.filter((job: any) => job.postedBy?._id === user?._id);
                setJobs(myJobs);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'employer') {
            fetchJobs();
        }
    }, [user]);

    if (authLoading || !user || user.role !== 'employer') {
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Welcome, {user.name}!
                        </h1>
                        <p style={{ color: 'var(--muted-foreground)' }}>
                            Manage your job postings and find the best candidates.
                        </p>
                    </div>
                    <Link href="/jobs/new">
                        <Button>+ Post New Job</Button>
                    </Link>
                </div>

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
                        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Active Jobs</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{jobs.length}</p>
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
                        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Posted</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{jobs.length}</p>
                    </motion.div>
                </div>

                {/* Jobs List */}
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Your Job Postings</h2>

                {loading ? (
                    <p style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '3rem' }}>Loading your jobs...</p>
                ) : jobs.length === 0 ? (
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
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No jobs posted yet</h3>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
                            Post your first job to start finding great candidates!
                        </p>
                        <Link href="/jobs/new">
                            <Button>Post Your First Job</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div style={{
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden'
                    }}>
                        {/* Table Header */}
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid var(--border)',
                            backgroundColor: 'var(--muted)',
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}>
                            <div>Job Title</div>
                            <div>Location</div>
                            <div>Salary</div>
                            <div>Posted</div>
                        </div>

                        {/* Job Rows */}
                        {jobs.map((job, i) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                style={{
                                    padding: '1.25rem 1.5rem',
                                    borderBottom: '1px solid var(--border)',
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                                    alignItems: 'center',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600 }}>{job.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{job.company}</div>
                                </div>
                                <div style={{ color: 'var(--muted-foreground)' }}>{job.location || '—'}</div>
                                <div style={{ fontWeight: 500 }}>{job.salary ? `$${job.salary}` : '—'}</div>
                                <div style={{ color: 'var(--muted-foreground)' }}>
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
