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
    _id: string; name: string; email: string; phone: string;
    company: string; companyDescription: string;
    industry: string; companySize: string;
    website: string; logo: string;
    companyBenefits: string[];
    companySocialLinks: { linkedin: string; twitter: string; facebook: string };
    location: { city: string; state: string; country: string };
}

export default function PublicEmployerProfile() {
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
                if (data.role !== 'employer') {
                    setError('This is not a company profile.');
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
    const socials = profile.companySocialLinks || {} as any;
    const socialEntries = Object.entries(socials).filter(([, v]) => !!v) as [string, string][];

    return (
        <div className={s.publicContainer}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                {/* ── Hero ── */}
                <div className={s.publicHero} style={{ flexWrap: 'wrap' }}>
                    {profile.logo ? (
                        <img src={profile.logo} alt={profile.company} className={s.publicAvatar}
                            style={{ borderRadius: 'var(--radius)' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                        <div className={s.publicAvatarFallback} style={{ borderRadius: 'var(--radius)' }}>🏢</div>
                    )}
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <h1 className={s.publicName}>{profile.company || profile.name}</h1>
                        <p className={s.publicHeadline}>
                            {[profile.industry, profile.companySize ? `${profile.companySize} employees` : ''].filter(Boolean).join(' · ')}
                        </p>
                        {loc && <p className={s.publicLocation}>📍 {loc}</p>}
                    </div>
                    {isOwnProfile && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Link href="/dashboard/employer">
                                <Button variant="secondary" size="sm">📊 Dashboard</Button>
                            </Link>
                            <Link href="/dashboard/employer/profile">
                                <Button variant="outline" size="sm">✏️ Edit Profile</Button>
                            </Link>
                            <Link href="/jobs/new">
                                <Button size="sm" style={{ background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }}>
                                    ➕ Post a Job
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── About ── */}
                {profile.companyDescription && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>About the Company</h2>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--foreground)' }}>{profile.companyDescription}</p>
                    </div>
                )}

                {/* ── Benefits ── */}
                {profile.companyBenefits?.length > 0 && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>Benefits & Perks</h2>
                        <div className={s.publicSkills}>
                            {profile.companyBenefits.map((b, i) => (
                                <span key={i} className={s.publicSkillTag}>✓ {b}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Contact ── */}
                <div className={s.publicSection}>
                    <h2 className={s.publicSectionTitle}>Contact</h2>
                    <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                        {profile.name && <p><strong>Contact Person:</strong> {profile.name}</p>}
                        {profile.email && <p><strong>Email:</strong> {profile.email}</p>}
                        {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
                        {profile.website && (
                            <p><strong>Website:</strong>{' '}
                                <a href={profile.website} target="_blank" rel="noopener noreferrer"
                                    style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                                    {profile.website} ↗
                                </a>
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Social ── */}
                {socialEntries.length > 0 && (
                    <div className={s.publicSection}>
                        <h2 className={s.publicSectionTitle}>Follow Us</h2>
                        <div className={s.publicSocials}>
                            {socialEntries.map(([key, url]) => (
                                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                                    className={s.publicSocialLink}>
                                    {key === 'linkedin' ? '🔗 LinkedIn' :
                                        key === 'twitter' ? '🐦 Twitter' :
                                            key === 'facebook' ? '📘 Facebook' : key}
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
