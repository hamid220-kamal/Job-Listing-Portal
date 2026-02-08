"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';

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
            whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
            transition={{ duration: 0.2 }}
            style={{
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {company.charAt(0)}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--secondary-foreground)', marginBottom: '0.25rem' }}>
                            <Link href={`/jobs/${id}`} style={{ textDecoration: 'none' }}>
                                {title}
                            </Link>
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>{company}</p>
                    </div>
                </div>

                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '999px',
                    fontWeight: 600
                }}>
                    {type}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <MapPin size={16} /> {location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <DollarSign size={16} /> {salary}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={16} /> {postedAt}
                </span>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <motion.div whileHover={{ x: 4 }}>
                    <Link href={`/jobs/${id}`} style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        View Details →
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}
