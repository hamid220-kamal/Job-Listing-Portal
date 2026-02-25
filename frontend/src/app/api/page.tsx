"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ApiPage() {
    const router = useRouter();

    useEffect(() => {
        // This page shouldn't really be visited, so redirect home
        router.push('/');
    }, [router]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <p>API Root</p>
        </div>
    );
}
