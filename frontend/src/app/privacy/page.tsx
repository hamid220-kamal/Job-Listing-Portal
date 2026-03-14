"use client";

import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';
import Button from '@/components/Button';

export default function PrivacyPage() {
    return (
        <MotionWrapper>
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Privacy Policy</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                    <p>
                        Effective Date: March 13, 2026
                    </p>
                    <p>
                        At Job Listing Portal, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your personal information.
                    </p>
                    <h2 style={{ color: 'var(--foreground)', marginTop: '1rem' }}>1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, build your profile, apply for jobs, or communicate with us. This includes your name, email, phone number, resume, and work history.
                    </p>
                    <h2 style={{ color: 'var(--foreground)', marginTop: '1rem' }}>2. How We Use Your Information</h2>
                    <p>
                        We use your information to provide and improve our services, match you with relevant job opportunities, communicate with you, and ensure the security of our platform.
                    </p>
                    <h2 style={{ color: 'var(--foreground)', marginTop: '1rem' }}>3. Data Sharing and Disclosure</h2>
                    <p>
                        We share your information with employers when you apply for a job. We do not sell your personal information to third parties.
                    </p>
                    <h2 style={{ color: 'var(--foreground)', marginTop: '1rem' }}>4. Your Rights</h2>
                    <p>
                        You have the right to access, update, or delete your personal information at any time through your account settings.
                    </p>
                </div>
                <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Questions?</h3>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>If you have any questions about our privacy practices, please contact our support team.</p>
                    <Link href="/contact">
                        <Button variant="primary">Contact Support</Button>
                    </Link>
                </div>
            </div>
        </MotionWrapper>
    );
}
