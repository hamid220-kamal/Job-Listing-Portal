import Link from 'next/link';
import Button from '@/components/Button';
import Input from '@/components/Input';

export const metadata = {
    title: 'Sign Up | Job Listing Portal',
};

export default function SignupPage() {
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
                maxWidth: '500px',
                backgroundColor: 'var(--background)',
                padding: '2.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create an Account</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Join thousands of professionals and companies.</p>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input label="First Name" placeholder="John" required />
                        <Input label="Last Name" placeholder="Doe" required />
                    </div>

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
                        autoComplete="new-password"
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>I am a...</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontSize: '0.875rem'
                            }}>
                                <input type="radio" name="role" value="candidate" defaultChecked style={{ marginRight: '0.5rem' }} />
                                Job Seeker
                            </label>
                            <label style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontSize: '0.875rem'
                            }}>
                                <input type="radio" name="role" value="employer" style={{ marginRight: '0.5rem' }} />
                                Employer
                            </label>
                        </div>
                    </div>

                    <Button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                        Create Account
                    </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--muted-foreground)' }}>Already have an account? </span>
                    <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
