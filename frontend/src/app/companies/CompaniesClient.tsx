"use client";

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import MotionWrapper from '@/components/MotionWrapper';
import { Building2, MapPin, ExternalLink, Briefcase, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Company {
    _id: string;
    name: string;
    company: string;
    logo?: string;
    industry?: string;
    companyDescription?: string;
    website?: string;
    location?: {
        city?: string;
        country?: string;
    };
    activeJobsCount: number;
}

export default function CompaniesPageClient() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data } = await api.get('/search/companies');
                setCompanies(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load companies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="spin" size={40} color="var(--accent)" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <p style={{ color: '#ef4444' }}>{error}</p>
                <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none' }}>Retry</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '4rem 1.5rem', background: '#f8fafc', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Top Companies <span style={{ color: '#2563eb' }}>Hiring Now</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
                        Discover and connect with industry leaders. Explore detailed company profiles and their current job openings.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {companies.map((company, i) => (
                        <motion.div
                            key={company._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '2rem',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                height: '100%'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '16px', background: '#f1f5f9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    overflow: 'hidden', border: '1px solid #e2e8f0'
                                }}>
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.company} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Building2 size={32} color="#94a3b8" />
                                    )}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {company.company}
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.25rem 0 0' }}>{company.industry || 'General Industry'}</p>
                                </div>
                            </div>

                            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {company.companyDescription || 'This company has not provided a description yet. Check their profile for more details and open opportunities.'}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    <MapPin size={16} />
                                    <span>{company.location?.city || 'Global'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <Briefcase size={16} />
                                    <span>{company.activeJobsCount} Open Jobs</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <Link href={`/jobs?keyword=${encodeURIComponent(company.company)}`} style={{ flex: 1 }}>
                                    <button style={{
                                        width: '100%', padding: '0.75rem', borderRadius: '12px', background: '#2563eb',
                                        color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
                                    }}>
                                        View Jobs
                                    </button>
                                </Link>
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px',
                                        borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b'
                                    }}>
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
