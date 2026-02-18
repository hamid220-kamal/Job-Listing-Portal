"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Button from '@/components/Button';

export default function EmployerProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        companyDescription: '',
        industry: '',
        companySize: '',
        website: '',
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        } else if (user && user.role !== 'employer') {
            router.push('/dashboard/candidate');
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
                company: data.company || '',
                companyDescription: data.companyDescription || '',
                industry: data.industry || '',
                companySize: data.companySize || '',
                website: data.website || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            await api.put('/profile', formData);
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
                    Employer Profile
                </h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Update your company information to attract top talent
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
                        Your Name
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
                        Company Name
                    </label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
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
                        Company Description
                    </label>
                    <textarea
                        name="companyDescription"
                        value={formData.companyDescription}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell candidates about your company..."
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
                        Industry
                    </label>
                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                        }}
                    >
                        <option value="">Select Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Company Size
                    </label>
                    <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                        }}
                    >
                        <option value="">Select Size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Website URL
                    </label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://yourcompany.com"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            fontSize: '1rem',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => router.push('/dashboard/employer')}
                        style={{ backgroundColor: '#6B7280' }}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </form>
        </div>
    );
}
