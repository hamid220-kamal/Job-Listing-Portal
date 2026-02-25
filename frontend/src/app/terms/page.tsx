"use client";

import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';
import Button from '@/components/Button';

export default function TermsPage() {
    return (
        <MotionWrapper>
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>Terms of Service</h1>
                <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.8 }}>
                    These are the Terms of Service. This is a placeholder for our Terms and Conditions.
                    In a real application, this page would contain the legal agreement between the platform and the user.
                </p>
                <div style={{ marginTop: '3rem' }}>
                    <Link href="/auth/signup">
                        <Button variant="outline">Back to Signup</Button>
                    </Link>
                </div>
            </div>
        </MotionWrapper>
    );
}
