"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Sparkles } from 'lucide-react';

export default function JobFilter() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.append('keyword', query);
        if (location) params.append('location', location);
        if (type) params.append('type', type);
        
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(150px, 1fr) auto',
            gap: '0.75rem',
            alignItems: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={20} color="#2563eb" strokeWidth={3} style={{ position: 'absolute', left: '1.25rem' }} />
                <input 
                    placeholder="Search roles, skills, or companies..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        width: '100%', height: '64px', borderRadius: '22px', border: '1px solid #f1f5f9',
                        padding: '0 1rem 0 3.5rem', fontSize: '1rem', fontWeight: 600, background: '#f8fafc',
                        outline: 'none', transition: 'all 0.3s'
                    }}
                />
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MapPin size={20} color="#94a3b8" style={{ position: 'absolute', left: '1.25rem' }} />
                <input 
                    placeholder="Location or Remote" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                        width: '100%', height: '64px', borderRadius: '22px', border: '1px solid #f1f5f9',
                        padding: '0 1rem 0 3.5rem', fontSize: '1rem', fontWeight: 600, background: '#f8fafc',
                        outline: 'none', transition: 'all 0.3s'
                    }}
                />
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Briefcase size={20} color="#94a3b8" style={{ position: 'absolute', left: '1.25rem' }} />
                <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                        width: '100%', height: '64px', borderRadius: '22px', border: '1px solid #f1f5f9',
                        padding: '0 1.25rem 0 3.5rem', fontSize: '1rem', fontWeight: 600, background: '#f8fafc',
                        color: '#475569', appearance: 'none', outline: 'none'
                    }}
                >
                    <option value="">Work Tier</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                </select>
            </div>

            <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                style={{ 
                    height: '64px', padding: '0 2.5rem', borderRadius: '22px', 
                    background: '#0f172a', color: 'white', border: 'none', 
                    fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}
            >
                <Sparkles size={18} /> Discovery
            </motion.button>

            <style jsx>{`
                input:focus { border-color: #2563eb !important; background: white !important; }
                select:focus { border-color: #2563eb !important; background: white !important; }
                @media (max-width: 900px) {
                    form { grid-template-columns: 1fr; }
                }
            `}</style>
        </form>
    );
}
