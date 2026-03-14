"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, Bookmark, Star, CheckCircle, 
    ArrowRight, MapPin, Calendar, Clock,
    LayoutDashboard, User, Settings, Search,
    Loader2, AlertCircle, TrendingUp
} from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import api from '@/utils/api';

/* ─── Types ─── */
interface AppJob {
    _id: string; title: string; company: string;
    location: string; type: string; salary: string;
}

interface Application {
    _id: string;
    job: AppJob;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
    appliedAt: string;
    coverLetter?: string;
}

interface RecommendedJob {
    _id: string; title: string; company: string;
    location: string; type: string; salary: string;
    createdAt: string;
}

interface DashboardData {
    stats: {
        totalApplications: number;
        totalBookmarks: number;
        pending: number; reviewed: number;
        shortlisted: number; rejected: number; accepted: number;
    };
    completeness: { score: number; missing: string[] };
    applications: Application[];
    recommendedJobs: RecommendedJob[];
    savedJobs: RecommendedJob[];
}

/* ─── Status styling ─── */
const statusStyle: Record<string, { bg: string; color: string; label: string; icon: any }> = {
    pending: { bg: '#fff7ed', color: '#c2410c', label: 'Pending', icon: Clock },
    reviewed: { bg: '#eff6ff', color: '#1d4ed8', label: 'Reviewed', icon: Search },
    shortlisted: { bg: '#f0fdf4', color: '#15803d', label: 'Shortlisted', icon: Star },
    rejected: { bg: '#fef2f2', color: '#b91c1c', label: 'Rejected', icon: AlertCircle },
    accepted: { bg: '#f0fdfa', color: '#0f766e', label: 'Hired', icon: CheckCircle },
};

/* ─── Stat card definitions ─── */
const statCards = [
    { key: 'totalApplications', label: 'Applications', icon: Briefcase, accent: '#2563eb' },
    { key: 'totalBookmarks', label: 'Saved', icon: Bookmark, accent: '#7c3aed' },
    { key: 'shortlisted', label: 'Shortlisted', icon: Star, accent: '#ca8a04' },
    { key: 'accepted', label: 'Hired', icon: CheckCircle, accent: '#059669' },
];

const filterTabs = ['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'] as const;

