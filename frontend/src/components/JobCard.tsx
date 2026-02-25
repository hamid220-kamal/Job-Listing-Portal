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
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
                y: -8,
                borderColor: '#2563eb',
                boxShadow: '0 20px 40px rgba(37, 99, 235, 0.08)',
                background: 'linear-gradient(to bottom right, #ffffff 0%, #f8faff 100%)'
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
                borderRadius: '24px',
                padding: '1.75rem',
                backgroundColor: 'white',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                    {/* Company Logo with styling */}
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 800, color: '#1e293b',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}>
                        {(company || 'J').charAt(0)}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                            <Link href={`/jobs/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {title || 'Job Title'}
                            </Link>
                        </h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>{company || 'Company'}</p>
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.1, backgroundColor: '#2563eb', color: 'white', borderColor: '#2563eb' }}>
                    <Link href={`/jobs/${id}`}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: '#f8fafc'
                        }}>
                            <ArrowRight size={20} />
                        </div>
                    </Link>
                </motion.div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {[
                    { label: location, icon: MapPin },
                    { label: type, icon: Briefcase },
                    { label: salary, icon: DollarSign }
                ].map((tag, i) => (
                    <span key={i} style={{
                        fontSize: '0.8rem', fontWeight: 700, color: '#475569',
                        background: '#f1f5f9', padding: '0.5rem 0.85rem', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(226, 232, 240, 0.5)'
                    }}>
                        <tag.icon size={14} strokeWidth={2.5} />
                        {tag.label}
                    </span>
                ))}
            </div>

            <div style={{
                borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: 'auto',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8'
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#94a3b8' }}>
                    <Clock size={15} /> Posted {postedAt}
                </span>
                <span style={{
                    fontWeight: 700, color: '#10b981', background: '#ecfdf5',
                    padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem'
                }}>
                    Active recruiting
                </span>
            </div>
        </motion.div>
    );
}
