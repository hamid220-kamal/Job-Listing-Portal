"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Button from '@/components/Button';
import { 
    Building2, MapPin, Globe, Mail, Phone, Users, 
    Briefcase, ExternalLink, Linkedin, Twitter, 
    Facebook, LayoutDashboard, ChevronRight,
    Search, Sparkles, CheckCircle2, TrendingUp,
    Clock
} from 'lucide-react';

interface Profile {
    _id: string; name: string; email: string; phone: string;
    company: string; companyDescription: string;
    industry: string; companySize: string;
    website: string; logo: string;
    companyBenefits: string[];
    companySocialLinks: { linkedin: string; twitter: string; facebook: string };
    location: { city: string; state: string; country: string };
}

interface Job {
    _id: string;
    title: string;
    location: string;
    type: string;
    salary: string;
    createdAt: string;
    status: string;
}

export default function EmployerProfileClient({ profile: initialProfile, id }: { profile: Profile | null, id: string }) {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(!initialProfile);

    const isOwnProfile = user && user._id === id;

    useEffect(() => {
        (async () => {
            try {
                if (!initialProfile) {
                    const { data } = await api.get(`/profile/${id}`);
                    setProfile(data);
                }
                const jobsRes = await api.get(`/jobs/employer/${id}`);
                setJobs(jobsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, initialProfile]);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <div style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%' }} />
            </motion.div>
        </div>
    );

    if (!profile) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: '#f8fafc' }}>
            <div style={{ fontSize: '4rem' }}>🏗️</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Company Not Found</h1>
            <p style={{ color: '#64748b' }}>The organization profile you're looking for doesn't exist.</p>
            <Link href="/"><Button variant="outline">Return Home</Button></Link>
        </div>
    );

    const loc = [profile.location?.city, profile.location?.country].filter(Boolean).join(', ');

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '8rem' }}>
            
            {/* ── Premium Hero ── */}
            <div style={{ 
                height: '400px', background: '#0f172a', position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'flex-end', paddingBottom: '3rem'
            }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: 'radial-gradient(circle at 20% 50%, #2563eb 0%, transparent 70%), radial-gradient(circle at 80% 50%, #7c3aed 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.8) 100%)' }} />
                
                <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5rem', flexWrap: 'wrap' }}>
                        {profile.logo ? (
                            <motion.img 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={profile.logo} 
                                alt={profile.company} 
                                style={{ 
                                    width: '160px', height: '160px', borderRadius: '40px', background: '#fff', 
                                    padding: '1.5rem', objectFit: 'contain', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }} 
                            />
                        ) : (
                            <div style={{ 
                                width: '160px', height: '160px', borderRadius: '40px', 
                                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                fontSize: '4rem', border: '1px solid rgba(255,255,255,0.2)'
                            }}>🏢</div>
                        )}
                        
                        <div style={{ flex: 1, minWidth: '300px', paddingBottom: '0.5rem' }}>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
                                    {profile.company || profile.name}
                                </h1>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 600 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building2 size={18} /> {profile.industry || 'Technology'}</span>
                                    {loc && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> {loc}</span>}
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> {profile.companySize || '100+'} Team Members</span>
                                </div>
                            </motion.div>
                        </div>

                        {isOwnProfile && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                <Link href="/dashboard/employer/profile">
                                    <Button variant="outline" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                                        Update Public Profile
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1200px', marginTop: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>
                    
                    {/* ── Main Content ── */}
                    <main style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        
                        {/* About Section */}
                        <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ background: 'white', padding: '3rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}
                        >
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem' }}>The Mission</h2>
                            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-line', fontWeight: 500 }}>
                                {profile.companyDescription || `${profile.company} is transforming the industry with a commitment to innovation, excellence, and a people-first culture.`}
                            </p>

                            {profile.companyBenefits?.length > 0 && (
                                <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid #f1f5f9' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Sparkles size={20} color="#2563eb" /> Why Join Our Team?
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {profile.companyBenefits.map((b, i) => (
                                            <div key={i} style={{ 
                                                padding: '1rem 1.25rem', borderRadius: '16px', background: '#f8fafc',
                                                display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', 
                                                fontWeight: 700, color: '#475569', border: '1px solid #f1f5f9'
                                            }}>
                                                <CheckCircle2 size={16} color="#10b981" /> {b}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        {/* Open Positions */}
                        <section>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Open Positions</h2>
                                    <p style={{ color: '#64748b', fontWeight: 600 }}>We're looking for passionate talent to join our journey.</p>
                                </div>
                                <div style={{ 
                                    padding: '0.5rem 1rem', borderRadius: '12px', background: '#eff6ff', 
                                    color: '#2563eb', fontSize: '0.85rem', fontWeight: 800 
                                }}>
                                    {jobs.filter(j => j.status !== 'closed').length} LIVE OPENINGS
                                </div>
                            </div>
                            
                            {jobs.length === 0 ? (
                                <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'white', borderRadius: '40px', border: '1px dashed #cbd5e1' }}>
                                    <Briefcase size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 700, color: '#64748b' }}>No active roles found.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {jobs.filter(j => j.status !== 'closed').map((job, i) => (
                                        <Link key={job._id} href={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                                            <motion.div 
                                                whileHover={{ x: 8, borderColor: '#2563eb', background: '#f8fafc' }}
                                                style={{ 
                                                    padding: '2rem', borderRadius: '32px', background: 'white', 
                                                    border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                <div>
                                                    <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.4rem' }}>{job.title}</h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {job.location}</span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {job.type}</span>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                    <div>
                                                        <p style={{ fontWeight: 900, color: '#059669', fontSize: '1.1rem' }}>{job.salary}</p>
                                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginTop: '0.2rem' }}>POSTED {new Date(job.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
                                                        <ChevronRight size={20} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>
                    </main>

                    {/* ── Sidebar ── */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Quick Connect */}
                        <div style={{ 
                            background: 'white', borderRadius: '40px', padding: '2.5rem',
                            border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem' }}>Organization Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                {profile.website && (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Globe size={18} /></div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.05em' }}>Official Website</p>
                                            <a href={profile.website} target="_blank" style={{ fontSize: '0.95rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>{profile.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Mail size={18} /></div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.05em' }}>Work Email</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{profile.email}</p>
                                    </div>
                                </div>
                                {profile.phone && (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Phone size={18} /></div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.05em' }}>HQ Contact</p>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{profile.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid #f1f5f9' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Ecosystem</p>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {profile.companySocialLinks?.linkedin && <SocialIcon href={profile.companySocialLinks.linkedin} icon={Linkedin} color="#0077b5" />}
                                    {profile.companySocialLinks?.twitter && <SocialIcon href={profile.companySocialLinks.twitter} icon={Twitter} color="#1DA1F2" />}
                                    {profile.companySocialLinks?.facebook && <SocialIcon href={profile.companySocialLinks.facebook} icon={Facebook} color="#1877F2" />}
                                </div>
                            </div>
                        </div>

                        {/* Stats / Trending */}
                        <div style={{ 
                            padding: '2rem', borderRadius: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white'
                        }}>
                            <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <TrendingUp size={22} color="#10b981" />
                            </div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Hiring Insights</h4>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, lineHeight: 1.6 }}>
                                This company is actively growing and looking for new talent to join their {profile.location?.city} headquarters.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            <style jsx global>{`
                @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 1fr 360px"] {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (max-width: 768px) {
                    h1 { font-size: 2.25rem !important; }
                }
            `}</style>
        </div>
    );
}

function SocialIcon({ href, icon: Icon, color }: { href: string; icon: any; color: string }) {
    return (
        <motion.a 
            href={href} 
            target="_blank" 
            whileHover={{ y: -4, scale: 1.1 }}
            style={{ 
                width: 44, height: 44, borderRadius: '14px', background: '#f8fafc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b', border: '1px solid #e2e8f0', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = color)}
            onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
        >
            <Icon size={20} />
        </motion.a>
    );
}
