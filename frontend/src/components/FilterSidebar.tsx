"use client";

import { useState } from 'react';
import { SlidersHorizontal, Check, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterState {
    types: string[];
    location: string;
}

interface Props {
    onFilterChange: (filters: FilterState) => void;
    onClose?: () => void;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const LOCATIONS = ['Remote', 'On-site', 'Hybrid'];

export default function FilterSidebar({ onFilterChange, onClose }: Props) {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    const toggleType = (type: string) => {
        const updated = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];
        setSelectedTypes(updated);
        onFilterChange({ types: updated, location: selectedLocation });
    };

    const selectLocation = (loc: string) => {
        const updated = selectedLocation === loc ? '' : loc;
        setSelectedLocation(updated);
        onFilterChange({ types: selectedTypes, location: updated });
    };

    const clearAll = () => {
        setSelectedTypes([]);
        setSelectedLocation('');
        onFilterChange({ types: [], location: '' });
    };

    const hasFilters = selectedTypes.length > 0 || selectedLocation;

    const checkboxStyle = (active: boolean) => ({
        width: '22px',
        height: '22px',
        borderRadius: '7px',
        border: active ? '2.5px solid #2563eb' : '2px solid #e2e8f0',
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        background: active ? '#2563eb' : 'transparent',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        boxShadow: active ? '0 4px 10px rgba(37,99,235,0.15)' : 'none'
    });

    return (
        <div style={{
            background: 'white',
            padding: '2rem 1.75rem',
            borderRadius: '24px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb'
                    }}>
                        <SlidersHorizontal size={20} strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Filter Results</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {hasFilters && (
                        <button
                            onClick={clearAll}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                background: 'none', border: 'none', color: '#2563eb',
                                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            <RotateCcw size={14} /> Clear
                        </button>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            style={{
                                background: '#f1f5f9', border: 'none', padding: '0.5rem',
                                borderRadius: '10px', cursor: 'pointer', color: '#64748b'
                            }}
                            className="desktop-hide"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Job Type */}
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                    fontSize: '0.85rem', fontWeight: 700, color: '#71717a',
                    marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                    Job Type
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {JOB_TYPES.map(type => {
                        const active = selectedTypes.includes(type);
                        return (
                            <label
                                key={type}
                                onClick={() => toggleType(type)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                                    cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b',
                                    fontWeight: active ? 600 : 500,
                                    padding: '2px 0',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={checkboxStyle(active)}>
                                    <AnimatePresence>
                                        {active && (
                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Check size={14} color="white" strokeWidth={3.5} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span style={{ transition: 'all 0.2s', color: active ? '#2563eb' : '#475569' }}>{type}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Work Location */}
            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                    fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8',
                    marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                    Work Location
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {LOCATIONS.map(loc => {
                        const active = selectedLocation === loc;
                        return (
                            <label
                                key={loc}
                                onClick={() => selectLocation(loc)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                                    cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b',
                                    fontWeight: active ? 600 : 500,
                                    padding: '2px 0',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={checkboxStyle(active)}>
                                    <AnimatePresence>
                                        {active && (
                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Check size={14} color="white" strokeWidth={3.5} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span style={{ transition: 'all 0.2s', color: active ? '#2563eb' : '#475569' }}>{loc}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
