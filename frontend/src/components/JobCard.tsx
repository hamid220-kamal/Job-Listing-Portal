"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, DollarSign, Clock, ArrowRight } from 'lucide-react';
import Button from './Button';

interface JobCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    postedAt: string;
}

export default function JobCard({ id, title, company, location, type, salary, postedAt }: JobCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, borderColor: '#2563eb', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
            transition={{ duration: 0.2 }}
            style={{
                borderRadius: '24px',
                padding: '1.75rem',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                    {/* Company Logo Placeholder */}
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '16px', background: '#f8fafc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem', fontWeight: 800, color: '#1e293b',
                        border: '1px solid #f1f5f9'
                    }}>
                        {company.charAt(0)}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                            <Link href={`/jobs/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {title}
                            </Link>
                        </h3>
                        <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>{company}</p>
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.1, backgroundColor: '#2563eb', color: 'white' }}>
                    <Link href={`/jobs/${id}`}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a',
                            transition: 'all 0.2s ease'
                        }}>
                            <ArrowRight size={22} />
                        </div>
                    </Link>
                </motion.div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[location, type, salary].map((tag, i) => (
                    <span key={i} style={{
                        fontSize: '0.875rem', fontWeight: 600, color: '#475569',
                        background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '10px'
                    }}>
                        {tag}
                    </span>
                ))}
            </div>

            <div style={{
                borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: 'auto',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8'
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                    <Clock size={16} /> {postedAt}
                </span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>Active recruiting</span>
            </div>
        </motion.div>
    );
}
