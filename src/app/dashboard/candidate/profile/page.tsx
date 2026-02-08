"use client";

import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Input from '@/components/Input';
import FileUpload from '@/components/FileUpload';
import MotionWrapper, { slideUp } from '@/components/MotionWrapper';

export default function CandidateProfile() {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            <MotionWrapper>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Profile</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Manage your personal information and resume.</p>
                </div>

                <div style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Personal Info */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Personal Details</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <Input label="First Name" defaultValue="Hamid" />
                                <Input label="Last Name" defaultValue="Kamal" />
                            </div>
                            <Input label="Email Address" type="email" defaultValue="hamid@example.com" />
                            <Input label="Job Title" placeholder="e.g. Senior Frontend Developer" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Bio</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about yourself..."
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

                        {/* Resume */}
                        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Resume / CV</h2>
                            <FileUpload label="Upload Resume" />
                        </section>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button size="lg" style={{ background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </MotionWrapper>
        </div>
    );
}
