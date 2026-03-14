"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Button from '@/components/Button';
import { 
    Mail, MapPin, Linkedin, Github, Globe, Twitter, 
    FileText, Briefcase, GraduationCap, Award, 
    ChevronLeft, ExternalLink, Download, UserCheck
} from 'lucide-react';

interface Profile {
    _id: string; name: string; headline: string;
    avatar: string; bio: string; skills: string[];
    experience: { _id?: string; title: string; company: string; startDate: string; endDate: string; current: boolean; description: string }[];
    education: { _id?: string; degree: string; institution: string; startYear: string; endYear: string; description: string }[];
    resume: string; resumeFileName: string;
    socialLinks: { linkedin: string; github: string; portfolio: string; twitter: string };
    location: { city: string; state: string; country: string };
    createdAt: string;
}

export default function PublicCandidateProfile() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isOwnProfile = user && user._id === id;

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const { data } = await api.get(`/profile/${id}`);
                if (data.role !== 'candidate') {
                    setError('This is not a candidate profile.');
                    return;
                }
                setProfile(data);
            } catch {
                setError('Profile not found.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <div style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%' }} />
            </motion.div>
        </div>
    );

    if (error || !profile) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: '#f8fafc' }}>
            <div style={{ fontSize: '4rem' }}>🏜️</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Profile Not Found</h1>
            <p style={{ color: '#64748b', fontWeight: 500 }}>{error || "We couldn't find the profile you're looking for."}</p>
            <Link href="/jobs"><Button variant="outline">Browse Openings</Button></Link>
        </div>
    );

    const loc = [profile.location?.city, profile.location?.country].filter(Boolean).join(', ');
    const initials = profile.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '8rem', position: 'relative', overflow: 'hidden' }}>
            {/* Background Decoration */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'linear-gradient(180deg, #eff6ff 0%, rgba(248, 250, 252, 0) 100%)', zIndex: 0 }} />
            
            <div className="container" style={{ maxWidth: '1100px', position: 'relative', zIndex: 1 }}>
                
                {/* Back Link */}
                <motion.button 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    style={{ 
                        background: 'none', border: 'none', color: '#64748b', fontWeight: 700, 
                        display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                        marginBottom: '2rem', fontSize: '0.9rem'
                    }}
                >
                    <ChevronLeft size={18} /> Back to previous
                </motion.button>

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '3rem', alignItems: 'start' }}>
                    
                    {/* ── Sidebar ── */}
                    <aside>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ 
                                background: 'white', borderRadius: '40px', padding: '2.5rem', 
                                border: '1px solid #f1f5f9', boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                                textAlign: 'center'
                            }}
                        >
                            {/* Avatar */}
                            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 2rem' }}>
                                {profile.avatar ? (
                                    <img 
                                        src={profile.avatar} 
                                        alt={profile.name} 
                                        style={{ width: '100%', height: '100%', borderRadius: '48px', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                                    />
                                ) : (
                                    <div style={{ 
                                        width: '100%', height: '100%', borderRadius: '48px', 
                                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '3rem', fontWeight: 900, color: 'white'
                                    }}>
                                        {initials}
                                    </div>
                                )}
                                <div style={{ 
                                    position: 'absolute', bottom: '-10px', right: '-10px', 
                                    background: '#10b981', color: 'white', padding: '0.5rem', 
                                    borderRadius: '16px', border: '4px solid white', display: 'flex'
                                }}>
                                    <UserCheck size={18} />
                                </div>
                            </div>

                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                                {profile.name}
                            </h1>
                            <p style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                                {profile.headline || 'Senior Professional'}
                            </p>

                            {loc && (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.6rem 1.25rem', borderRadius: '14px', fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '2rem' }}>
                                    <MapPin size={16} /> {loc}
                                </div>
                            )}

                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {isOwnProfile ? (
                                    <Link href="/dashboard/candidate/profile">
                                        <Button style={{ width: '100%', borderRadius: '16px' }}>Manage Profile</Button>
                                    </Link>
                                ) : (
                                    <Button style={{ width: '100%', borderRadius: '16px', background: '#0f172a' }}>Connect</Button>
                                )}
                                {profile.resume && (
                                    <a href={profile.resume} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                        <motion.button 
                                            whileHover={{ y: -2 }}
                                            style={{ 
                                                width: '100%', padding: '0.85rem', borderRadius: '16px', border: '1px solid #e2e8f0',
                                                background: 'white', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer'
                                            }}
                                        >
                                            <Download size={18} /> Get Resume
                                        </motion.button>
                                    </a>
                                )}
                            </div>

                            {/* Social Presence */}
                            <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid #f1f5f9' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Social Presence</p>
                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                    {profile.socialLinks?.linkedin && <SocialIcon href={profile.socialLinks.linkedin} icon={Linkedin} color="#0077b5" />}
                                    {profile.socialLinks?.github && <SocialIcon href={profile.socialLinks.github} icon={Github} color="#181717" />}
                                    {profile.socialLinks?.twitter && <SocialIcon href={profile.socialLinks.twitter} icon={Twitter} color="#1DA1F2" />}
                                    {profile.socialLinks?.portfolio && <SocialIcon href={profile.socialLinks.portfolio} icon={Globe} color="#2563eb" />}
                                </div>
                            </div>
                        </motion.div>
                    </aside>

                    {/* ── Main Content ── */}
                    <main>
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            {/* About */}
                            <motion.section variants={itemVariants} style={{ background: 'white', padding: '3rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                        <Award size={22} />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Executive Summary</h2>
                                </div>
                                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-line', fontWeight: 500 }}>
                                    {profile.bio || `A results-driven professional specializing in ${profile.skills?.[0] || 'innovative solutions'}. Dedicated to excellence and continuous growth.`}
                                </p>
                            </motion.section>

                            {/* Skills */}
                            {profile.skills?.length > 0 && (
                                <motion.section variants={itemVariants} style={{ background: 'white', padding: '3rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem' }}>Technical Mastery</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        {profile.skills.map((sk, i) => (
                                            <motion.span 
                                                key={i} 
                                                whileHover={{ y: -3, background: '#0f172a', color: 'white' }}
                                                style={{ 
                                                    fontWeight: 800, fontSize: '0.9rem', padding: '0.75rem 1.5rem', 
                                                    background: '#f8fafc', color: '#475569', borderRadius: '16px',
                                                    border: '1px solid #e2e8f0', cursor: 'default', transition: 'all 0.2s'
                                                }}
                                            >
                                                {sk}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Experience */}
                            {profile.experience?.length > 0 && (
                                <motion.section variants={itemVariants} style={{ background: 'white', padding: '3rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c' }}>
                                            <Briefcase size={22} />
                                        </div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Work Experience</h2>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative' }}>
                                        {/* Timeline Line */}
                                        <div style={{ position: 'absolute', left: '20px', top: '10px', bottom: '10px', width: '2px', background: '#f1f5f9' }} />
                                        
                                        {profile.experience.map((exp, i) => (
                                            <div key={i} style={{ position: 'relative', paddingLeft: '50px' }}>
                                                {/* Node */}
                                                <div style={{ position: 'absolute', left: '16px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb', border: '4px solid white', boxShadow: '0 0 0 4px #eff6ff', zIndex: 1 }} />
                                                
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                                                    <div>
                                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{exp.title}</h3>
                                                        <p style={{ color: '#2563eb', fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem' }}>{exp.company}</p>
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '10px' }}>
                                                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.7, fontWeight: 500 }}>{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Education */}
                            {profile.education?.length > 0 && (
                                <motion.section variants={itemVariants} style={{ background: 'white', padding: '3rem', borderRadius: '40px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                                            <GraduationCap size={22} />
                                        </div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Academic Background</h2>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        {profile.education.map((edu, i) => (
                                            <div key={i} style={{ padding: '2rem', borderRadius: '32px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>{edu.degree}</h3>
                                                <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>{edu.institution}</p>
                                                <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                                                    {edu.startYear} — {edu.endYear}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}
                        </motion.div>
                    </main>
                </div>
            </div>

            <style jsx global>{`
                @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 320px 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                    aside {
                        max-width: 600px;
                        margin: 0 auto;
                        width: 100%;
                    }
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
                width: 44, height: 44, borderRadius: '12px', background: '#f8fafc',
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
