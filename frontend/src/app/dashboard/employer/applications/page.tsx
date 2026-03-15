"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, XCircle, Search, 
    FileText, Mail, User as UserIcon,
    Calendar, MapPin, Briefcase,
    ExternalLink, Filter, TrendingUp,
    Star, Clock, AlertCircle, Loader2
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Application {
    _id: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
    appliedAt: string;
    resume?: string;
    coverLetter?: string;
    applicant: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        headline?: string;
    };
    job: {
        _id: string;
        title: string;
        location: string;
    };
}

const statusStyle: Record<string, { bg: string; color: string; label: string; icon: any }> = {
    pending: { bg: '#fff7ed', color: '#c2410c', label: 'Pending', icon: Clock },
    reviewed: { bg: '#eff6ff', color: '#1d4ed8', label: 'Reviewed', icon: Search },
    shortlisted: { bg: '#f0fdf4', color: '#15803d', label: 'Shortlisted', icon: Star },
    rejected: { bg: '#fef2f2', color: '#b91c1c', label: 'Rejected', icon: AlertCircle },
    accepted: { bg: '#f0fdfa', color: '#0f766e', label: 'Accepted', icon: CheckCircle },
};

export default function EmployerApplicationsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'employer')) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('/applications/employer');
            setApplications(data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchApplications();
    }, [user]);

    const handleUpdateStatus = async (appId: string, status: string) => {
        setUpdatingId(appId);
        try {
            await api.patch(`/applications/${appId}/status`, { status });
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: status as any } : a));
            toast.success(`Candidate marked as ${status}`);
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredApplications = applications.filter(app => 
        filter === 'all' ? true : app.status === filter
    );

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="spin" size={40} color="#2563eb" />
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
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>
                            Talent <span style={{ color: '#2563eb' }}>Applications</span>
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                            Review and manage candidates across all your job postings.
                        </p>
                    </div>

                    <div style={{ display: 'flex', background: 'white', padding: '0.5rem', borderRadius: '18px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        {['all', 'pending', 'shortlisted', 'accepted'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '0.6rem 1.25rem', borderRadius: '12px', border: 'none',
                                    background: filter === f ? '#0f172a' : 'transparent',
                                    color: filter === f ? 'white' : '#64748b',
                                    fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {filteredApplications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '10rem 2rem', background: 'white', borderRadius: '40px', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.2 }}>🎯</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>No applications found</h2>
                            <p style={{ color: '#64748b', fontWeight: 500 }}>
                                {filter === 'all' 
                                    ? "You haven't received any applications for your jobs yet." 
                                    : `No candidates currently match the "${filter}" status.`}
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredApplications.map((app, i) => {
                                const st = statusStyle[app.status] || statusStyle.pending;
                                return (
                                    <motion.div
                                        key={app._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{
                                            background: 'white', padding: '2.5rem', borderRadius: '40px',
                                            border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                            display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '2rem'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '2rem' }}>
                                            <div style={{ 
                                                width: 80, height: 80, borderRadius: '24px', 
                                                background: '#f8fafc', border: '1px solid #e2e8f0',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden', flexShrink: 0
                                            }}>
                                                {app.applicant.avatar ? (
                                                    <img src={app.applicant.avatar} alt={app.applicant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : <UserIcon size={32} color="#94a3b8" />}
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{app.applicant.name}</h3>
                                                        <div style={{ 
                                                            padding: '0.4rem 0.8rem', borderRadius: '10px', background: st.bg, color: st.color, 
                                                            fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' 
                                                        }}>
                                                            <st.icon size={12} strokeWidth={3} /> {st.label.toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>{app.applicant.headline || 'Product Designer'}</p>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        <Briefcase size={16} /> <span style={{ color: '#0f172a' }}>{app.job.title}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        <MapPin size={16} /> {app.job.location}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        <Calendar size={16} /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {app.coverLetter && (
                                                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9', marginTop: '0.5rem' }}>
                                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Cover Letter Snippet</h4>
                                                        <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>{app.coverLetter}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                {app.resume && (
                                                    <a href={app.resume} target="_blank" style={{ textDecoration: 'none' }}>
                                                        <Button variant="outline" style={{ width: '100%', borderRadius: '14px', gap: '0.5rem', fontSize: '0.85rem' }}>
                                                            <FileText size={16} /> Resume
                                                        </Button>
                                                    </a>
                                                )}
                                                <Link href={`/profile/candidate/${app.applicant._id}`} target="_blank" style={{ textDecoration: 'none' }}>
                                                    <Button variant="outline" style={{ width: '100%', borderRadius: '14px', gap: '0.5rem', fontSize: '0.85rem' }}>
                                                        <ExternalLink size={16} /> Profile
                                                    </Button>
                                                </Link>
                                            </div>

                                            <div style={{ height: '1px', background: '#f1f5f9', margin: '0.5rem 0' }} />

                                            {app.status === 'pending' && (
                                                <Button 
                                                    onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                                                    disabled={updatingId === app._id}
                                                    variant="primary" 
                                                    style={{ width: '100%', borderRadius: '14px', background: '#0f172a' }}
                                                >
                                                    Shortlist Candidate
                                                </Button>
                                            )}

                                            {app.status === 'shortlisted' && (
                                                <Button 
                                                    onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                                    disabled={updatingId === app._id}
                                                    variant="primary" 
                                                    style={{ width: '100%', borderRadius: '14px', background: '#10b981', border: 'none' }}
                                                >
                                                    Hiring Applicant
                                                </Button>
                                            )}

                                            {app.status !== 'rejected' && app.status !== 'accepted' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                                    disabled={updatingId === app._id}
                                                    style={{ 
                                                        width: '100%', padding: '0.75rem', borderRadius: '14px', border: '1px solid #fee2e2',
                                                        background: 'transparent', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' 
                                                    }}
                                                >
                                                    Mark as Rejected
                                                </button>
                                            )}
                                            
                                            <a href={`mailto:${app.applicant.email}`} style={{ textDecoration: 'none' }}>
                                                <button style={{ 
                                                    width: '100%', padding: '0.75rem', borderRadius: '14px', border: 'none',
                                                    background: '#eff6ff', color: '#2563eb', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                                }}>
                                                    <Mail size={16} /> Contact Candidate
                                                </button>
                                            </a>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>

            <style jsx global>{`
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 992px) {
                    div[style*="grid-template-columns: minmax(0, 1fr) auto"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
