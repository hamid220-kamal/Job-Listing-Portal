import Link from 'next/link';
import Button from '@/components/Button';
import Input from '@/components/Input';

export const metadata = {
    title: 'Login | Job Listing Portal',
};

export default function LoginPage() {
    return (
        <div style={{
            minHeight: 'calc(100vh - var(--nav-height))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: 'var(--muted)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'var(--background)',
                padding: '2.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Sign in to your account</p>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />

                    <Button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Sign In
                    </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--muted-foreground)' }}>Don't have an account? </span>
                    <Link href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
