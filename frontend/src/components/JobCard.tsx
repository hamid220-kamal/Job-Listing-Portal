"use client";

import { MapPin, Briefcase, DollarSign, Clock, ArrowRight, Heart } from 'lucide-react';
import React from 'react';
import Button from './Button';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface JobCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category?: string;
    salary: string;
    postedAt: string;
    isBookmarked?: boolean;
    onBookmarkToggle?: (jobId: string) => void;
}

export default function JobCard({ id, title, company, location, type, category, salary, postedAt, isBookmarked = false, onBookmarkToggle }: JobCardProps) {
    const [loading, setLoading] = React.useState(false);
    const [bookmarked, setBookmarked] = React.useState(isBookmarked);

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        try {
            const { data } = await api.post(`/profile/bookmarks/${id}`);
            setBookmarked(data.bookmarked);
            toast.success(data.message);
            if (onBookmarkToggle) onBookmarkToggle(id);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover="hover"
            style={{
                borderRadius: '32px',
                padding: '2.5rem',
                backgroundColor: 'white',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
        >
            {/* Glossy Hover Effect Overlay */}
            <motion.div
                variants={{
                    initial: { x: '-100%', opacity: 0 },
                    hover: { x: '100%', opacity: 0.15 }
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                    zIndex: 1, pointerEvents: 'none'
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', gap: '1.75rem' }}>
                    <motion.div 
                        variants={{ hover: { scale: 1.08, rotate: -3 } }}
                        style={{
                            width: '80px', height: '80px', borderRadius: '24px', 
                            background: '#f8fafc',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.75rem', fontWeight: 900, color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)'
                        }}>
                        {(company || 'J').charAt(0).toUpperCase()}
                    </motion.div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.04em', lineHeight: 1.2 }}>
                            <Link href={`/jobs/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {title}
                            </Link>
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <p style={{ fontSize: '1.05rem', color: '#475569', fontWeight: 800 }}>{company}</p>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#cbd5e1' }} />
                            <span style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <motion.button 
                        whileHover={{ scale: 1.2, rotate: 12 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={handleBookmark}
                        disabled={loading}
                        style={{
                            width: '52px', height: '52px', borderRadius: '18px', 
                            border: '1px solid #f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: bookmarked ? '#ef4444' : '#94a3b8',
                            background: bookmarked ? '#fff1f2' : 'white',
                            cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: bookmarked ? '0 8px 16px rgba(239, 68, 68, 0.15)' : 'none'
                        }}
                    >
                        <Heart size={24} fill={bookmarked ? '#ef4444' : 'none'} strokeWidth={bookmarked ? 0 : 2.5} />
                    </motion.button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
                {[
                    { label: location, icon: MapPin, color: '#2563eb', bg: '#eff6ff' },
                    { label: type, icon: Briefcase, color: '#7c3aed', bg: '#f5f3ff' },
                    { label: salary, icon: DollarSign, color: '#059669', bg: '#ecfdf5' }
                ].filter(t => t.label).map((tag, i) => (
                    <span key={i} style={{
                        fontSize: '0.9rem', fontWeight: 800, color: tag.color,
                        background: tag.bg, padding: '0.6rem 1.25rem', borderRadius: '14px',
                        display: 'flex', alignItems: 'center', gap: '0.6rem', 
                        border: `1px solid ${tag.color}15`
                    }}>
                        <tag.icon size={16} strokeWidth={3} />
                        {tag.label}
                    </span>
                ))}
            </div>

            <div style={{
                borderTop: '1px solid #f1f5f9', paddingTop: '2rem', marginTop: 'auto',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                position: 'relative', zIndex: 2
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: '#94a3b8', fontSize: '0.9rem' }}>
                    <Clock size={16} strokeWidth={2.5} /> Posted {postedAt}
                </span>
                
                <Link href={`/jobs/${id}`} style={{ textDecoration: 'none' }}>
                    <motion.div 
                        variants={{ hover: { x: 8 } }}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.6rem', 
                            color: '#0f172a', fontWeight: 900, fontSize: '1rem',
                            letterSpacing: '-0.02em'
                        }}>
                        View Details <ArrowRight size={20} strokeWidth={3.5} />
                    </motion.div>
                </Link>
            </div>

            {/* Premium Progress Bar Background (Subtle) */}
            <div style={{ 
                position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px',
                background: '#f1f5f9'
            }}>
                <motion.div 
                    initial={{ width: 0 }}
                    variants={{ hover: { width: '100%' } }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ height: '100%', background: '#2563eb', borderRadius: '0 10px 0 0' }}
                />
            </div>
        </motion.div>
    );
}
