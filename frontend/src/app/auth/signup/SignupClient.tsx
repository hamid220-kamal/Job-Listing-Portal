"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Briefcase, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

function SignupContent() {
    const router = useRouter();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.name.trim()) { setError('Please enter your full name.'); return; }
        if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setLoading(true);
        try {
            const user = await signup(formData.name, formData.email, formData.password, formData.role);
            toast.success('Account created successfully!');
            if (formData.role === 'employer') router.push(user?._id ? `/profile/employer/${user._id}` : '/dashboard/employer');
            else router.push(user?._id ? `/profile/candidate/${user._id}` : '/jobs');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
            toast.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const selectRole = (role: string) => setFormData(prev => ({ ...prev, role }));

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 50%, #f5f0ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 4vw, 2rem)',
        }}>
            <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: 'clamp(150px, 30vw, 400px)', height: 'clamp(150px, 30vw, 400px)', background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 'clamp(150px, 25vw, 350px)', height: 'clamp(150px, 25vw, 350px)', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    background: '#ffffff',
                    borderRadius: 'clamp(16px, 3vw, 28px)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 50px -12px rgba(37,99,235,0.12)',
                    border: '1px solid rgba(226,232,240,0.8)',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #7c3aed, #2563eb)', width: '100%' }} />

                <div style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={18} color="white" strokeWidth={2.5} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Job Portal</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.9rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.2 }}>Create account</h1>
                        <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '0.4rem', fontWeight: 500 }}>Join thousands finding their next opportunity.</p>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                style={{ padding: '0.8rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '1.25rem', color: '#dc2626', fontSize: '0.875rem', fontWeight: 600 }}>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Role Selector */}
                        <div style={{ display: 'flex', gap: '0.75rem' }} role="radiogroup" aria-label="Account type">
                            {[
                                { value: 'candidate', label: 'Job Seeker', icon: <User size={16} strokeWidth={2.5} /> },
                                { value: 'employer', label: 'Employer', icon: <Briefcase size={16} strokeWidth={2.5} /> },
                            ].map(({ value, label, icon }) => {
                                const active = formData.role === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        onClick={() => selectRole(value)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem 0.5rem',
                                            borderRadius: '12px',
                                            border: `1.5px solid ${active ? '#2563eb' : '#e2e8f0'}`,
                                            background: active ? '#eff6ff' : '#f8fafc',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            transition: 'all 0.25s ease',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                        }}
                                    >
                                        <span style={{ color: active ? '#2563eb' : '#94a3b8' }}>{icon}</span>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: active ? '#1d4ed8' : '#64748b' }}>{label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Full Name */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label htmlFor="s-name" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Full name</label>
                            <Input id="s-name" placeholder="e.g. Alex Johnson" required autoComplete="name"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ borderRadius: '10px', height: '2.8rem', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontSize: '0.95rem' }}
                            />
                        </div>

                        {/* Email */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label htmlFor="s-email" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Email address</label>
                            <Input id="s-email" type="email" placeholder="you@example.com" required autoComplete="email"
                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ borderRadius: '10px', height: '2.8rem', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontSize: '0.95rem' }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label htmlFor="s-password" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Input id="s-password" type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars, upper, lower, number, symbol"
                                    required minLength={8} autoComplete="new-password"
                                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ borderRadius: '10px', height: '2.8rem', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontSize: '0.95rem', paddingRight: '3rem' }}
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                                Must include uppercase, lowercase, number &amp; symbol.
                            </p>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                            By signing up you agree to our{' '}
                            <Link href="/terms" style={{ color: '#2563eb', fontWeight: 700 }}>Terms</Link>{' '}and{' '}
                            <Link href="/privacy" style={{ color: '#2563eb', fontWeight: 700 }}>Privacy Policy</Link>.
                        </p>

                        <Button type="submit" disabled={loading} size="lg" fullWidth
                            style={{ height: '2.8rem', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(124,58,237,0.25)', border: 'none' }}>
                            {loading ? <Loader2 className="spin" size={20} /> : <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Create Account <ArrowRight size={18} /></div>}
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                        Already have an account?{' '}
                        <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function SignupPageClient() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}><Loader2 size={36} className="spin" color="#7c3aed" /></div>}>
            <SignupContent />
        </Suspense>
    );
}
