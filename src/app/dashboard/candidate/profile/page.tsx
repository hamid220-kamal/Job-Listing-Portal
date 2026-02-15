"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Button from '@/components/Button';

export default function CandidateProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        skills: '',
        experience: '',
        education: '',
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        } else if (user && user.role !== 'candidate') {
            router.push('/dashboard/employer');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            const data = response.data;
            setFormData({
                name: data.name || '',
                email: data.email || '',
                bio: data.bio || '',
                skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
                experience: data.experience || '',
                education: data.education || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const submitData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
            };

            await api.put('/profile', submitData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Candidate Profile
                </h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Complete your profile to get better job recommendations
                </p>
            </header>

            {message.text && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: message.type === 'success' ? '#DEF7EC' : '#FDE8E8',
                    color: message.type === 'success' ? '#03543F' : '#9B1C1C',
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                        }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                            backgroundColor: '#f5f5f5',
                            cursor: 'not-allowed',
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Bio / Summary
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Skills
                    </label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="JavaScript, React, Node.js (comma-separated)"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Experience
                    </label>
                    <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe your work experience..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Education
                    </label>
                    <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Your educational background..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => router.push('/dashboard/candidate')}
                        style={{ backgroundColor: '#6B7280' }}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </form>
        </div>
    );
}
