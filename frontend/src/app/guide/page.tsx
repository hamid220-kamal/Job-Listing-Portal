"use client";

import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';
import Button from '@/components/Button';

export default function GuidePage() {
    return (
        <MotionWrapper>
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>User Guide</h1>
                <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.8 }}>
                    Learn how to make the most out of JobPortal.
                    Step-by-step guides are coming soon.
                </p>
                <div style={{ marginTop: '3rem' }}>
                    <Link href="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </div>
            </div>
        </MotionWrapper>
    );
}
