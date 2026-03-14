"use client";

import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const JOB_CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Management', 'Healthcare', 'Education', 'Other'];

export default function PostJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        category: 'Engineering',
        salary: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/jobs', formData);
            toast.success('Job posted successfully!');
            router.push('/dashboard/employer');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/dashboard/employer" style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    ← Back to Dashboard
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem', color: '#0f172a' }}>Post a New Job</h1>
                <p style={{ color: '#64748b' }}>Fill in the details below to find your next great hire.</p>
            </div>

            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
                <Input 
                    label="Job Title" 
                    placeholder="e.g. Senior Product Designer" 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <Input 
                        label="Company Name" 
                        placeholder="e.g. Acme Inc" 
                        required 
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                    <Input 
                        label="Location" 
                        placeholder="e.g. Remote, NY" 
                        required 
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Job Type</label>
                        <select 
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            style={{
                                height: '3rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                padding: '0 0.75rem',
                                backgroundColor: 'white',
                                outline: 'none',
                                fontSize: '0.95rem'
                            }}
                        >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Freelance</option>
                            <option>Internship</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Category</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{
                                height: '3rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                padding: '0 0.75rem',
                                backgroundColor: 'white',
                                outline: 'none',
                                fontSize: '0.95rem'
                            }}
                            required
                        >
                            {JOB_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                <Input 
                    label="Salary Range" 
                    placeholder="e.g. $100k - $120k" 
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Job Description</label>
                    <textarea
                        rows={8}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        style={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            padding: '1rem',
                            fontFamily: 'inherit',
                            fontSize: '0.95rem',
                            resize: 'vertical',
                            backgroundColor: 'white',
                            outline: 'none',
                            lineHeight: 1.6
                        }}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <Link href="/dashboard/employer">
                        <Button variant="ghost" type="button" disabled={loading}>Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Posting...' : 'Post Job Opportunity'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