export default function CandidateDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [appFilter, setAppFilter] = useState<string>('all');

    // Route guard
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'candidate')) {
            router.push(user ? '/dashboard/employer' : '/auth/login');
        }
    }, [user, authLoading, router]);

    // Fetch dashboard data
    useEffect(() => {
        if (!user || user.role !== 'candidate') return;
        (async () => {
            try {
                const { data: d } = await api.get('/dashboard');
                setData(d);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    const filteredApps = useMemo(() => {
        if (!data) return [];
        return appFilter === 'all'
            ? data.applications
            : data.applications.filter(a => a.status === appFilter);
    }, [data, appFilter]);

    if (authLoading || !user || user.role !== 'candidate') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <Loader2 className="spin" size={40} color="#2563eb" />
            </div>
        );
    }

    const stats = data?.stats;
    const completeness = data?.completeness;
    const barColor = (completeness?.score ?? 0) >= 80 ? '#10b981' : (completeness?.score ?? 0) >= 50 ? '#f59e0b' : '#ef4444';

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
                                    background: 'var(--accent-soft)', color: '#2563eb', 
                                    padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800 
                                }}>
                                    CANDIDATE DASHBOARD
                                </span>
                            </div>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
                                Welcome, <span style={{ color: '#2563eb' }}>{user.name?.split(' ')[0]}</span>.
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                                Your career progress is looking sharp. Here's what's happening today.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link href="/dashboard/candidate/profile">
                                <motion.button 
                                    whileHover={{ y: -2 }}
                                    style={{ 
                                        padding: '0.85rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)',
                                        background: 'white', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                >
                                    <User size={18} /> Edit Profile
                                </motion.button>
                            </Link>
                            <Link href="/jobs">
                                <motion.button 
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ 
                                        padding: '0.85rem 2.5rem', borderRadius: '16px', border: 'none',
                                        background: '#0f172a', color: 'white', fontWeight: 800, fontSize: '0.95rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                                        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)'
                                    }}
                                >
                                    Find Jobs <ArrowRight size={18} strokeWidth={3} />
                                </motion.button>
                            </Link>
                        </div>
                    </header>

                    {/* ── Main Dashboard Layout Grid ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
                        
                        {/* LEFT COLUMN: Stats & Applications */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            
                            {/* Analytics Grid */}
                            <div style={{ 
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                                gap: '1.25rem' 
                            }}>
                                {statCards.map((sc, i) => (
                                    <motion.div 
                                        key={sc.key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -5, boxShadow: 'var(--shadow-md)' }}
                                        style={{
                                            padding: '1.75rem', borderRadius: '32px',
                                            border: '1px solid var(--border)', background: 'white',
                                            display: 'flex', flexDirection: 'column', gap: '1.25rem',
                                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                            position: 'relative', overflow: 'hidden'
                                        }}
                                    >
                                        <div style={{
                                            width: 52, height: 52, borderRadius: '16px', 
                                            background: `${sc.accent}10`, color: sc.accent,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <sc.icon size={26} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: '0.5rem' }}>
                                                {loading ? <Loader2 size={24} className="spin" /> : (stats as any)?.[sc.key] ?? 0}
                                            </h3>
                                            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {sc.label}
                                            </p>
                                        </div>
                                        <div style={{
                                            position: 'absolute', right: '-10px', bottom: '-10px',
                                            opacity: 0.03, color: sc.accent
                                        }}>
                                            <sc.icon size={120} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Active Applications Section */}
                            <div style={{ 
                                background: 'white', borderRadius: '40px', padding: '2.5rem',
                                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Application History</h2>
                                        <p style={{ color: '#64748b', fontWeight: 500 }}>Track your live recruitment journeys.</p>
                                    </div>
                                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.35rem', borderRadius: '16px', gap: '0.25rem', overflowX: 'auto' }}>
                                        {filterTabs.slice(0, 4).map(tab => (
                                            <button 
                                                key={tab} 
                                                onClick={() => setAppFilter(tab)}
                                                style={{
                                                    padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', 
                                                    fontWeight: 800, cursor: 'pointer', border: 'none',
                                                    background: appFilter === tab ? 'white' : 'transparent',
                                                    color: appFilter === tab ? '#0f172a' : '#64748b',
                                                    boxShadow: appFilter === tab ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                                    transition: 'all 0.2s', whiteSpace: 'nowrap', textTransform: 'capitalize'
                                                }}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {loading ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} style={{ height: '100px', background: '#f8fafc', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
                                        ))}
                                    </div>
                                ) : filteredApps.length === 0 ? (
                                    <div style={{ 
                                        textAlign: 'center', padding: '5rem 2rem', 
                                        borderRadius: '32px', background: '#f8fafc', border: '2px dashed #e2e8f0' 
                                    }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.5 }}>📂</div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>No records found</h3>
                                        <p style={{ color: '#64748b', marginBottom: '2rem', fontWeight: 500 }}>
                                            You haven't made any applications in this category yet.
                                        </p>
                                        <Link href="/jobs">
                                            <Button size="sm" variant="outline">Browse Opportunities</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <AnimatePresence mode="popLayout">
                                            {filteredApps.map((app, i) => {
                                                const st = statusStyle[app.status] || statusStyle.pending;
                                                return (
                                                    <motion.div 
                                                        key={app._id}
                                                        layout
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        whileHover={{ x: 5, background: '#f8fafc' }}
                                                        style={{
                                                            padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9',
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                            gap: '1.5rem', transition: 'all 0.2s', cursor: 'pointer'
                                                        }}
                                                        onClick={() => router.push(`/jobs/${app.job._id}`)}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                                                            <div style={{ 
                                                                width: 54, height: 54, borderRadius: '16px', 
                                                                background: 'white', border: '1px solid #e2e8f0',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontWeight: 900, color: '#0f172a', fontSize: '1.2rem',
                                                                boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                                                            }}>
                                                                {app.job.company.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>{app.job.title}</h3>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                        <TrendingUp size={14} /> {app.job.company}
                                                                    </span>
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                        <MapPin size={14} /> {app.job.location}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                                            <div style={{ 
                                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                                padding: '0.4rem 1rem', borderRadius: '100px',
                                                                background: st.bg, color: st.color, fontSize: '0.8rem', fontWeight: 800
                                                            }}>
                                                                <st.icon size={14} strokeWidth={3} /> {st.label.toUpperCase()}
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                                                                {new Date(app.appliedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                        {filteredApps.length > 5 && (
                                            <button style={{ 
                                                marginTop: '1rem', background: 'none', border: 'none', 
                                                color: '#2563eb', fontWeight: 800, cursor: 'pointer',
                                                fontSize: '0.95rem', display: 'flex', alignItems: 'center', 
                                                gap: '0.5rem', alignSelf: 'center' 
                                            }}>
                                                View all applications <ArrowRight size={18} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Profile & Saved) */}
                        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            
                            {/* Profile Strength Card */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    padding: '2rem', borderRadius: '40px', background: '#0f172a', color: 'white',
                                    position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)'
                                }}
                            >
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Profile Strength</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: 900, color: barColor }}>{completeness?.score ?? 0}%</span>
                                        <Link href="/dashboard/candidate/profile">
                                            <div style={{ 
                                                width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                            }}>
                                                <ArrowRight size={20} />
                                            </div>
                                        </Link>
                                    </div>
                                    <div style={{ height: 10, borderRadius: '10px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${completeness?.score ?? 0}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            style={{ height: '100%', borderRadius: '10px', background: barColor }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {completeness?.missing.slice(0, 3).map(m => (
                                            <span key={m} style={{ 
                                                fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '8px',
                                                background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 600
                                            }}>+ {m}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ 
                                    position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px',
                                    background: barColor, opacity: 0.15, filter: 'blur(50px)', borderRadius: '50%'
                                }} />
                            </motion.div>

                            {/* Saved Jobs Quicklist */}
                            <div style={{ 
                                background: 'white', borderRadius: '40px', padding: '2rem',
                                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Saved Roles</h3>
                                    <Link href="/jobs" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 800 }}>Visit List</Link>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {data?.savedJobs && data.savedJobs.length > 0 ? (
                                        data.savedJobs.slice(0, 3).map((job, i) => (
                                            <Link href={`/jobs/${job._id}`} key={job._id}>
                                                <motion.div 
                                                    whileHover={{ x: 5 }}
                                                    style={{ 
                                                        display: 'flex', gap: '1rem', alignItems: 'center', 
                                                        borderBottom: i !== 2 ? '1px solid #f1f5f9' : 'none',
                                                        paddingBottom: i !== 2 ? '1.25rem' : '0' 
                                                    }}
                                                >
                                                    <div style={{ 
                                                        width: 44, height: 44, borderRadius: '12px', background: '#f8fafc',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '1rem', fontWeight: 900
                                                    }}>{job.company.charAt(0)}</div>
                                                    <div>
                                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.15rem' }}>{job.title}</h4>
                                                        <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{job.company}</p>
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>No saved jobs yet.</p>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                    
                    {/* ── Recommended Section ── */}
                    {(data?.recommendedJobs?.length ?? 0) > 0 && (
                        <section style={{ marginTop: '5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>Curated Recommendations</h2>
                                    <p style={{ color: '#64748b', fontWeight: 500, fontSize: '1.1rem' }}>Based on your profile and search history.</p>
                                </div>
                                <Link href="/jobs">
                                    <Button variant="outline" size="sm">Explore Insights</Button>
                                </Link>
                            </div>
                            <div style={{ 
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                                gap: '1.5rem' 
                            }}>
                                {data!.recommendedJobs.map((job, i) => (
                                    <motion.div 
                                        key={job._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        style={{
                                            padding: '2rem', borderRadius: '32px', background: 'white',
                                            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                                            display: 'flex', flexDirection: 'column', gap: '1rem',
                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ 
                                                width: 50, height: 50, borderRadius: '14px', background: 'var(--accent-soft)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.2rem', fontWeight: 900, color: '#2563eb'
                                            }}>{job.company.charAt(0)}</div>
                                            <div style={{ 
                                                padding: '0.4rem 0.8rem', borderRadius: '10px', 
                                                background: '#f8fafc', fontSize: '0.75rem', fontWeight: 800, color: '#475569' 
                                            }}>{job.type}</div>
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{job.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>{job.company} · {job.location}</p>
                                        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>{job.salary}</span>
                                            <Link href={`/jobs/${job._id}`}>
                                                <motion.button 
                                                    whileHover={{ x: 3 }}
                                                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                                >
                                                    View <ArrowRight size={16} />
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
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
                    div[style*="grid-template-columns: 1fr 340px"] {
                        grid-template-columns: 1fr !important;
                    }
                    aside {
                        order: -1;
                        flex-direction: row !important;
                        flex-wrap: wrap;
                    }
                    aside > div, aside > motion.div {
                        flex: 1;
                        min-width: 300px;
                    }
                }
                @media (max-width: 768px) {
                    aside {
                        flex-direction: column !important;
                    }
                    header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                    }
                }
            `}</style>
        </div>
    );
}
