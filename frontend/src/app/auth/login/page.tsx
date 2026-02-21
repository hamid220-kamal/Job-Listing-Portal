"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';
// import { signIn } from 'next-auth/react'; // Removed for Pure MERN
import api from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Use the AuthContext login method which handles everything
            await login(formData.email, formData.password);

            // Navigation will happen automatically after login sets the user
            // Get user from localStorage to redirect properly
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.role === 'employer') {
                    router.push('/dashboard/employer');
                } else {
                    router.push(`/profile/candidate/${user._id}`);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Login to access your dashboard</p>
                </div>

                {registered && (
                    <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                        Account created! Please log in.
                    </div>
                )}

                {error && (
                    <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                        autoComplete="current-password"
                    />

                    <Button type="submit" style={{ marginTop: '1rem', background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '1.5rem' }}>
                    Don't have an account?{' '}
                    <Link href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
