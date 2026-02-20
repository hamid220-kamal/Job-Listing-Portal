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

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236b7280' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    paddingRight: '2.5rem',
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

export default function EmployerProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [msg, setMsg] = useState({ ok: false, text: '' });

    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '',
        company: '', companyDescription: '', industry: '', companySize: '',
        website: '', logo: '',
    });

    // Auth guard
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'employer')) {
            router.push(user ? '/dashboard/candidate' : '/auth/login');
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
                    company: data.company || '',
                    companyDescription: data.companyDescription || '',
                    industry: data.industry || '',
                    companySize: data.companySize || '',
                    website: data.website || '',
                    logo: data.logo || '',
                });
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setFetching(false);
            }
        })();
    }, [user]);

    const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ ok: false, text: '' });
        try {
            await api.put('/profile', form);
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
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Company Profile</h1>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Showcase your company to attract top talent
                        </p>
                    </div>
                    <Link href="/dashboard/employer">
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

                    {/* Section: Contact Person */}
                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', margin: 0 }}>
                        <legend style={{ fontWeight: 700, fontSize: '1rem', padding: '0 0.5rem' }}>Contact Person</legend>
                        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Your Name *</label>
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
                                    <label style={labelStyle}>Office Address</label>
                                    <input name="address" value={form.address} onChange={set} placeholder="123 Business St, City" style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* Section: Company Details */}
                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', margin: 0 }}>
                        <legend style={{ fontWeight: 700, fontSize: '1rem', padding: '0 0.5rem' }}>Company Details</legend>
                        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '0.5rem' }}>
                            <div>
                                <label style={labelStyle}>Company Name *</label>
                                <input name="company" value={form.company} onChange={set} required
                                    placeholder="Acme Corporation"
                                    style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Company Description</label>
                                <textarea name="companyDescription" value={form.companyDescription} onChange={set} rows={4}
                                    placeholder="What does your company do? What's your mission and culture?"
                                    style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Industry</label>
                                    <select name="industry" value={form.industry} onChange={set} style={selectStyle}>
                                        <option value="">Select Industry</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Education">Education</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Consulting">Consulting</option>
                                        <option value="Media">Media & Entertainment</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Company Size</label>
                                    <select name="companySize" value={form.companySize} onChange={set} style={selectStyle}>
                                        <option value="">Select Size</option>
                                        <option value="1-10">1–10 employees</option>
                                        <option value="11-50">11–50 employees</option>
                                        <option value="51-200">51–200 employees</option>
                                        <option value="201-500">201–500 employees</option>
                                        <option value="501-1000">501–1,000 employees</option>
                                        <option value="1000+">1,000+ employees</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* Section: Online Presence */}
                    <fieldset style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', margin: 0 }}>
                        <legend style={{ fontWeight: 700, fontSize: '1rem', padding: '0 0.5rem' }}>Online Presence</legend>
                        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '0.5rem' }}>
                            <div>
                                <label style={labelStyle}>Website</label>
                                <input name="website" value={form.website} onChange={set}
                                    placeholder="https://yourcompany.com" type="url"
                                    style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Company Logo URL</label>
                                <input name="logo" value={form.logo} onChange={set}
                                    placeholder="https://yourcompany.com/logo.png" type="url"
                                    style={inputStyle} />
                                <p style={hintStyle}>Direct link to your company logo image</p>
                                {form.logo && (
                                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <img
                                            src={form.logo}
                                            alt="Logo preview"
                                            style={{
                                                width: 48, height: 48,
                                                objectFit: 'contain',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid var(--border)',
                                                backgroundColor: '#fff',
                                            }}
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Preview</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </fieldset>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={() => router.push('/dashboard/employer')}>
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
