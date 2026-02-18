"use client";

import React from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import dynamic from 'next/dynamic';
// lazy load JobCard
const JobCard = dynamic(() => import('@/components/JobCard'), {
    loading: () => <div style={{ height: '200px', background: '#f4f4f5', borderRadius: '12px', animation: 'pulse 2s infinite' }}></div>,
    ssr: false // Optional, but usually good for heavy interactive components
});
import api from '@/utils/api';
import { Search, MapPin } from 'lucide-react';

export default function JobsPage() {
    const [jobs, setJobs] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs');
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

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
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderRight: '1px solid #f4f4f5' }}>
                            <Search color="#a1a1aa" size={20} />
                            <input
                                placeholder="Job title, keyword, or company"
                                style={{ border: 'none', width: '100%', fontSize: '1rem', outline: 'none', fontWeight: 500 }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem' }}>
                            <MapPin color="#a1a1aa" size={20} />
                            <input
                                placeholder="City, state, or zip code"
                                style={{ border: 'none', width: '100%', fontSize: '1rem', outline: 'none', fontWeight: 500 }}
                            />
                        </div>
                        <button style={{
                            background: '#18181b', color: 'white', padding: '0.75rem 2rem',
                            borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer'
                        }}>
                            Search
                        </button>
                    </div>
                </div>
            </header>

            <div className="container" style={{ marginTop: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '3rem', alignItems: 'start', position: 'relative' }}>

                    {/* Sticky Sidebar */}
                    <aside style={{ position: 'sticky', top: '2rem', height: 'fit-content' }} className="mobile-hide">
                        <FilterSidebar />
                    </aside>

                    {/* Job List */}
                    <main>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#18181b' }}>
                                Showing <span style={{ color: '#2563eb' }}>{jobs.length}</span> active jobs
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: '#71717a' }}>Sort by:</span>
                                <select style={{
                                    padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e4e4e7',
                                    background: 'white', fontSize: '0.9rem', fontWeight: 600, color: '#18181b', cursor: 'pointer'
                                }}>
                                    <option>Most Relevant</option>
                                    <option>Newest</option>
                                    <option>Highest Paid</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#a1a1aa' }}>Loading jobs...</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {jobs.map((job) => (
                                    <JobCard key={job._id} id={job._id} {...job} />
                                ))}
                                {jobs.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '4rem', color: '#a1a1aa' }}>No jobs found</div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
