"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.email.trim()) { setError('Please enter your email address.'); return; }
        if (!formData.password) { setError('Please enter your password.'); return; }
        setLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            if (user.role === 'employer') router.push(`/profile/employer/${user._id}`);
            else router.push(`/profile/candidate/${user._id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 50%, #f5f0ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 4vw, 2rem)',
        }}>
            {/* Decorative blobs — very subtle on light bg */}
            <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: 'clamp(200px, 40vw, 500px)', height: 'clamp(200px, 40vw, 500px)', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: 'clamp(200px, 35vw, 450px)', height: 'clamp(200px, 35vw, 450px)', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: '#ffffff',
                    borderRadius: 'clamp(16px, 3vw, 28px)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 50px -12px rgba(37,99,235,0.12)',
                    border: '1px solid rgba(226,232,240,0.8)',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Top accent bar */}
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', width: '100%' }} />

                <div style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={18} color="white" strokeWidth={2.5} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Job Portal</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.9rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.2 }}>Welcome back</h1>
                        <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '0.4rem', fontWeight: 500 }}>Sign in to your account to continue.</p>
                    </div>

                    {/* Banners */}
                    <AnimatePresence>
                        {registered && (
                            <motion.div key="reg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', marginBottom: '1.25rem', color: '#15803d', fontSize: '0.875rem', fontWeight: 600 }}>
                                <CheckCircle size={16} /> Account created! Please sign in.
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {error && (
                            <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                style={{ padding: '0.8rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '1.25rem', color: '#dc2626', fontSize: '0.875rem', fontWeight: 600 }}>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label htmlFor="l-email" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Email address</label>
                            <Input id="l-email" type="email" placeholder="you@example.com" required autoComplete="email"
                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ borderRadius: '10px', height: '2.8rem', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontSize: '0.95rem' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="l-password" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Password</label>
                                <Link href="/auth/forgot-password" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Forgot password?</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Input id="l-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required autoComplete="current-password"
                                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ borderRadius: '10px', height: '2.8rem', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontSize: '0.95rem', paddingRight: '3rem' }}
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} size="lg" fullWidth
                            style={{ height: '2.8rem', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontWeight: 700, fontSize: '0.95rem', marginTop: '0.5rem', boxShadow: '0 4px 14px rgba(37,99,235,0.25)', border: 'none' }}>
                            {loading ? <Loader2 className="spin" size={20} /> : <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Sign In <ArrowRight size={18} /></div>}
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Create account</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginForm() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}><Loader2 size={36} className="spin" color="#2563eb" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
