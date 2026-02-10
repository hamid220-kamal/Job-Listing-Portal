"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'candidate' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/signup', formData);

            // Redirect to login on success
            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '2rem',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Join us to find your dream job</p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        autoComplete="name"
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        autoComplete="email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        autoComplete="new-password"
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>I am a...</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ flex: 1, padding: '0.75rem', border: `1px solid ${formData.role === 'candidate' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'center', backgroundColor: formData.role === 'candidate' ? 'rgba(99, 102, 241, 0.05)' : 'transparent' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="candidate"
                                    checked={formData.role === 'candidate'}
                                    onChange={() => setFormData({ ...formData, role: 'candidate' })}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                Job Seeker
                            </label>
                            <label style={{ flex: 1, padding: '0.75rem', border: `1px solid ${formData.role === 'employer' ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'center', backgroundColor: formData.role === 'employer' ? 'rgba(99, 102, 241, 0.05)' : 'transparent' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="employer"
                                    checked={formData.role === 'employer'}
                                    onChange={() => setFormData({ ...formData, role: 'employer' })}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                Employer
                            </label>
                        </div>
                    </div>

                    <Button type="submit" style={{ marginTop: '1rem', background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Log in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
