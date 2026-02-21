"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import s from '../../../dashboard/profile.module.css';
import Link from 'next/link';
import Button from '@/components/Button';

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
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--muted-foreground)' }}>Loading profile…</p>
        </div>
    );
    if (error || !profile) return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{error || 'Profile not found'}</p>
            <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
    );

    const loc = [profile.location?.city, profile.location?.state, profile.location?.country].filter(Boolean).join(', ');
    const initials = profile.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
    const socials = profile.socialLinks || {} as any;
    const socialEntries = Object.entries(socials).filter(([, v]) => !!v) as [string, string][];

    return (
        <div className={s.publicContainer}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                {/* ── Hero ── */}
                <div className={s.publicHero} style={{ flexWrap: 'wrap' }}>
                    {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.name} className={s.publicAvatar} />
                    ) : (
                        <div className={s.publicAvatarFallback}>{initials}</div>
                    )}
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <h1 className={s.publicName}>{profile.name}</h1>
                        {profile.headline && <p className={s.publicHeadline}>{profile.headline}</p>}
                        {loc && <p className={s.publicLocation}>📍 {loc}</p>}
                    </div>
                    {isOwnProfile && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Link href="/dashboard/candidate">
                                <Button variant="secondary" size="sm">📊 Dashboard</Button>
                            </Link>
                            <Link href="/dashboard/candidate/profile">
                                <Button variant="outline" size="sm">✏️ Edit Profile</Button>
                            </Link>
                            <Link href="/jobs">
                                <Button size="sm" style={{ background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }}>
                                    🔍 Apply for Jobs
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── Bio ── */}
                {profile.bio && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>About</h2>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--foreground)' }}>{profile.bio}</p>
                    </div>
                )}

                {/* ── Skills ── */}
                {profile.skills?.length > 0 && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>Skills</h2>
                        <div className={s.publicSkills}>
                            {profile.skills.map((sk, i) => (
                                <span key={i} className={s.publicSkillTag}>{sk}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Experience ── */}
                {profile.experience?.length > 0 && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>Experience</h2>
                        {profile.experience.map((exp, i) => (
                            <div key={exp._id || i} className={s.timelineEntry}>
                                <div className={s.timelineTitle}>{exp.title}</div>
                                <div className={s.timelineSubtitle}>
                                    {exp.company}
                                    {(exp.startDate || exp.endDate) && (
                                        <> · {exp.startDate || '?'} — {exp.current ? 'Present' : exp.endDate || '?'}</>
                                    )}
                                </div>
                                {exp.description && <p className={s.timelineDesc}>{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Education ── */}
                {profile.education?.length > 0 && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>Education</h2>
                        {profile.education.map((edu, i) => (
                            <div key={edu._id || i} className={s.timelineEntry}>
                                <div className={s.timelineTitle}>{edu.degree}</div>
                                <div className={s.timelineSubtitle}>
                                    {edu.institution}
                                    {(edu.startYear || edu.endYear) && <> · {edu.startYear || '?'} — {edu.endYear || '?'}</>}
                                </div>
                                {edu.description && <p className={s.timelineDesc}>{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Resume ── */}
                {profile.resume && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>Resume</h2>
                        <a href={profile.resume} target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)',
                                fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none'
                            }}>
                            📄 {profile.resumeFileName || 'Download Resume'} ↗
                        </a>
                    </div>
                )}

                {/* ── Social Links ── */}
                {socialEntries.length > 0 && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>Links</h2>
                        <div className={s.publicSocials}>
                            {socialEntries.map(([key, url]) => (
                                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                                    className={s.publicSocialLink}>
                                    {key === 'linkedin' ? '🔗 LinkedIn' :
                                        key === 'github' ? '💻 GitHub' :
                                            key === 'portfolio' ? '🌐 Portfolio' :
                                                key === 'twitter' ? '🐦 Twitter' : key}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Back ── */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link href="/" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.85rem' }}>
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
