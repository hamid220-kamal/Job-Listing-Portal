"use client";

import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';
import Button from '@/components/Button';

export default function PrivacyPage() {
    return (
        <MotionWrapper>
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>Privacy Policy</h1>
                <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.8 }}>
                    We take your privacy seriously. This is a placeholder for our Privacy Policy.
                    In a real application, this page would contain detailed information about how we collect,
                    use, and protect your data.
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
