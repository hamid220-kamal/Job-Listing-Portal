"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import Button from '@/components/Button';
import Link from 'next/link';

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: '0.875rem',
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'var(--foreground)',
};

const hintStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: 'var(--muted-foreground)',
    marginTop: '0.375rem',
};

export default function CandidateProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [msg, setMsg] = useState({ ok: false, text: '' });

    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '',
        bio: '', skills: '', experience: '', education: '', resume: '',
    });

    // Auth guard
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'candidate')) {
            router.push(user ? '/dashboard/employer' : '/auth/login');
        }
    }, [user, authLoading, router]);

    // Load profile
    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const { data } = await api.get('/profile');
                setForm({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    bio: data.bio || '',
                    skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
                    experience: data.experience || '',
                    education: data.education || '',
                    resume: data.resume || '',
                });
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setFetching(false);
            }
        })();
    }, [user]);

    const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ ok: false, text: '' });
        try {
            await api.put('/profile', {
                ...form,
                skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
            });
            setMsg({ ok: true, text: 'Profile saved successfully!' });
        } catch (err: any) {
            setMsg({ ok: false, text: err.response?.data?.message || 'Failed to save' });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || !user || fetching) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '720px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>My Profile</h1>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Complete your profile to stand out to employers
                        </p>
                    </div>
                    <Link href="/dashboard/candidate">
                        <Button variant="secondary" size="sm">← Dashboard</Button>
                    </Link>
                </div>

                {/* Toast */}
                {msg.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '0.875rem 1rem',
                            marginBottom: '1.5rem',
                            borderRadius: 'var(--radius)',
                            border: `1px solid ${msg.ok ? '#34d399' : '#f87171'}`,
                            backgroundColor: msg.ok ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                            color: msg.ok ? '#10b981' : '#ef4444',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                        }}
                    >
                        {msg.ok ? '✓ ' : '✕ '}{msg.text}
                    </motion.div>
                )}

                <form onSubmit={save} style={{ display: 'grid', gap: '2rem' }}>

                    {/* Section: Personal Info */}
                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', margin: 0 }}>
                        <legend style={{ fontWeight: 700, fontSize: '1rem', padding: '0 0.5rem' }}>Personal Information</legend>
                        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input name="name" value={form.name} onChange={set} required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input name="email" value={form.email} readOnly style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Phone</label>
                                    <input name="phone" value={form.phone} onChange={set} placeholder="+1 (555) 123-4567" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Address</label>
                                    <input name="address" value={form.address} onChange={set} placeholder="City, Country" style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* Section: Professional */}
                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', margin: 0 }}>
                        <legend style={{ fontWeight: 700, fontSize: '1rem', padding: '0 0.5rem' }}>Professional Details</legend>
                        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '0.5rem' }}>
                            <div>
                                <label style={labelStyle}>Bio / Summary</label>
                                <textarea name="bio" value={form.bio} onChange={set} rows={3}
                                    placeholder="A short summary about yourself and your career goals..."
                                    style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Skills</label>
                                <input name="skills" value={form.skills} onChange={set}
                                    placeholder="JavaScript, React, Node.js, MongoDB"
                                    style={inputStyle} />
                                <p style={hintStyle}>Separate with commas</p>
                            </div>
                            <div>
                                <label style={labelStyle}>Experience</label>
                                <textarea name="experience" value={form.experience} onChange={set} rows={4}
                                    placeholder="• Software Engineer at XYZ Corp (2022–Present)&#10;• Junior Dev at ABC Ltd (2020–2022)"
                                    style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Education</label>
                                <textarea name="education" value={form.education} onChange={set} rows={3}
                                    placeholder="B.Sc. Computer Science — University of XYZ (2020)"
                                    style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                        </div>
                    </fieldset>

                    {/* Section: Resume */}
                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', margin: 0 }}>
                        <legend style={{ fontWeight: 700, fontSize: '1rem', padding: '0 0.5rem' }}>Resume</legend>
                        <div style={{ marginTop: '0.5rem' }}>
                            <label style={labelStyle}>Resume / Portfolio Link</label>
                            <input name="resume" value={form.resume} onChange={set}
                                placeholder="https://drive.google.com/your-resume or LinkedIn URL"
                                style={inputStyle} type="url" />
                            <p style={hintStyle}>Paste a link to your resume (Google Drive, Dropbox) or portfolio site</p>
                        </div>
                    </fieldset>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={() => router.push('/dashboard/candidate')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}
                            style={{ background: 'var(--gradient-primary, linear-gradient(135deg, #6366f1, #8b5cf6))', border: 'none', boxShadow: 'var(--shadow-glow)' }}>
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
