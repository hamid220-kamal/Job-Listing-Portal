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

    const handleFilterChange = (filters: { types: string[]; location: string }) => {
        setParams(prev => ({
            ...prev,
            types: filters.types,
            location: filters.location || prev.location,
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
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                borderBottom: '1px solid #e2e8f0',
                padding: '5rem 0 4rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
                    borderRadius: '50%', zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 style={{ fontSize: '3rem', fontWeight: 850, marginBottom: '1rem', letterSpacing: '-0.04em', color: '#0f172a' }}>
                            Discover Your <span style={{ color: '#2563eb', position: 'relative' }}>
                                Next Chapter
                                <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%' }} width="100" height="8" viewBox="0 0 100 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 6C20 2 40 2 99 6" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: '1.6' }}>
                            Explore {total}+ premium opportunities from top-tier companies. Filter by your preferences and apply in seconds.
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'flex',
                        background: 'white',
                        padding: '0.65rem',
                        borderRadius: '24px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        maxWidth: '940px'
                    }}>
                        <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0 1.5rem', minWidth: '280px' }}>
                            <Search size={22} color="#2563eb" strokeWidth={2.5} />
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                type="text"
                                placeholder="Job title, company, or skills"
                                style={{ border: 'none', outline: 'none', width: '100%', height: '54px', fontSize: '1.05rem', fontWeight: 500, color: '#1e293b' }}
                            />
                        </div>
                        <div style={{ width: '1px', background: '#e2e8f0', margin: '0.85rem 0' }} className="mobile-hide" />
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0 1.5rem', minWidth: '220px' }}>
                            <MapPin size={22} color="#64748b" />
                            <input
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                type="text"
                                placeholder="Location or Remote"
                                style={{ border: 'none', outline: 'none', width: '100%', height: '54px', fontSize: '1.05rem', fontWeight: 500, color: '#1e293b' }}
                            />
                        </div>
                        <div style={{
                            padding: '0 2rem',
                            background: '#0f172a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '18px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            cursor: 'default',
                            opacity: 0.9,
                            minHeight: '54px'
                        }}>
                            {loading ? <Loader2 size={18} className="spin" /> : 'Real-time'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '4rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 320px) 1fr', gap: '3.5rem', alignItems: 'start', position: 'relative' }}>

                    {/* Sidebar Filters */}
                    <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }} className="mobile-hide">
                        <FilterSidebar onFilterChange={handleFilterChange} />
                    </aside>

                    {/* Main Content */}
                    <main>
                        {/* Results Count & Sort */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>
                                Showing <strong style={{ color: '#0f172a' }}>{jobs.length}</strong> of <strong style={{ color: '#0f172a' }}>{total}</strong> results
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Sort by:</span>
                                <select
                                    onChange={handleSortChange}
                                    value={params.sort}
                                    style={{
                                        padding: '0.65rem 1.25rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: '#1e293b',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="title">Title (A-Z)</option>
                                </select>
                            </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    style={{
                                        background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c',
                                        padding: '1.25rem', borderRadius: '18px', marginBottom: '2.5rem',
                                        display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600
                                    }}
                                >
                                    <div style={{ background: '#fee2e2', padding: '0.4rem', borderRadius: '8px' }}>⚠️</div>
                                    <div>
                                        <p style={{ margin: 0 }}>API Error: {error}</p>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#991b1b', opacity: 0.8, fontWeight: 500 }}>
                                            Ensure your backend server is deployed and running with the latest changes.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Job List */}
                        {loading && jobs.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ height: '200px', background: 'white', borderRadius: '24px', animation: 'pulse 2s infinite', border: '1px solid #f1f5f9' }} />
                                ))}
                            </div>
                        ) : jobs.length > 0 ? (
                            <motion.div
                                layout
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                            >
                                <AnimatePresence mode='popLayout'>
                                    {jobs.map((job) => (
                                        <JobCard key={job._id} {...job} id={job._id} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: 'center', padding: '6rem 0', background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0' }}
                            >
                                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔍</div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>No matching jobs</h3>
                                <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                                    We couldn't find any positions matching your current search. Try clearing your filters or using different keywords.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    style={{
                                        background: '#2563eb', color: 'white', border: 'none',
                                        padding: '1rem 2rem', borderRadius: '14px', cursor: 'pointer',
                                        fontWeight: 700, boxShadow: '0 10px 25px rgba(37,99,235,0.2)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {pages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '5rem', alignItems: 'center' }}>
                                <button
                                    disabled={params.page === 1}
                                    onClick={() => handlePageChange(params.page - 1)}
                                    style={{
                                        padding: '0.85rem 1.25rem',
                                        borderRadius: '14px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        cursor: params.page === 1 ? 'not-allowed' : 'pointer',
                                        opacity: params.page === 1 ? 0.5 : 1,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Previous
                                </button>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {Array.from({ length: pages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            style={{
                                                width: '46px',
                                                height: '46px',
                                                borderRadius: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                background: params.page === i + 1 ? '#0f172a' : 'white',
                                                color: params.page === i + 1 ? 'white' : '#1e293b',
                                                border: params.page === i + 1 ? 'none' : '1px solid #e2e8f0',
                                                transition: 'all 0.2s',
                                                boxShadow: params.page === i + 1 ? '0 8px 20px rgba(15,23,42,0.15)' : 'none'
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={params.page === pages}
                                    onClick={() => handlePageChange(params.page + 1)}
                                    style={{
                                        padding: '0.85rem 1.25rem',
                                        borderRadius: '14px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        cursor: params.page === pages ? 'not-allowed' : 'pointer',
                                        opacity: params.page === pages ? 0.5 : 1,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {loading && jobs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', bottom: '2.5rem', right: '2.5rem',
                        background: 'white', padding: '1rem 2rem', borderRadius: '100px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '1rem',
                        zIndex: 100, border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}>
                    <Loader2 size={20} className="spin" color="#2563eb" strokeWidth={3} />
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Updating...</span>
                </motion.div>
            )}

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
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
