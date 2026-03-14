"use client";

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api';

function ForgotPasswordContent() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
            toast.success('Recovery email sent!');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Request failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleTryAnother = () => {
        setSuccess(false);
        setError('');
        setEmail('');
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
            <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: 'clamp(150px, 30vw, 400px)', height: 'clamp(150px, 30vw, 400px)', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: 'clamp(150px, 25vw, 350px)', height: 'clamp(150px, 25vw, 350px)', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

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
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', width: '100%' }} />

                <div style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                    <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem', transition: 'color 0.2s' }}>
                        <ArrowLeft size={16} strokeWidth={2.5} /> Back to sign in
                    </Link>

                    <AnimatePresence mode="wait">
                        {!success ? (
                            <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ShieldAlert size={18} color="white" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.2 }}>Forgot password?</h1>
                                    <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '0.4rem', fontWeight: 500 }}>Enter your email and we&apos;ll send you a reset link.</p>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            style={{ padding: '0.8rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '1.25rem', color: '#dc2626', fontSize: '0.875rem', fontWeight: 600 }}>
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <label htmlFor="fp-email" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Mail size={14} /> Email address
                                        </label>
                                        <Input id="fp-email" type="email" placeholder="you@example.com" required autoComplete="email"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                            style={{ borderRadius: '10px', height: '2.8rem', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontSize: '0.95rem' }}
                                        />
                                    </div>

                                    <Button type="submit" disabled={loading} size="lg" fullWidth
                                        style={{ height: '2.8rem', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.25)', border: 'none' }}>
                                        {loading ? <Loader2 className="spin" size={20} /> : <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Send Reset Link <ArrowRight size={18} /></div>}
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                                    style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid #bbf7d0' }}>
                                    <CheckCircle2 size={36} strokeWidth={2.5} />
                                </motion.div>
                                <h2 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>Check your email</h2>
                                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                                    If an account exists for <strong style={{ color: '#0f172a' }}>{email}</strong>, a reset link has been sent.
                                </p>
                                <Button onClick={handleTryAnother} variant="secondary" fullWidth
                                    style={{ height: '2.6rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem' }}>
                                    Try a different email
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default function ForgotPasswordClient() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}><Loader2 size={36} className="spin" color="#2563eb" /></div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
