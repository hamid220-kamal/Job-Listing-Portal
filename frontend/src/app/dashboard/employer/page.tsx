"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Briefcase, Users, Star, CheckCircle, 
    ChevronRight, MapPin, Calendar, Clock,
    Search, Loader2, AlertCircle, TrendingUp,
    Building2, Filter, MoreHorizontal, ExternalLink,
    Mail, User as UserIcon, FileText
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import api from '@/utils/api';
import toast from 'react-hot-toast';

/* ─── Types ─── */
interface Job {
    _id: string; title: string; company: string;
    location: string; type: string; salary: string;
    createdAt: string; status: 'active' | 'closed' | 'draft';
}

interface Applicant {
    _id: string; name: string; email: string;
    avatar?: string; headline?: string; skills?: string[];
}

interface Application {
    _id: string;
    applicant: Applicant;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
    appliedAt: string;
    resume?: string;
    coverLetter?: string;
}

/* ─── Status styling ─── */
const statusStyle: Record<string, { bg: string; color: string; label: string; icon: any }> = {
    pending: { bg: '#fff7ed', color: '#c2410c', label: 'Pending', icon: Clock },
    reviewed: { bg: '#eff6ff', color: '#1d4ed8', label: 'Reviewed', icon: Search },
    shortlisted: { bg: '#f0fdf4', color: '#15803d', label: 'Shortlisted', icon: Star },
    rejected: { bg: '#fef2f2', color: '#b91c1c', label: 'Rejected', icon: AlertCircle },
    accepted: { bg: '#f0fdfa', color: '#0f766e', label: 'Accepted', icon: CheckCircle },
};

