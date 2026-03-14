"use client";

import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';
import Button from '@/components/Button';

export default function TermsPage() {
    return (
        <MotionWrapper>
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Terms of Service</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--muted-foreground)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                    <p>
                        Effective Date: March 13, 2026
                    </p>
                    <p>
                        By using the Job Listing Portal, you agree to be bound by the following terms and conditions. Please read them carefully.
                    </p>
                    <h2 style={{ color: 'var(--foreground)', marginTop: '1rem' }}>1. Acceptance of Terms</h2>
                    <p>
                        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                    </p>
                    <h2 style={{ color: 'var(--foreground)', marginTop: '1rem' }}>2. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
                    </p>
                    <h2 style={{ color: 'var(--foreground)', marginTop: '1rem' }}>3. Prohibited Uses</h2>
                    <p>
                        You agree not to use the Service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.
                    </p>
                    <h2 style={{ color: 'var(--foreground)', marginTop: '1rem' }}>4. Termination</h2>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </div>
                <div style={{ marginTop: '4rem' }}>
                    <Link href="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </div>
            </div>
        </MotionWrapper>
    );
}
