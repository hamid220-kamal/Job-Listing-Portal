"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, Clock, MapPin, 
    ChevronRight, Search, Filter,
    FileText, User, LayoutDashboard,
    AlertCircle, CheckCircle, Star,
    ArrowLeft
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

interface AppJob {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
}

interface Application {
    _id: string;
    job: AppJob;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
    appliedAt: string;
    coverLetter?: string;
}

const statusConfig = {
    pending: { color: '#f59e0b', bg: '#fffbeb', icon: Clock, label: 'Pending' },
    reviewed: { color: '#3b82f6', bg: '#eff6ff', icon: Search, label: 'Reviewed' },
    shortlisted: { color: '#8b5cf6', bg: '#f5f3ff', icon: Star, label: 'Shortlisted' },
    rejected: { color: '#ef4444', bg: '#fef2f2', icon: AlertCircle, label: 'Rejected' },
    accepted: { color: '#10b981', bg: '#f0fdf4', icon: CheckCircle, label: 'Accepted' }
};

export default function CandidateApplicationsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'candidate')) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const { data } = await api.get('/applications/me');
                setApplications(data);
            } catch (err) {
                console.error('Failed to fetch applications', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    const filteredApps = filter === 'all' 
        ? applications 
        : applications.filter(app => app.status === filter);

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
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                        <Link href="/dashboard/candidate" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
                        <ChevronRight size={14} />
                        <span style={{ color: '#0f172a' }}>My Applications</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>
                        Application <span style={{ color: '#2563eb' }}>Tracker</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                        Manage and track the progress of your professional submissions.
                    </p>
                </div>

                {/* Filters */}
                <div style={{ 
                    display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', 
                    overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' 
                }}>
                    {['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '16px',
                                border: '1px solid',
                                borderColor: filter === f ? '#2563eb' : '#e2e8f0',
                                background: filter === f ? '#2563eb' : 'white',
                                color: filter === f ? 'white' : '#64748b',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'capitalize',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {f === 'all' ? 'All Applications' : f}
                        </button>
                    ))}
                </div>

                {filteredApps.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ 
                            textAlign: 'center', padding: '6rem 2rem', background: 'white', 
                            borderRadius: '40px', border: '1px dashed #e2e8f0' 
                        }}
                    >
                        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', opacity: 0.5 }}>📂</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>No records found</h2>
                        <p style={{ color: '#64748b', fontWeight: 500, marginBottom: '2rem' }}>
                            You haven't made any applications {filter !== 'all' ? `with status "${filter}"` : ''} yet.
                        </p>
                        <Link href="/jobs">
                            <Button variant="primary" size="lg">Explore Open Roles</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100%, 1fr))', gap: '1.25rem' }}>
                        <AnimatePresence mode="popLayout">
                            {filteredApps.map((app) => {
                                const status = statusConfig[app.status] || statusConfig.pending;
                                const StatusIcon = status.icon;
                                
                                return (
                                    <motion.div
                                        key={app._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ y: -4, borderColor: '#2563eb', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}
                                        style={{
                                            background: 'white',
                                            padding: '2rem',
                                            borderRadius: '32px',
                                            border: '1px solid #f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '2rem',
                                            flexWrap: 'wrap',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <div style={{ 
                                            width: 64, height: 64, borderRadius: '20px', 
                                            background: '#f8fafc', border: '1px solid #e2e8f0',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.5rem', fontWeight: 900, color: '#0f172a'
                                        }}>
                                            {app.job.company.charAt(0)}
                                        </div>

                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>{app.job.title}</h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={16} /> {app.job.company}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {app.job.location}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', minWidth: 'fit-content' }}>
                                            <div style={{ 
                                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                                padding: '0.5rem 1.25rem', borderRadius: '100px',
                                                background: status.bg, color: status.color, 
                                                fontSize: '0.85rem', fontWeight: 800
                                            }}>
                                                <StatusIcon size={16} strokeWidth={3} /> {status.label.toUpperCase()}
                                            </div>
                                            
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link href={`/jobs/${app.job._id}`}>
                                                    <Button variant="outline" style={{ borderRadius: '12px', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                                                        View Job
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
