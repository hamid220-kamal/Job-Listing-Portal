"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import Button from '@/components/Button';
import Link from 'next/link';
import s from '../../profile.module.css';
import { 
    Building2, MapPin, Globe, Mail, Phone, Users, 
    Link as LinkIcon, Plus, X, Upload, Save, Eye,
    Sparkles, Linkedin, Twitter, Facebook, ExternalLink,
    Briefcase, Info, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Types ─── */
interface LocationObj { city: string; state: string; country: string; }
interface CompanySocial { linkedin: string; twitter: string; facebook: string; }
interface ProfileForm {
    name: string; email: string; phone: string;
    company: string; companyDescription: string;
    industry: string; companySize: string;
    website: string; logo: string;
    companyBenefits: string[];
    companySocialLinks: CompanySocial;
    location: LocationObj;
}

const TABS = [
    { id: 'Company Details', icon: Building2 },
    { id: 'Contact & Location', icon: MapPin },
    { id: 'Online Presence', icon: Globe },
] as const;

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Media & Entertainment', 'Real Estate', 'Non-Profit', 'Other'];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

export default function EmployerProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState<typeof TABS[number]['id']>('Company Details');
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [benefitInput, setBenefitInput] = useState('');
    const [completeness, setCompleteness] = useState({ score: 0, missing: [] as string[] });
    const [uploadingLogo, setUploadingLogo] = useState(false);
    
    const logoRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<ProfileForm>({
        name: '', email: '', phone: '',
        company: '', companyDescription: '',
        industry: '', companySize: '',
        website: '', logo: '',
        companyBenefits: [],
        companySocialLinks: { linkedin: '', twitter: '', facebook: '' },
        location: { city: '', state: '', country: '' },
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'employer')) {
            router.push(user ? '/dashboard/candidate' : '/auth/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const { data } = await api.get('/profile');
                setForm({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    company: data.company || '',
                    companyDescription: data.companyDescription || '',
                    industry: data.industry || '',
                    companySize: data.companySize || '',
                    website: data.website || '',
                    logo: data.logo || '',
                    companyBenefits: Array.isArray(data.companyBenefits) ? data.companyBenefits : [],
                    companySocialLinks: { linkedin: '', twitter: '', facebook: '', ...data.companySocialLinks },
                    location: { city: '', state: '', country: '', ...data.location },
                });
                if (data.completeness) setCompleteness(data.completeness);
            } finally {
                setFetching(false);
            }
        })();
    }, [user]);

    const handleSet = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNested = (group: 'companySocialLinks' | 'location', key: string, val: string) => {
        setForm(prev => ({ ...prev, [group]: { ...prev[group], [key]: val } }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingLogo(true);
        const fd = new FormData();
        fd.append('logo', file);
        try {
            const { data } = await api.post('/profile/upload-logo', fd);
            setForm(prev => ({ ...prev, logo: data.logo }));
            toast.success('Company logo updated');
        } catch {
            toast.error('Logo upload failed');
        } finally {
            setUploadingLogo(false);
        }
    };

    const save = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.put('/profile', form);
            if (data.completeness) setCompleteness(data.completeness);
            toast.success('Organization profile updated');
        } catch {
            toast.error('Failed to sync changes');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || fetching || !user) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <div style={{ width: 40, height: 40, border: '4px solid #f1f5f9', borderTopColor: '#2563eb', borderRadius: '50%' }} />
            </motion.div>
        </div>;
    }

    const barColor = completeness.score < 40 ? '#ef4444' : completeness.score < 70 ? '#f59e0b' : '#10b981';

    return (
        <div className={s.container}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                
                {/* ── Header ── */}
                <div className={s.header}>
                    <div className={s.avatarWrap}>
                        {form.logo ? (
                            <img src={form.logo} alt="" className={s.avatar} style={{ borderRadius: '24px', background: '#fff', padding: '1rem', objectFit: 'contain' }} />
                        ) : (
                            <div className={s.avatarPlaceholder} onClick={() => logoRef.current?.click()} style={{ borderRadius: '24px' }}>
                                <Building2 size={40} />
                            </div>
                        )}
                        <button className={s.avatarUploadBtn} onClick={() => logoRef.current?.click()} disabled={uploadingLogo}>
                            {uploadingLogo ? '...' : <Upload size={18} />}
                        </button>
                        <input ref={logoRef} type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                    </div>
                    <div className={s.headerInfo}>
                        <h1>{form.company || 'Initialize Company'}</h1>
                        <p>{form.industry ? `${form.industry} • ${form.companySize || 'Growing'} HQ` : 'Set up your organizational presence'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href={`/profile/employer/${user._id}`} target="_blank">
                            <motion.button whileHover={{ y: -2 }} style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ExternalLink size={18} /> Public Preview
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* ── Strength ── */}
                <div className={s.completeness}>
                    <div className={s.completenessHeader}>
                        <span className={s.completenessLabel}>Branding Strength</span>
                        <span className={s.completenessScore} style={{ color: barColor }}>{completeness.score}%</span>
                    </div>
                    <div className={s.completenessBar}>
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${completeness.score}%` }} 
                            transition={{ duration: 1 }}
                            className={s.completenessFill} 
                            style={{ background: barColor }} 
                        />
                    </div>
                    <div className={s.completenessTips}>
                        {completeness.missing.map(m => (
                            <span key={m} className={s.completenessTip}>+ {m}</span>
                        ))}
                    </div>
                </div>

                {/* ── Navigation ── */}
                <div className={s.tabs}>
                    {TABS.map(({ id, icon: Icon }) => (
                        <button key={id} onClick={() => setTab(id)} className={`${s.tab} ${tab === id ? s.tabActive : ''}`}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Icon size={16} /> {id}
                            </span>
                        </button>
                    ))}
                </div>

                <form onSubmit={save} style={{ minHeight: '500px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {tab === 'Company Details' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><Info size={24} /> Organization Overview</h2>
                                        <div className={s.formGrid}>
                                            <div className={s.field}>
                                                <label className={s.label}>Company Brand Name</label>
                                                <input className={s.input} name="company" value={form.company} onChange={handleSet} placeholder="e.g. Acme Tech" />
                                            </div>
                                            <div className={s.formRow}>
                                                <div className={s.field}>
                                                    <label className={s.label}>Core Industry</label>
                                                    <select className={s.select} name="industry" value={form.industry} onChange={handleSet}>
                                                        <option value="">Select Domain</option>
                                                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                                    </select>
                                                </div>
                                                <div className={s.field}>
                                                    <label className={s.label}>Workforce Scale</label>
                                                    <select className={s.select} name="companySize" value={form.companySize} onChange={handleSet}>
                                                        <option value="">Select Size</option>
                                                        {SIZES.map(s => <option key={s} value={s}>{s} members</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={s.field}>
                                                <label className={s.label}>Company Story & Mission</label>
                                                <textarea className={s.textarea} name="companyDescription" value={form.companyDescription} onChange={handleSet} placeholder="Share your company's vision, culture, and achievements..." />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><Heart size={24} /> Company Perks & Benefits</h2>
                                        <div className={s.tagsWrap}>
                                            {form.companyBenefits.map((b, i) => (
                                                <span key={i} className={s.tag} style={{ background: '#2563eb' }}>
                                                    {b} <button type="button" className={s.tagRemove} onClick={() => setForm(f => ({ ...f, companyBenefits: f.companyBenefits.filter((_, idx) => idx !== i) }))}><X size={14} /></button>
                                                </span>
                                            ))}
                                            <input 
                                                className={s.tagInput} 
                                                placeholder="Add a perk (e.g. Remote Work) & press Enter" 
                                                value={benefitInput} 
                                                onChange={e => setBenefitInput(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (benefitInput.trim() && !form.companyBenefits.includes(benefitInput.trim())) {
                                                            setForm(f => ({ ...f, companyBenefits: [...f.companyBenefits, benefitInput.trim()] }));
                                                            setBenefitInput('');
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tab === 'Contact & Location' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><User size={24} /> Authorized Contact</h2>
                                        <div className={s.formGrid}>
                                            <div className={s.formRow}>
                                                <div className={s.field}>
                                                    <label className={s.label}>Representative Name</label>
                                                    <input className={s.input} name="name" value={form.name} onChange={handleSet} placeholder="Your full name" />
                                                </div>
                                                <div className={s.field}>
                                                    <label className={s.label}>Office Email</label>
                                                    <input className={s.inputReadonly} value={form.email} readOnly />
                                                </div>
                                            </div>
                                            <div className={s.field}>
                                                <label className={s.label}>Contact Phone</label>
                                                <div style={{ position: 'relative' }}>
                                                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#94a3b8' }} />
                                                    <input className={s.input} style={{ paddingLeft: '3rem' }} name="phone" value={form.phone} onChange={handleSet} placeholder="+1 (000) 000-0000" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><MapPin size={24} /> Headquarters</h2>
                                        <div className={s.formRowThree}>
                                            <div className={s.field}>
                                                <label className={s.label}>City</label>
                                                <input className={s.input} value={form.location.city} onChange={e => handleNested('location', 'city', e.target.value)} placeholder="San Francisco" />
                                            </div>
                                            <div className={s.field}>
                                                <label className={s.label}>State / Prov</label>
                                                <input className={s.input} value={form.location.state} onChange={e => handleNested('location', 'state', e.target.value)} placeholder="California" />
                                            </div>
                                            <div className={s.field}>
                                                <label className={s.label}>Country</label>
                                                <input className={s.input} value={form.location.country} onChange={e => handleNested('location', 'country', e.target.value)} placeholder="USA" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tab === 'Online Presence' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><Globe size={24} /> Corporate Ecosystem</h2>
                                        <div className={s.formGrid}>
                                            <div className={s.field}>
                                                <label className={s.label}>Official Website</label>
                                                <div style={{ position: 'relative' }}>
                                                    <Globe size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#2563eb' }} />
                                                    <input className={s.input} style={{ paddingLeft: '3rem' }} name="website" value={form.website} onChange={handleSet} placeholder="https://acme.com" />
                                                </div>
                                            </div>
                                            
                                            <div className={s.formRow}>
                                                <div className={s.field}>
                                                    <label className={s.label}>LinkedIn Page</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Linkedin size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#0077b5' }} />
                                                        <input className={s.input} style={{ paddingLeft: '3rem' }} value={form.companySocialLinks.linkedin} onChange={e => handleNested('companySocialLinks', 'linkedin', e.target.value)} placeholder="linkedin.com/company/acme" />
                                                    </div>
                                                </div>
                                                <div className={s.field}>
                                                    <label className={s.label}>Twitter / X</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Twitter size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#1DA1F2' }} />
                                                        <input className={s.input} style={{ paddingLeft: '3rem' }} value={form.companySocialLinks.twitter} onChange={e => handleNested('companySocialLinks', 'twitter', e.target.value)} placeholder="twitter.com/acme" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={s.field}>
                                                <label className={s.label}>Facebook Presence</label>
                                                <div style={{ position: 'relative' }}>
                                                    <Facebook size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#1877F2' }} />
                                                    <input className={s.input} style={{ paddingLeft: '3rem' }} value={form.companySocialLinks.facebook} onChange={e => handleNested('companySocialLinks', 'facebook', e.target.value)} placeholder="facebook.com/acme" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* ── Actions ── */}
                    <div className={s.actions}>
                        <Button type="button" variant="secondary" onClick={() => router.push('/dashboard/employer')}>
                            Discard Changes
                        </Button>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={saving}
                            style={{ 
                                padding: '1rem 2.5rem', borderRadius: '18px', background: '#0f172a', 
                                color: 'white', border: 'none', fontWeight: 900, fontSize: '1rem', 
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)'
                            }}
                        >
                            {saving ? 'Syncing...' : <><Save size={20} /> Deploy Changes</>}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function User({ size, color }: { size?: number, color?: string }) {
    return <Briefcase size={size} color={color} />; // Fallback or imported
}
