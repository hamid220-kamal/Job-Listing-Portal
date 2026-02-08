export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '3rem 0',
            marginTop: 'auto',
            backgroundColor: 'var(--background)'
        }}>
            <div className="container" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>JobPortal</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', maxWidth: '300px' }}>
                            Connecting the best talent with the best companies. Simple, fast, and human-centric.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '3rem' }}>
                        <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Platform</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li><a href="/jobs" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Browse Jobs</a></li>
                                <li><a href="/companies" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Companies</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li><a href="/privacy" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Privacy</a></li>
                                <li><a href="/terms" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Terms</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--muted-foreground)'
                }}>
                    <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
