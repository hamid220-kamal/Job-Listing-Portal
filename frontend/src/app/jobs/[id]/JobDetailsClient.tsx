"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { CheckCircle, Heart, MapPin, Briefcase, DollarSign, Clock, ArrowLeft, Share2, Loader2, Sparkles, Building2 } from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    salary: string;
    description: string;
    requirements: string[];
    createdAt: string;
    postedAt: string;
}

export default function JobDetailsClient() {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applicationData, setApplicationData] = useState({ resume: '', coverLetter: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/jobs/${id}/apply`, applicationData);
            setSuccess(true);
            toast.success("Application submitted successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBookmark = async () => {
        setBookmarkLoading(true);
        try {
            const { data } = await api.post(`/profile/bookmarks/${id}`);
            setBookmarked(data.bookmarked);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setBookmarkLoading(false);
        }
    };

    useEffect(() => {
        const fetchJobAndUser = async () => {
            try {
                const [jobRes, profileRes] = await Promise.all([
                    api.get(`/jobs/${id}`),
                    api.get('/profile').catch(() => ({ data: { bookmarks: [] } }))
                ]);
                setJob(jobRes.data);
                if (profileRes.data?.bookmarks) {
                    setBookmarked(profileRes.data.bookmarks.includes(id as string));
                }
            } catch (error) {
                console.error('Error fetching details:', error);
                setJob(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobAndUser();
        }
    }, [id]);

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 size={40} color="#2563eb" />
            </motion.div>
            <span style={{ fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' }}>ORCHESTRATING DETAILS...</span>
        </div>
    );
    if (!job) return notFound();

    return (
        <div style={{ background: '#fff', minHeight: '100vh', padding: '6rem 0' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '5rem', alignItems: 'start' }}>
                <article>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '3.5rem' }}>
                        <Link href="/jobs" style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                            color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', fontWeight: 800,
                            marginBottom: '2rem', transition: 'color 0.3s'
                        }} className="hover-blue">
                            <ArrowLeft size={18} strokeWidth={3} /> BACK TO DISCOVERY
                        </Link>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
                            <div>
                                <h1 style={{ fontSize: '4rem', fontWeight: 950, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.05em', lineHeight: 1 }}>
                                    {job.title}
                                </h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', color: '#2563eb', fontWeight: 800 }}>
                                    <Building2 size={24} /> {job.company}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <motion.button 
                                    whileHover={{ scale: 1.15, rotate: 10 }}
                                    whileTap={{ scale: 0.85 }}
                                    onClick={handleBookmark}
                                    disabled={bookmarkLoading}
                                    style={{
                                        width: '56px', height: '56px', borderRadius: '18px',
                                        background: bookmarked ? '#fff1f2' : '#f8fafc',
                                        border: '1px solid #f1f5f9',
                                        color: bookmarked ? '#ef4444' : '#94a3b8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.4s'
                                    }}
                                >
                                    <Heart size={24} fill={bookmarked ? '#ef4444' : 'none'} strokeWidth={bookmarked ? 0 : 2.5} />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.15, rotate: -10 }}
                                    style={{
                                        width: '56px', height: '56px', borderRadius: '18px',
                                        background: '#f8fafc', border: '1px solid #f1f5f9', color: '#94a3b8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Share2 size={24} strokeWidth={2.5} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
                        {[
                            { label: job.location, icon: MapPin, color: '#2563eb', bg: '#eff6ff' },
                            { label: job.type, icon: Briefcase, color: '#7c3aed', bg: '#f5f3ff' },
                            { label: job.category, icon: Sparkles, color: '#0891b2', bg: '#ecfeff' },
                            { label: job.salary, icon: DollarSign, color: '#059669', bg: '#ecfdf5' }
                        ].map((tag, i) => (
                            <motion.span 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.3 }}
                                key={i} 
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    backgroundColor: tag.bg, color: tag.color, 
                                    padding: '0.75rem 1.5rem', borderRadius: '16px', 
                                    fontSize: '1rem', fontWeight: 800,
                                    border: `1px solid ${tag.color}15`
                                }}
                            >
                                <tag.icon size={18} strokeWidth={3} />
                                {tag.label}
                            </motion.span>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{ 
                            background: 'white', padding: '4rem', borderRadius: '48px', 
                            border: '1px solid #f1f5f9', boxShadow: '0 20px 60px rgba(0,0,0,0.02)' 
                        }}>
                        <section style={{ marginBottom: '4.5rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '2rem', color: '#0f172a', letterSpacing: '-0.03em' }}>Role Architecture</h2>
                            <div style={{ lineHeight: 1.9, color: '#475569', fontSize: '1.2rem', whiteSpace: 'pre-line' }}>
                                {job.description}
                            </div>
                        </section>

                        {job.requirements && job.requirements.length > 0 && (
                            <section>
                                <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '2rem', color: '#0f172a', letterSpacing: '-0.03em' }}>Candidate Requirements</h2>
                                <div style={{ display: 'grid', gap: '1.25rem' }}>
                                    {job.requirements.map((req, index) => (
                                        <div key={index} style={{ 
                                            display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                                            color: '#475569', fontSize: '1.15rem', lineHeight: 1.6,
                                            padding: '1.5rem', borderRadius: '20px', background: '#f8fafc',
                                            border: '1px solid #f1f5f9'
                                        }}>
                                            <div style={{ 
                                                marginTop: '0.25rem', width: '24px', height: '24px', 
                                                borderRadius: '50%', background: '#dcfce7', color: '#059669',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                                            }}>
                                                <CheckCircle size={14} strokeWidth={3} />
                                            </div>
                                            {req}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>
                </article>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ position: 'sticky', top: '8rem' }}
                >
                    <div style={{ 
                        padding: '3rem', background: '#0f172a', borderRadius: '48px', 
                        color: 'white', boxShadow: '0 30px 60px rgba(15, 23, 42, 0.2)',
                        overflow: 'hidden', position: 'relative'
                    }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h3 style={{ fontSize: '1.85rem', fontWeight: 950, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Initiate Application</h3>
                            <p style={{ color: '#94a3b8', marginBottom: '2.5rem', lineHeight: 1.7, fontSize: '1.05rem', fontWeight: 500 }}>
                                You are about to enter the selection process for this elite role at <strong>{job.company}</strong>.
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Button 
                                    onClick={() => setIsModalOpen(true)}
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    style={{ height: '72px', borderRadius: '20px', fontSize: '1.1rem' }}
                                >
                                    Proceed to Apply
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={handleBookmark}
                                    disabled={bookmarkLoading}
                                    size="lg"
                                    fullWidth
                                    style={{ height: '72px', borderRadius: '20px', borderColor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1.1rem' }}
                                >
                                    {bookmarkLoading ? '...' : bookmarked ? 'Saved to Bookmarks' : 'Save for Later'}
                                </Button>
                            </div>
                            
                            <div style={{ 
                                marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                color: '#64748b', fontSize: '0.95rem', fontWeight: 800
                            }}>
                                <Clock size={18} strokeWidth={3} /> POSTED {job.postedAt || new Date(job.createdAt).toLocaleDateString().toUpperCase()}
                            </div>
                        </div>

                        {/* Subtle Background Glow */}
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'rgba(37,99,235,0.2)', filter: 'blur(80px)', borderRadius: '50%' }} />
                    </div>
                </motion.div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={success ? "Success" : `Apply to ${job?.company}`}>
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '2rem' }}
                        >
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <CheckCircle size={40} strokeWidth={3} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a' }}>Application Transmitted!</h2>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>Your credentials have been securely transmitted to <strong>{job.company}</strong>.</p>
                            <div style={{ marginTop: '2.5rem' }}>
                                <Button onClick={() => setIsModalOpen(false)} fullWidth size="lg">Return to Dashboard</Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleApply} 
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Professional Assets (Portfolio/Resume Link)</label>
                                <Input 
                                    placeholder="https://cloud.storage/path/to/resume-portfolio" 
                                    value={applicationData.resume} 
                                    onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Professional Narrative</label>
                                <textarea 
                                    rows={6} 
                                    placeholder="Briefly describe your value proposition for this role..." 
                                    value={applicationData.coverLetter} 
                                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })} 
                                    style={{ 
                                        width: '100%', padding: '1.25rem', borderRadius: '20px', 
                                        border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', 
                                        color: '#0f172a', fontSize: '1rem', fontWeight: 500,
                                        resize: 'vertical', outline: 'none', transition: 'all 0.3s' 
                                    }} 
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="button" variant="secondary" size="lg" onClick={() => setIsModalOpen(false)} fullWidth>Cancel</Button>
                                <Button type="submit" size="lg" fullWidth disabled={submitting}>{submitting ? 'Transmitting...' : 'Send Application'}</Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </Modal>
            </div>
            
            <style jsx>{`
                .hover-blue:hover { color: #2563eb !important; }
                textarea:focus { border-color: #2563eb !important; background: white !important; }
            `}</style>
        </div>
    );
}
