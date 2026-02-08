"use client";

import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Input from '@/components/Input';
import FileUpload from '@/components/FileUpload';
import MotionWrapper from '@/components/MotionWrapper';

export default function EmployerProfile() {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            <MotionWrapper>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Company Profile</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Update your company details and branding.</p>
                </div>

                <div style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Company Info */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Company Details</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                                <Input label="Company Name" defaultValue="Acme Inc." />
                                <Input label="Industry" placeholder="e.g. Technology" />
                            </div>
                            <Input label="Website URL" placeholder="https://example.com" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Company Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your company culture and mission..."
                                    style={{
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        padding: '0.75rem',
                                        fontFamily: 'inherit',
                                        fontSize: '0.875rem',
                                        resize: 'vertical',
                                        backgroundColor: 'transparent'
                                    }}
                                />
                            </div>
                        </section>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

                        {/* Branding */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Branding</h2>
                            <FileUpload label="Company Logo" accept=".png,.jpg,.jpeg,.svg" />
                        </section>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button size="lg" style={{ background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }}>
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </div>
            </MotionWrapper>
        </div>
    );
}