export default function EmployerDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<Application[]>([]);
    const [appsLoading, setAppsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Route guard
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'employer')) {
            router.push(user ? '/dashboard/candidate' : '/auth/login');
        }
    }, [user, authLoading, router]);

    // Fetch employer's jobs
    useEffect(() => {
        if (!user || user.role !== 'employer') return;
        (async () => {
            try {
                const { data } = await api.get('/jobs/mine');
                setJobs(data);
                if (data.length > 0) setSelectedJobId(data[0]._id);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
                toast.error('Could not load your jobs');
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    // Fetch applicants for selected job
    useEffect(() => {
        if (!selectedJobId) { setApplicants([]); return; }
        let cancelled = false;
        (async () => {
            setAppsLoading(true);
            try {
                const { data } = await api.get(`/applications/job/${selectedJobId}`);
                if (!cancelled) setApplicants(data);
            } catch {
                if (!cancelled) setApplicants([]);
            } finally {
                if (!cancelled) setAppsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [selectedJobId]);

    // Toggle Job Status
    const toggleJobStatus = async (jobId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        setUpdatingId(jobId);
        try {
            await api.patch(`/jobs/${jobId}`, { status: newStatus });
            setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus as any } : j));
            toast.success(`Job marked as ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update job status');
        } finally {
            setUpdatingId(null);
        }
    };

    // Update application status
    const updateStatus = async (appId: string, status: string) => {
        setUpdatingId(appId);
        try {
            const { data } = await api.patch(`/applications/${appId}/status`, { status });
            setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status: data.status } : a));
            toast.success(`Applicant marked as ${status}`);
        } catch (err) {
            toast.error('Status update failed');
        } finally {
            setUpdatingId(null);
        }
    };

    const statusCounts = useMemo(() => {
        const c = { pending: 0, reviewed: 0, shortlisted: 0, rejected: 0, accepted: 0 };
        applicants.forEach(a => { if (c[a.status] !== undefined) c[a.status]++; });
        return c;
    }, [applicants]);

    if (authLoading || !user || user.role !== 'employer') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <Loader2 className="spin" size={40} color="#2563eb" />
            </div>
        );
    }

    const statCardsSummary = [
        { label: 'Active Postings', icon: Building2, value: jobs.filter(j => j.status === 'active').length, accent: '#2563eb' },
        { label: 'Total Applicants', icon: Users, value: applicants.length, accent: '#7c3aed' },
        { label: 'Shortlisted', icon: Star, value: statusCounts.shortlisted, accent: '#ca8a04' },
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* ── Dashboard Header ── */}
                    <header style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
                        marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' 
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <span style={{ 
                                    background: '#eff6ff', color: '#2563eb', 
                                    padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800 
                                }}>
                                    EMPLOYER CONSOLE
                                </span>
                            </div>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
                                Hiring at <span style={{ color: '#2563eb' }}>{user.name?.split(' ')[0]}</span>.
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                                Find your next star performer. Manage jobs and review talent.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link href="/dashboard/employer/profile">
                                <motion.button 
                                    whileHover={{ y: -2 }}
                                    style={{ 
                                        padding: '0.85rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0',
                                        background: 'white', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <Building2 size={18} /> Company info
                                </motion.button>
                            </Link>
                            <Link href="/jobs/new">
                                <motion.button 
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ 
                                        padding: '0.85rem 2rem', borderRadius: '16px', border: 'none',
                                        background: '#0f172a', color: 'white', fontWeight: 800, fontSize: '0.95rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                                        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)'
                                    }}
                                >
                                    <Plus size={20} strokeWidth={3} /> Post New Job
                                </motion.button>
                            </Link>
                        </div>
                    </header>

                    {/* ── Sub-header Stats ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {statCardsSummary.map((sc, i) => (
                            <motion.div 
                                key={sc.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                                style={{
                                    padding: '1.5rem', borderRadius: '24px', background: 'white',
                                    border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.25rem',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                                }}
                            >
                                <div style={{ 
                                    width: 48, height: 48, borderRadius: '14px', 
                                    background: `${sc.accent}10`, color: sc.accent,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <sc.icon size={22} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{sc.value}</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{sc.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── Main Workspace ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '2.5rem', alignItems: 'start' }}>
                        
                        {/* LEFT: JOB LISTINGS */}
                        <aside>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Active Postings</h2>
                                <Filter size={18} color="#64748b" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {loading ? (
                                    [1, 2, 3].map(i => <div key={i} style={{ height: '80px', borderRadius: '20px', background: '#f1f5f9', animation: 'pulse 1.5s infinite' }} />)
                                ) : jobs.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '32px', border: '1px dashed #cbd5e1' }}>
                                        <p style={{ fontWeight: 700, color: '#475569' }}>No jobs yet</p>
                                    </div>
                                ) : (
                                    jobs.map((job) => (
                                        <motion.div 
                                            key={job._id}
                                            whileHover={{ x: 4 }}
                                            onClick={() => setSelectedJobId(job._id)}
                                            style={{
                                                padding: '1.5rem', borderRadius: '24px', cursor: 'pointer',
                                                background: selectedJobId === job._id ? '#0f172a' : 'white',
                                                color: selectedJobId === job._id ? 'white' : '#0f172a',
                                                border: '1px solid',
                                                borderColor: selectedJobId === job._id ? '#0f172a' : '#f1f5f9',
                                                boxShadow: selectedJobId === job._id ? '0 15px 30px rgba(15, 23, 42, 0.2)' : '0 4px 10px rgba(0,0,0,0.02)',
                                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontWeight: 800, fontSize: '1rem', flex: 1, paddingRight: '0.5rem' }}>{job.title}</h3>
                                                <div style={{ 
                                                    padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800,
                                                    background: job.status === 'active' ? (selectedJobId === job._id ? 'rgba(255,255,255,0.2)' : '#d1fae5') : '#f1f5f9',
                                                    color: job.status === 'active' ? (selectedJobId === job._id ? 'white' : '#065f46') : '#71717a'
                                                }}>
                                                    {job.status.toUpperCase()}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', color: selectedJobId === job._id ? 'rgba(255,255,255,0.6)' : '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} /> {job.location}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={12} /> {new Date(job.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            
                                            {selectedJobId === job._id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); toggleJobStatus(job._id, job.status); }}
                                                        style={{ 
                                                            flex: 1, padding: '0.6rem', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', 
                                                            color: 'white', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' 
                                                        }}
                                                    >
                                                        {job.status === 'active' ? 'Archive' : 'Activate'}
                                                    </button>
                                                    <Link href={`/jobs/${job._id}`} style={{ flex: 1 }}>
                                                        <button style={{ 
                                                            width: '100%', padding: '0.6rem', borderRadius: '10px', background: 'white', 
                                                            color: '#0f172a', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' 
                                                        }}>
                                                            Public View
                                                        </button>
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </aside>

                        {/* RIGHT: APPLICANTS PANEL */}
                        <main>
                            <div style={{ 
                                background: 'white', borderRadius: '40px', padding: '2.5rem',
                                border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                                minHeight: '600px'
                            }}>
                                {selectedJobId ? (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                            <div>
                                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                                    {applicants.length} Applicants
                                                </h2>
                                                <p style={{ color: '#64748b', fontWeight: 500 }}>for {jobs.find(j => j._id === selectedJobId)?.title}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {Object.keys(statusStyle).slice(0, 3).map(key => (
                                                    <div key={key} style={{ 
                                                        padding: '0.4rem 0.8rem', borderRadius: '10px', background: statusStyle[key].bg, 
                                                        color: statusStyle[key].color, fontSize: '0.7rem', fontWeight: 800 
                                                    }}>
                                                        {(statusCounts as any)[key]} {statusStyle[key].label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {appsLoading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
                                                <Loader2 size={40} className="spin" color="#2563eb" />
                                            </div>
                                        ) : applicants.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>🔍</div>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>No applications yet</h3>
                                                <p style={{ color: '#64748b' }}>We'll notify you as soon as someone applies!</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                                <AnimatePresence mode="popLayout">
                                                    {applicants.map((app, i) => {
                                                        const st = statusStyle[app.status] || statusStyle.pending;
                                                        return (
                                                            <motion.div 
                                                                key={app._id}
                                                                layout
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, x: 20 }}
                                                                transition={{ delay: i * 0.05 }}
                                                                style={{
                                                                    padding: '2rem', borderRadius: '32px', background: 'white',
                                                                    border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                                                                    display: 'flex', flexDirection: 'column', gap: '1.5rem',
                                                                    position: 'relative'
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                                                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                                                                        <div style={{ 
                                                                            width: 56, height: 56, borderRadius: '18px', 
                                                                            background: '#f8fafc', border: '1px solid #e2e8f0',
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                            overflow: 'hidden'
                                                                        }}>
                                                                            {app.applicant.avatar ? (
                                                                                <img src={app.applicant.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                            ) : <UserIcon size={24} color="#94a3b8" />}
                                                                        </div>
                                                                        <div>
                                                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>{app.applicant.name}</h3>
                                                                            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{app.applicant.headline || 'Product Designer'}</p>
                                                                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                                                                <a href={`mailto:${app.applicant.email}`} style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 700 }}>
                                                                                    <Mail size={12} /> Email
                                                                                </a>
                                                                                <Link href={`/profile/candidate/${app.applicant._id}`} target="_blank" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 700 }}>
                                                                                    <ExternalLink size={12} /> Profile
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                                                        <div style={{ 
                                                                            padding: '0.5rem 1rem', borderRadius: '12px', background: st.bg, color: st.color, 
                                                                            fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' 
                                                                        }}>
                                                                            <st.icon size={14} strokeWidth={3} /> {st.label.toUpperCase()}
                                                                        </div>
                                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>

                                                                {(app.coverLetter || app.resume) && (
                                                                    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                                                        {app.coverLetter && (
                                                                            <div style={{ marginBottom: app.resume ? '1rem' : 0 }}>
                                                                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                                    <FileText size={14} /> Motivation
                                                                                </h4>
                                                                                <p style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: 1.6 }}>{app.coverLetter}</p>
                                                                            </div>
                                                                        )}
                                                                        {app.resume && (
                                                                            <motion.a 
                                                                                whileHover={{ scale: 1.02 }}
                                                                                href={app.resume} 
                                                                                target="_blank" 
                                                                                style={{ 
                                                                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                                                                    padding: '0.75rem 1.25rem', background: 'white', borderRadius: '14px',
                                                                                    color: '#0f172a', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 800,
                                                                                    border: '1px solid #e2e8f0', marginTop: app.coverLetter ? '0.5rem' : 0
                                                                                }}
                                                                            >
                                                                                📄 DOWNLOAD CV
                                                                            </motion.a>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                                                    {app.status !== 'shortlisted' && app.status !== 'accepted' && (
                                                                        <motion.button 
                                                                            whileHover={{ scale: 1.02 }}
                                                                            onClick={() => updateStatus(app._id, 'shortlisted')}
                                                                            style={{ flex: 1, padding: '0.9rem', borderRadius: '16px', background: '#f0fdf4', color: '#15803d', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                                                                        >Shortlist candidate</motion.button>
                                                                    )}
                                                                    {app.status !== 'accepted' && (
                                                                        <motion.button 
                                                                            whileHover={{ scale: 1.02 }}
                                                                            onClick={() => updateStatus(app._id, 'accepted')}
                                                                            style={{ flex: 1, padding: '0.9rem', borderRadius: '16px', background: '#0f172a', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                                                                        >Hire applicant</motion.button>
                                                                    )}
                                                                    {app.status !== 'rejected' && (
                                                                        <button 
                                                                            onClick={() => updateStatus(app._id, 'rejected')}
                                                                            style={{ padding: '0.9rem 1.5rem', borderRadius: '16px', background: 'none', color: '#ef4444', border: '1px solid #fee2e2', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                                                                        >Reject</button>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                                        <Building2 size={80} strokeWidth={1} style={{ marginBottom: '1.5rem' }} />
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Select a job to see applicants</h3>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>

                </motion.div>
            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 360px 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                    aside {
                        position: relative !important;
                        top: 0 !important;
                    }
                }
                @media (max-width: 768px) {
                    header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                    }
                }
            `}</style>
        </div>
    );
}
