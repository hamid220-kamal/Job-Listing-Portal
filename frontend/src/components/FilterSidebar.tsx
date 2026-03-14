"use client";

import { useState } from 'react';
import { SlidersHorizontal, Check, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterState {
    types: string[];
    location: string;
    category: string;
}

interface Props {
    onFilterChange: (filters: FilterState) => void;
    onClose?: () => void;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const LOCATIONS = ['Remote', 'On-site', 'Hybrid'];
const JOB_CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Management', 'Healthcare', 'Education', 'Other'];

export default function FilterSidebar({ onFilterChange, onClose }: Props) {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const toggleType = (type: string) => {
        const updated = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];
        setSelectedTypes(updated);
        onFilterChange({ types: updated, location: selectedLocation, category: selectedCategory });
    };

    const selectLocation = (loc: string) => {
        const updated = selectedLocation === loc ? '' : loc;
        setSelectedLocation(updated);
        onFilterChange({ types: selectedTypes, location: updated, category: selectedCategory });
    };

    const selectCategory = (cat: string) => {
        const updated = selectedCategory === cat ? '' : cat;
        setSelectedCategory(updated);
        onFilterChange({ types: selectedTypes, location: selectedLocation, category: updated });
    };

    const clearAll = () => {
        setSelectedTypes([]);
        setSelectedLocation('');
        setSelectedCategory('');
        onFilterChange({ types: [], location: '', category: '' });
    };

    const hasFilters = selectedTypes.length > 0 || selectedLocation || selectedCategory;

    const checkboxStyle = (active: boolean) => ({
        width: '24px',
        height: '24px',
        borderRadius: '8px',
        border: active ? '3px solid #2563eb' : '2px solid #e2e8f0',
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        background: active ? '#2563eb' : 'white',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0,
        boxShadow: active ? '0 8px 16px rgba(37,99,235,0.2)' : 'none'
    });

    return (
        <div style={{
            background: 'white',
            padding: '3rem 2.5rem',
            borderRadius: '40px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '16px', 
                        background: '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb'
                    }}>
                        <SlidersHorizontal size={24} strokeWidth={3} />
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.04em' }}>Discovery</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {hasFilters && (
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearAll}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: '#f8fafc', border: '1px solid #f1f5f9', color: '#64748b',
                                padding: '0.6rem 1rem', borderRadius: '14px',
                                fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer',
                            }}
                        >
                            <RotateCcw size={14} strokeWidth={3} /> Reset
                        </motion.button>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            style={{
                                background: '#f8fafc', border: 'none', padding: '0.75rem',
                                borderRadius: '14px', cursor: 'pointer', color: '#475569'
                            }}
                            className="desktop-hide"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>

            {/* Job Type */}
            <div style={{ marginBottom: '3rem' }}>
                <h4 style={{
                    fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8',
                    marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>
                    Employment Tier
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {JOB_TYPES.map(type => {
                        const active = selectedTypes.includes(type);
                        return (
                            <motion.label
                                key={type}
                                whileHover={{ x: 6 }}
                                onClick={() => toggleType(type)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                                    cursor: 'pointer', fontSize: '1.05rem', color: active ? '#0f172a' : '#64748b',
                                    fontWeight: active ? 800 : 600,
                                    padding: '4px 0',
                                    transition: 'color 0.2s'
                                }}
                            >
                                <div style={checkboxStyle(active)}>
                                    <AnimatePresence>
                                        {active && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 45 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                            >
                                                <Check size={16} color="white" strokeWidth={4.5} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span>{type}</span>
                            </motion.label>
                        );
                    })}
                </div>
            </div>

            {/* Job Category */}
            <div style={{ marginBottom: '3rem' }}>
                <h4 style={{
                    fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8',
                    marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>
                    Core Specialization
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {JOB_CATEGORIES.map(cat => {
                        const active = selectedCategory === cat;
                        return (
                            <motion.label
                                key={cat}
                                whileHover={{ x: 6 }}
                                onClick={() => selectCategory(cat)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                                    cursor: 'pointer', fontSize: '1.05rem', color: active ? '#0f172a' : '#64748b',
                                    fontWeight: active ? 800 : 600,
                                    padding: '4px 0',
                                    transition: 'color 0.2s'
                                }}
                            >
                                <div style={checkboxStyle(active)}>
                                    <AnimatePresence>
                                        {active && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                            >
                                                <Check size={16} color="white" strokeWidth={4.5} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span>{cat}</span>
                            </motion.label>
                        );
                    })}
                </div>
            </div>

            {/* Work Location */}
            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                    fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8',
                    marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>
                    Workspace Dynamics
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {LOCATIONS.map(loc => {
                        const active = selectedLocation === loc;
                        return (
                            <motion.label
                                key={loc}
                                whileHover={{ x: 6 }}
                                onClick={() => selectLocation(loc)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                                    cursor: 'pointer', fontSize: '1.05rem', color: active ? '#0f172a' : '#64748b',
                                    fontWeight: active ? 800 : 600,
                                    padding: '4px 0',
                                    transition: 'color 0.2s'
                                }}
                            >
                                <div style={checkboxStyle(active)}>
                                    <AnimatePresence>
                                        {active && (
                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                            >
                                                <Check size={16} color="white" strokeWidth={4.5} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span>{loc}</span>
                            </motion.label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
