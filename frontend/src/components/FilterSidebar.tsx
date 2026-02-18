"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, SlidersHorizontal } from 'lucide-react';

export default function FilterSidebar() {
    const [filters, setFilters] = useState({
        fullTime: true,
        partTime: false,
        remote: false,
        contract: false,
        entryLevel: false,
        senior: false
    });

    const toggleFilter = (key: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sections = [
        {
            title: "Job Type",
            options: [
                { label: "Full-time", key: "fullTime" },
                { label: "Part-time", key: "partTime" },
                { label: "Contract", key: "contract" },
                { label: "Freelance", key: "freelance" }
            ]
        },
        {
            title: "Remote Friendly",
            options: [
                { label: "Remote Only", key: "remote" },
                { label: "Hybrid", key: "hybrid" },
                { label: "On-site", key: "onsite" }
            ]
        },
        {
            title: "Experience Level",
            options: [
                { label: "Entry Level", key: "entryLevel" },
                { label: "Mid Level", key: "midLevel" },
                { label: "Senior", key: "senior" },
                { label: "Director", key: "director" }
            ]
        },
        {
            title: "Salary Range",
            options: [
                { label: "$50k - $100k", key: "r1" },
                { label: "$100k - $150k", key: "r2" },
                { label: "$150k+", key: "r3" }
            ]
        }
    ];

    return (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e4e4e7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <SlidersHorizontal size={20} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filters</h3>
            </div>

            {sections.map((section, i) => (
                <div key={i} style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#71717a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {section.title}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {section.options.map((opt, j) => (
                            <label key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', color: '#18181b' }}>
                                <div style={{
                                    width: '20px', height: '20px', borderRadius: '6px', border: '1px solid #d4d4d8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'white'
                                }}>
                                    <input type="checkbox" style={{ display: 'none' }} />
                                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#18181b', opacity: 0 }} />
                                    {/* Mock Interactivity */}
                                </div>
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
