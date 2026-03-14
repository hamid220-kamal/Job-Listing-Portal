"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import dynamic from 'next/dynamic';
const JobCard = dynamic(() => import('@/components/JobCard'), {
    loading: () => <div style={{ height: '200px', background: '#f4f4f5', borderRadius: '12px', animation: 'pulse 2s infinite' }}></div>,
    ssr: false,
});
import { useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { Search, MapPin, Loader2, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchParams {
    keyword: string;
    location: string;
    types: string[];
    category: string;
    sort: string;
    page: number;
}

export default function JobsPageClient() {
    const searchParams = useSearchParams();
    const [jobs, setJobs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Controlled inputs for real-time search
    const [keyword, setKeyword] = useState(() => searchParams.get('keyword') || '');
    const [locationInput, setLocationInput] = useState(() => searchParams.get('location') || '');

    const [params, setParams] = useState<SearchParams>(() => {
        const typeParam = searchParams.get('type');
        return {
            keyword: searchParams.get('keyword') || '',
            location: searchParams.get('location') || '',
            types: typeParam ? typeParam.split(',') : [],
            category: searchParams.get('category') || '',
            sort: searchParams.get('sort') || 'newest',
            page: parseInt(searchParams.get('page') || '1'),
        };
    });

    // Fetch function
    const fetchJobs = useCallback(async (currentParams: SearchParams) => {
        setLoading(true);
        try {
            const qp = new URLSearchParams();
            if (currentParams.keyword) qp.set('keyword', currentParams.keyword);
            if (currentParams.location) qp.set('location', currentParams.location);
            if (currentParams.types.length > 0) qp.set('type', currentParams.types.join(','));
            if (currentParams.category) qp.set('category', currentParams.category);
            if (currentParams.sort && currentParams.sort !== 'newest') qp.set('sort', currentParams.sort);
            qp.set('page', String(currentParams.page));
            qp.set('limit', '20');

            const { data } = await api.get(`/search?${qp.toString()}`);
            setJobs(data.jobs || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
            setError(null);
        } catch (err: any) {
            console.error('Search error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
            setJobs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce effect for real-time search
    useEffect(() => {
        const timer = setTimeout(() => {
            setParams(prev => ({
                ...prev,
                keyword,
                location: locationInput,
                page: 1
            }));
        }, 500); // 500ms debounce for smoother server load

        return () => clearTimeout(timer);
    }, [keyword, locationInput]);

    // Fetch when params change
    useEffect(() => {
        fetchJobs(params);
    }, [fetchJobs, params]);

    const handleFilterChange = (filters: { types: string[]; location: string; category: string }) => {
        setParams(prev => ({
            ...prev,
            types: filters.types,
            location: filters.location || prev.location,
            category: filters.category,
            page: 1
        }));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParams(prev => ({ ...prev, sort: e.target.value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setParams(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const clearFilters = () => {
        setKeyword('');
        setLocationInput('');
        setParams({ keyword: '', location: '', types: [], sort: 'newest', page: 1 });
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* Mobile Filter Drawer Overlay */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            style={{
                                position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                                backdropFilter: 'blur(4px)', zIndex: 1000,
                            }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed', top: 0, right: 0, bottom: 0, width: '85%', maxWidth: '360px',
                                background: 'white', zIndex: 1001, padding: '1rem', overflowY: 'auto'
                            }}
                        >
                            <FilterSidebar
                                onFilterChange={handleFilterChange}
                                onClose={() => setShowMobileFilters(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Floating Mobile Filter Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileFilters(true)}
                className="desktop-hide"
                style={{
                    position: 'fixed', bottom: '6rem', right: '1.5rem',
                    width: '56px', height: '56px', borderRadius: '18px',
                    background: '#2563eb', color: 'white', border: 'none',
                    boxShadow: '0 12px 24px rgba(37, 99, 235, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 90, cursor: 'pointer'
                }}
            >
                <SlidersHorizontal size={24} strokeWidth={2.5} />
            </motion.button>
            {/* Premium Header / Search Bar */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid var(--border)',
                padding: '6rem 0 5rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Advanced Grid Background (Same as Home for consistency) */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    backgroundImage: `linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem',
                    maskImage: 'radial-gradient(ellipse 60% 50% at 50% 100%, #000 70%, transparent 100%)',
                    opacity: 0.4
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 style={{ 
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, 
                            marginBottom: '1rem', letterSpacing: '-0.05em', color: '#0f172a' 
                        }}>
                            Find your <span style={{ color: '#2563eb' }}>perfect role.</span>
                        </h1>
                        <p style={{ 
                            fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem', 
                            maxWidth: '650px', lineHeight: '1.6', fontWeight: 500 
                        }}>
                            Browse through our curated list of <strong>{total}+</strong> high-impact opportunities 
                            from global technology leaders and precision-matched for your expertise.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                            display: 'flex',
                            background: 'white',
                            padding: '0.75rem',
                            borderRadius: '24px',
                            boxShadow: 'var(--shadow-xl)',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            border: '1px solid var(--border)',
                            maxWidth: '1000px',
                            position: 'relative'
                        }}
                    >
                        <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.5rem', minWidth: '280px' }}>
                            <Search size={22} color="#2563eb" strokeWidth={3} />
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                type="text"
                                placeholder="Search by title, company, or skills..."
                                style={{ 
                                    border: 'none', outline: 'none', width: '100%', height: '56px', 
                                    fontSize: '1.1rem', fontWeight: 600, color: '#0f172a',
                                    background: 'transparent'
                                }}
                            />
                        </div>
                        <div style={{ width: '2px', background: '#f1f5f9', margin: '1rem 0' }} className="mobile-hide" />
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.5rem', minWidth: '220px' }}>
                            <MapPin size={22} color="#94a3b8" />
                            <input
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                type="text"
                                placeholder="Location or Remote"
                                style={{ 
                                    border: 'none', outline: 'none', width: '100%', height: '56px', 
                                    fontSize: '1.1rem', fontWeight: 600, color: '#0f172a',
                                    background: 'transparent'
                                }}
                            />
                        </div>
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            style={{
                                padding: '0 2.5rem',
                                background: '#0f172a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '18px',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                cursor: 'default',
                                minHeight: '56px',
                                minWidth: '120px'
                            }}>
                            {loading ? <Loader2 size={18} className="spin" /> : 'SEARCHING...'}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="container" style={{ padding: '6rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 340px) 1fr', gap: '4rem', alignItems: 'start', position: 'relative' }}>

                    {/* Sidebar Filters */}
                    <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }} className="mobile-hide">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <FilterSidebar onFilterChange={handleFilterChange} />
                        </motion.div>
                    </aside>

                    {/* Main Content */}
                    <main>
                        {/* Results Count & Sort */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{ 
                                display: 'flex', justifyContent: 'space-between', 
                                alignItems: 'center', marginBottom: '3rem',
                                padding: '0 0.5rem'
                            }}>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 600 }}>
                                <span style={{ color: '#0f172a', fontWeight: 900 }}>{total}</span> Opportunities Found
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort:</span>
                                <select
                                    onChange={handleSortChange}
                                    value={params.sort}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        color: '#0f172a',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        boxShadow: 'var(--shadow-sm)',
                                        appearance: 'none',
                                        minWidth: '160px'
                                    }}
                                >
                                    <option value="newest">Recent First</option>
                                    <option value="oldest">Historical</option>
                                    <option value="title">Title (A-Z)</option>
                                </select>
                            </div>
                        </motion.div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    style={{
                                        background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c',
                                        padding: '1.5rem', borderRadius: '24px', marginBottom: '3rem',
                                        display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 600,
                                        boxShadow: '0 10px 30px rgba(185, 28, 28, 0.05)'
                                    }}
                                >
                                    <div style={{ background: '#fee2e2', padding: '0.6rem', borderRadius: '12px' }}>⚠️</div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '1.1rem' }}>Connection Error: {error}</p>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#991b1b', opacity: 0.8, fontWeight: 500 }}>
                                            The server is currently unreachable. Please check your network or try again later.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Job List */}
                        {loading && jobs.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} style={{ height: '220px', background: 'white', borderRadius: '30px', animation: 'pulse 1.5s infinite', border: '1px solid var(--border)' }} />
                                ))}
                            </div>
                        ) : jobs.length > 0 ? (
                            <motion.div
                                layout
                                variants={{
                                    visible: { transition: { staggerChildren: 0.08 } },
                                    hidden: {}
                                }}
                                initial="hidden"
                                animate="visible"
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                            >
                                <AnimatePresence mode='popLayout'>
                                    {jobs.map((job) => (
                                        <motion.div
                                            key={job._id}
                                            layout
                                            variants={{
                                                visible: { opacity: 1, y: 0, scale: 1 },
                                                hidden: { opacity: 0, y: 20, scale: 0.98 }
                                            }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                                        >
                                            <JobCard {...job} id={job._id} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ 
                                    textAlign: 'center', padding: '8rem 2rem', 
                                    background: 'white', borderRadius: '40px', 
                                    border: '1px solid var(--border)',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    style={{ fontSize: '5rem', marginBottom: '2rem' }}>
                                    🔍
                                </motion.div>
                                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a', letterSpacing: '-0.03em' }}>No direct matches</h3>
                                <p style={{ 
                                    color: '#64748b', fontSize: '1.2rem', maxWidth: '450px', 
                                    margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 500 
                                }}>
                                    We couldn't find exact matches for your current criteria. 
                                    Try adjusting your filters or expanding your search terms.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearFilters}
                                    style={{
                                        background: '#2563eb', color: 'white', border: 'none',
                                        padding: '1.25rem 3rem', borderRadius: '20px', cursor: 'pointer',
                                        fontWeight: 800, fontSize: '1.1rem',
                                        boxShadow: '0 15px 30px rgba(37,99,235,0.2)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    Reset Discovery
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {pages > 1 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '6rem', alignItems: 'center' }}>
                                <motion.button
                                    whileHover={params.page !== 1 ? { scale: 1.05, background: '#f8fafc' } : {}}
                                    disabled={params.page === 1}
                                    onClick={() => handlePageChange(params.page - 1)}
                                    style={{
                                        padding: '1rem 1.75rem',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        cursor: params.page === 1 ? 'not-allowed' : 'pointer',
                                        opacity: params.page === 1 ? 0.4 : 1,
                                        transition: 'all 0.2s',
                                        color: '#0f172a'
                                    }}
                                >
                                    Previous
                                </motion.button>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {Array.from({ length: Math.min(pages, 5) }).map((_, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ y: -2 }}
                                            onClick={() => handlePageChange(i + 1)}
                                            style={{
                                                width: '52px',
                                                height: '52px',
                                                borderRadius: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 850,
                                                cursor: 'pointer',
                                                background: params.page === i + 1 ? '#0f172a' : 'white',
                                                color: params.page === i + 1 ? 'white' : '#0f172a',
                                                border: params.page === i + 1 ? 'none' : '1px solid var(--border)',
                                                transition: 'all 0.2s',
                                                boxShadow: params.page === i + 1 ? '0 10px 25px rgba(15,23,42,0.15)' : 'none'
                                            }}
                                        >
                                            {i + 1}
                                        </motion.button>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={params.page !== pages ? { scale: 1.05, background: '#f8fafc' } : {}}
                                    disabled={params.page === pages}
                                    onClick={() => handlePageChange(params.page + 1)}
                                    style={{
                                        padding: '1rem 1.75rem',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        cursor: params.page === pages ? 'not-allowed' : 'pointer',
                                        opacity: params.page === pages ? 0.4 : 1,
                                        transition: 'all 0.2s',
                                        color: '#0f172a'
                                    }}
                                >
                                    Next
                                </motion.button>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>

            {loading && jobs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    style={{
                        position: 'fixed', bottom: '3rem', right: '3rem',
                        background: 'white', padding: '1.25rem 2.5rem', borderRadius: '100px',
                        boxShadow: 'var(--shadow-xl)', display: 'flex', alignItems: 'center', gap: '1.25rem',
                        zIndex: 100, border: '1px solid var(--border)'
                    }}>
                    <Loader2 size={24} className="spin" color="#2563eb" strokeWidth={3.5} />
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em' }}>SYNCHRONIZING...</span>
                </motion.div>
            )}

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 992px) {
                    .mobile-hide { display: none !important; }
                    .desktop-hide { display: flex !important; }
                    main { grid-column: span 2; }
                }
                @media (min-width: 993px) {
                    .desktop-hide { display: none !important; }
                }
            `}</style>
        </div>
    );
}
