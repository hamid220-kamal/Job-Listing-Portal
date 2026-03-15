"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Briefcase, MapPin, 
    Calendar, Clock, Edit, Trash2, 
    Eye, EyeOff, MoreVertical,
    TrendingUp, ExternalLink, Users,
    ChevronRight, Search, LayoutDashboard
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    salary: string;
    createdAt: string;
    status: 'active' | 'closed' | 'draft';
    applicationCount?: number;
}

export default function ManageJobsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'employer')) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs/mine');
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
            toast.error('Failed to load your jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchJobs();
    }, [user]);

    const handleToggleStatus = async (jobId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        setUpdatingId(jobId);
        try {
            await api.put(`/jobs/${jobId}`, { status: newStatus });
            setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus as any } : j));
            toast.success(`Job marked as ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update job status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) return;
        
        setUpdatingId(jobId);
        try {
            await api.delete(`/jobs/${jobId}`);
            setJobs(prev => prev.filter(j => j._id !== jobId));
            toast.success('Job deleted successfully');
        } catch (err) {
            toast.error('Failed to delete job');
        } finally {
            setUpdatingId(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <div style={{ width: 40, height: 40, border: '4px solid #f1f5f9', borderTopColor: '#2563eb', borderRadius: '50%' }} />
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ padding: '3rem 2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                            <Link href="/dashboard/employer" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
                            <ChevronRight size={14} />
                            <span style={{ color: '#0f172a' }}>Manage Jobs</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>
                            Your Job <span style={{ color: '#2563eb' }}>Postings</span>
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Review, edit, and manage the lifecycle of your hiring campaigns.
                        </p>
                    </div>
                    
                    <Link href="/jobs/new">
                        <motion.button 
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ 
                                padding: '1rem 2rem', borderRadius: '18px', border: 'none',
                                background: '#0f172a', color: 'white', fontWeight: 800, fontSize: '1rem',
                                display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)'
                            }}
                        >
                            <Plus size={20} strokeWidth={3} /> Post New Job
                        </motion.button>
                    </Link>
                </div>

                <div style={{ background: 'white', borderRadius: '40px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                    {jobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.2 }}>📋</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>No job postings yet</h2>
                            <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '2.5rem' }}>
                                Start your hiring journey by posting your first job opportunity.
                            </p>
                            <Link href="/jobs/new">
                                <Button variant="primary" size="lg">Create Your First Job</Button>
                            </Link>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                    <tr>
                                        <th style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Job Details</th>
                                        <th style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Stats</th>
                                        <th style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {jobs.map((job) => (
                                            <motion.tr 
                                                key={job._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = '#fcfdfe')}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                <td style={{ padding: '1.5rem 2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                        <div style={{ 
                                                            width: 48, height: 48, borderRadius: '14px', 
                                                            background: '#eff6ff', color: '#2563eb',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '1.1rem', fontWeight: 900
                                                        }}>
                                                            {job.category.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>{job.title}</h3>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} /> {job.location}</span>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {job.type}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.5rem 2rem' }}>
                                                    <div style={{ 
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                                        padding: '0.4rem 0.8rem', borderRadius: '10px',
                                                        background: job.status === 'active' ? '#f0fdf4' : '#f8fafc',
                                                        color: job.status === 'active' ? '#15803d' : '#64748b',
                                                        fontSize: '0.75rem', fontWeight: 800
                                                    }}>
                                                        {job.status === 'active' ? <TrendingUp size={14} /> : <EyeOff size={14} />}
                                                        {job.status.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.5rem 2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <p style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{job.applicationCount || 0}</p>
                                                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Applicants</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <Link href={`/jobs/${job._id}`} title="Preview">
                                                            <button style={{ padding: '0.6rem', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}>
                                                                <Eye size={18} />
                                                            </button>
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleToggleStatus(job._id, job.status)}
                                                            disabled={updatingId === job._id}
                                                            title={job.status === 'active' ? "Archive" : "Re-activate"}
                                                            style={{ padding: '0.6rem', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}
                                                        >
                                                            {job.status === 'active' ? <EyeOff size={18} /> : <TrendingUp size={18} />}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(job._id)}
                                                            disabled={updatingId === job._id}
                                                            title="Delete"
                                                            style={{ padding: '0.6rem', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', color: '#ef4444', cursor: 'pointer' }}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
