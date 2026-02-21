"use client";

import React, { useState, useCallback, useRef } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import dynamic from 'next/dynamic';
const JobCard = dynamic(() => import('@/components/JobCard'), {
    loading: () => <div style={{ height: '200px', background: '#f4f4f5', borderRadius: '12px', animation: 'pulse 2s infinite' }}></div>,
    ssr: false,
});
import api from '@/utils/api';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchParams {
    keyword: string;
    location: string;
    types: string[];
    sort: string;
    page: number;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState<SearchParams>({
        keyword: '',
        location: '',
        types: [],
        sort: 'newest',
        page: 1,
    });

    // Input refs for the search bar (not controlled to avoid re-renders on each keystroke)
    const keywordRef = useRef<HTMLInputElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);

    // Fetch function
    const fetchJobs = useCallback(async (searchParams: SearchParams) => {
        setLoading(true);
        try {
            const qp = new URLSearchParams();
            if (searchParams.keyword) qp.set('keyword', searchParams.keyword);
            if (searchParams.location) qp.set('location', searchParams.location);
            if (searchParams.types.length > 0) qp.set('type', searchParams.types.join(','));
            if (searchParams.sort === 'newest') qp.set('sort', 'newest');
            if (searchParams.sort === 'oldest') qp.set('sort', 'oldest');
            qp.set('page', String(searchParams.page));
            qp.set('limit', '20');

            const { data } = await api.get(`/search?${qp.toString()}`);
            setJobs(data.jobs || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (err) {
            console.error('Search error:', err);
            // Fallback — try the regular jobs API
            try {
                const { data } = await api.get('/jobs');
                setJobs(Array.isArray(data) ? data : []);
                setTotal(Array.isArray(data) ? data.length : 0);
            } catch {
                setJobs([]);
                setTotal(0);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    React.useEffect(() => {
        fetchJobs(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle search button click
    const handleSearch = () => {
        const updated: SearchParams = {
            ...params,
            keyword: keywordRef.current?.value || '',
            location: locationRef.current?.value || '',
            page: 1,
        };
        setParams(updated);
        fetchJobs(updated);
    };

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    // Handle sidebar filter change
    const handleFilterChange = (filters: { types: string[]; location: string }) => {
        const updated: SearchParams = {
            ...params,
            types: filters.types,
            page: 1,
        };
        // If a work-location filter like "Remote" is selected, add to location search
        if (filters.location) {
            updated.location = filters.location;
            if (locationRef.current) locationRef.current.value = filters.location;
        }
        setParams(updated);
        fetchJobs(updated);
    };

    // Handle sort change
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const updated: SearchParams = { ...params, sort: e.target.value, page: 1 };
        setParams(updated);
        fetchJobs(updated);
    };

    // Pagination
    const goToPage = (p: number) => {
        const updated: SearchParams = { ...params, page: p };
        setParams(updated);
        fetchJobs(updated);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '8rem' }}>

            {/* Header */}
            <header style={{ background: 'white', borderBottom: '1px solid #e4e4e7', padding: '6rem 0 3rem' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: '#18181b', letterSpacing: '-0.02em' }}>
                        Find your next <span style={{ color: '#2563eb' }}>big thing.</span>
                    </h1>

                    {/* Search Bar */}
                    <div style={{
                        display: 'flex', gap: '1rem', background: 'white', padding: '0.75rem',
                        borderRadius: '16px', border: '1px solid #e4e4e7', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        maxWidth: '800px', flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderRight: '1px solid #f4f4f5', minWidth: '200px' }}>
                            <Search color="#a1a1aa" size={20} />
                            <input
                                ref={keywordRef}
                                placeholder="Job title, keyword, or company"
                                defaultValue={params.keyword}
                                onKeyDown={handleKeyDown}
                                style={{ border: 'none', width: '100%', fontSize: '1rem', outline: 'none', fontWeight: 500 }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', minWidth: '200px' }}>
                            <MapPin color="#a1a1aa" size={20} />
                            <input
                                ref={locationRef}
                                placeholder="City, state, or zip code"
                                defaultValue={params.location}
                                onKeyDown={handleKeyDown}
                                style={{ border: 'none', width: '100%', fontSize: '1rem', outline: 'none', fontWeight: 500 }}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            style={{
                                background: '#18181b', color: 'white', padding: '0.75rem 2rem',
                                borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}
                        >
                            {loading ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
                            Search
                        </button>
                    </div>
                </div>
            </header>

            <div className="container" style={{ marginTop: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '3rem', alignItems: 'start', position: 'relative' }}>

                    {/* Sticky Sidebar */}
                    <aside style={{ position: 'sticky', top: '2rem', height: 'fit-content' }} className="mobile-hide">
                        <FilterSidebar onFilterChange={handleFilterChange} />
                    </aside>

                    {/* Job List */}
                    <main>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#18181b' }}>
                                Showing <span style={{ color: '#2563eb' }}>{total}</span> {total === 1 ? 'job' : 'jobs'}
                                {params.keyword && <span style={{ color: '#71717a' }}> for &quot;{params.keyword}&quot;</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: '#71717a' }}>Sort by:</span>
                                <select
                                    value={params.sort}
                                    onChange={handleSortChange}
                                    style={{
                                        padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e4e4e7',
                                        background: 'white', fontSize: '0.9rem', fontWeight: 600, color: '#18181b', cursor: 'pointer'
                                    }}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="title">A-Z</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#a1a1aa' }}>
                                <Loader2 size={32} className="spin" style={{ margin: '0 auto 1rem' }} />
                                Searching jobs...
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {jobs.map((job) => (
                                    <JobCard key={job._id} id={job._id} {...job} />
                                ))}
                                {jobs.length === 0 && (
                                    <div style={{
                                        textAlign: 'center', padding: '4rem', color: '#71717a',
                                        background: 'white', borderRadius: '16px', border: '1px solid #e4e4e7',
                                    }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No jobs found</div>
                                        <div>Try adjusting your search keywords or filters</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {pages > 1 && !loading && (
                            <div style={{
                                display: 'flex', justifyContent: 'center',
                                gap: '0.5rem', marginTop: '3rem',
                            }}>
                                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        style={{
                                            width: '40px', height: '40px', borderRadius: '10px',
                                            border: p === params.page ? '2px solid #2563eb' : '1px solid #e4e4e7',
                                            background: p === params.page ? '#2563eb' : 'white',
                                            color: p === params.page ? 'white' : '#18181b',
                                            fontWeight: 600, cursor: 'pointer',
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
