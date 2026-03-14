"use client";

import MotionWrapper from '@/components/MotionWrapper';
import Link from 'next/link';
import Button from '@/components/Button';
import { HelpCircle, Search, Mail, MessageSquare, Shield, User, Briefcase, FileText } from 'lucide-react';

export default function HelpPage() {
    const categories = [
        { title: 'Account & Profile', icon: User, desc: 'Manage your settings, password, and profile details.' },
        { title: 'Job Search', icon: Briefcase, desc: 'Tips on finding the perfect role and using filters.' },
        { title: 'Applications', icon: FileText, desc: 'Track your applications and understand the hiring process.' },
        { title: 'Security & Privacy', icon: Shield, desc: 'How we protect your data and stay safe on the platform.' },
    ];

    return (
        <MotionWrapper>
            <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>How can we help?</h1>
                    <div style={{ position: 'relative', maxWidth: '600px', marginInline: 'auto' }}>
                        <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                        <input 
                            type="text" 
                            placeholder="Search for help articles..." 
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                    {categories.map((cat, i) => (
                        <div key={i} className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#2563eb' }}>
                                <cat.icon size={26} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{cat.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>{cat.desc}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                        <Mail style={{ color: '#2563eb', marginBottom: '1.5rem' }} size={32} />
                        <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Email Support</h4>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Get a response within 24 hours from our dedicated support team.</p>
                        <Button variant="outline">support@jobportal.com</Button>
                    </div>
                    <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                        <MessageSquare style={{ color: '#10b981', marginBottom: '1.5rem' }} size={32} />
                        <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Live Chat</h4>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Chat with us in real-time during business hours (9AM - 5PM EST).</p>
                        <Button variant="outline">Start Chatting</Button>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <Link href="/">
                        <Button variant="ghost">Back to Home</Button>
                    </Link>
                </div>
            </div>
        </MotionWrapper>
    );
}
