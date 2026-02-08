import Link from 'next/link';

export default function Navbar() {
    return (
        <nav style={{
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 'var(--nav-height)'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    letterSpacing: '-0.025em'
                }}>
                    JobPortal
                </Link>

                {/* Navigation Links */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link href="/jobs" style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--foreground)'
                    }}>
                        Find Jobs
                    </Link>
                    <Link href="/dashboard/employer" style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--muted-foreground)'
                    }}>
                        For Employers
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/auth/login" className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>
                        Log in
                    </Link>
                    <Link href="/auth/signup" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                        Sign up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
