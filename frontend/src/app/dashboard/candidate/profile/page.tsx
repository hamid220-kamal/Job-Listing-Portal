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
    User, Briefcase, GraduationCap, Link as LinkIcon, 
    ChevronRight, Plus, X, Upload, Save, Eye,
    Trash2, MapPin, Phone, Mail, FileText, Globe,
    Linkedin, Github, Twitter, Sparkles, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Types ───────────────────────────────────── */
interface ExpEntry {
    _id?: string; title: string; company: string;
    startDate: string; endDate: string; current: boolean; description: string;
}
interface EduEntry {
    _id?: string; degree: string; institution: string;
    startYear: string; endYear: string; description: string;
}
interface SocialLinks { linkedin: string; github: string; portfolio: string; twitter: string; }
interface LocationObj { city: string; state: string; country: string; }
interface ProfileForm {
    name: string; email: string; phone: string; headline: string;
    avatar: string; bio: string; skills: string[];
    experience: ExpEntry[]; education: EduEntry[];
    resume: string; resumeFileName: string;
    socialLinks: SocialLinks; location: LocationObj;
}

const TABS = [
    { id: 'Personal', icon: User },
    { id: 'Professional', icon: Briefcase },
    { id: 'Resume & Links', icon: LinkIcon },
] as const;

const emptyExp: ExpEntry = { title: '', company: '', startDate: '', endDate: '', current: false, description: '' };
const emptyEdu: EduEntry = { degree: '', institution: '', startYear: '', endYear: '', description: '' };

export default function CandidateProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState<typeof TABS[number]['id']>('Personal');
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [skillInput, setSkillInput] = useState('');
    const [completeness, setCompleteness] = useState({ score: 0, missing: [] as string[] });
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    
    const avatarRef = useRef<HTMLInputElement>(null);
    const resumeRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<ProfileForm>({
        name: '', email: '', phone: '', headline: '',
        avatar: '', bio: '', skills: [],
        experience: [], education: [],
        resume: '', resumeFileName: '',
        socialLinks: { linkedin: '', github: '', portfolio: '', twitter: '' },
        location: { city: '', state: '', country: '' },
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'candidate')) {
            router.push(user ? '/dashboard/employer' : '/auth/login');
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
                    headline: data.headline || '',
                    avatar: data.avatar || '',
                    bio: data.bio || '',
                    skills: Array.isArray(data.skills) ? data.skills : [],
                    experience: Array.isArray(data.experience) ? data.experience : [],
                    education: Array.isArray(data.education) ? data.education : [],
                    resume: data.resume || '',
                    resumeFileName: data.resumeFileName || '',
                    socialLinks: { linkedin: '', github: '', portfolio: '', twitter: '', ...data.socialLinks },
                    location: { city: '', state: '', country: '', ...data.location },
                });
                if (data.completeness) setCompleteness(data.completeness);
            } finally {
                setFetching(false);
            }
        })();
    }, [user]);

    const handleSet = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNested = (group: 'socialLinks' | 'location', key: string, val: string) => {
        setForm(prev => ({ ...prev, [group]: { ...prev[group], [key]: val } }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingAvatar(true);
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            const { data } = await api.post('/profile/upload-avatar', fd);
            setForm(prev => ({ ...prev, avatar: data.avatar }));
            toast.success('Profile photo updated');
        } catch {
            toast.error('Avatar upload failed');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingResume(true);
        const fd = new FormData();
        fd.append('resume', file);
        try {
            const { data } = await api.post('/profile/upload-resume', fd);
            setForm(prev => ({ ...prev, resume: data.resume, resumeFileName: data.resumeFileName }));
            toast.success('Resume uploaded successfully');
        } catch {
            toast.error('Resume upload failed');
        } finally {
            setUploadingResume(false);
        }
    };

    const save = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.put('/profile', form);
            if (data.completeness) setCompleteness(data.completeness);
            toast.success('Profile updated successfully');
        } catch {
            toast.error('Failed to save changes');
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
                        {form.avatar ? (
                            <img src={form.avatar} alt="" className={s.avatar} />
                        ) : (
                            <div className={s.avatarPlaceholder} onClick={() => avatarRef.current?.click()}>
                                {form.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <button className={s.avatarUploadBtn} onClick={() => avatarRef.current?.click()} disabled={uploadingAvatar}>
                            {uploadingAvatar ? '...' : <Plus size={18} />}
                        </button>
                        <input ref={avatarRef} type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                    </div>
                    <div className={s.headerInfo}>
                        <h1>{form.name || 'Complete your profile'}</h1>
                        <p>{form.headline || 'Your professional identity'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href={`/profile/candidate/${user._id}`} target="_blank">
                            <motion.button whileHover={{ y: -2 }} style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Eye size={18} /> Preview Profile
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* ── Strength ── */}
                <div className={s.completeness}>
                    <div className={s.completenessHeader}>
                        <span className={s.completenessLabel}>Profile Integrity</span>
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
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                            {tab === 'Personal' && (
                                <div className={s.section}>
                                    <h2 className={s.sectionTitle}><User size={24} /> Basic Information</h2>
                                    <div className={s.formGrid}>
                                        <div className={s.formRow}>
                                            <div className={s.field}>
                                                <label className={s.label}>Full Name</label>
                                                <input className={s.input} name="name" value={form.name} onChange={handleSet} placeholder="e.g. Alex Johnson" />
                                            </div>
                                            <div className={s.field}>
                                                <label className={s.label}>Professional Title</label>
                                                <input className={s.input} name="headline" value={form.headline} onChange={handleSet} placeholder="e.g. Fullstack Developer" />
                                            </div>
                                        </div>
                                        <div className={s.formRow}>
                                            <div className={s.field}>
                                                <label className={s.label}>Phone Number</label>
                                                <div style={{ position: 'relative' }}>
                                                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '1.1rem', color: '#94a3b8' }} />
                                                    <input className={s.input} name="phone" value={form.phone} onChange={handleSet} style={{ paddingLeft: '3rem' }} placeholder="+1 (555) 000-0000" />
                                                </div>
                                            </div>
                                            <div className={s.field}>
                                                <label className={s.label}>Location</label>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <input className={s.input} placeholder="City" value={form.location.city} onChange={e => handleNested('location', 'city', e.target.value)} />
                                                    <input className={s.input} placeholder="Country" value={form.location.country} onChange={e => handleNested('location', 'country', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={s.field}>
                                            <label className={s.label}>Personal Biography</label>
                                            <textarea className={s.textarea} name="bio" value={form.bio} onChange={handleSet} placeholder="Describe your professional journey and aspirations..." />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tab === 'Professional' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><Sparkles size={24} /> Skillset Mastery</h2>
                                        <div className={s.tagsWrap}>
                                            {form.skills.map((sk, i) => (
                                                <span key={i} className={s.tag}>
                                                    {sk} <button type="button" className={s.tagRemove} onClick={() => setForm(f => ({ ...f, skills: f.skills.filter((_, idx) => idx !== i) }))}><X size={14} /></button>
                                                </span>
                                            ))}
                                            <input 
                                                className={s.tagInput} 
                                                placeholder="Add a skill & press Enter" 
                                                value={skillInput} 
                                                onChange={e => setSkillInput(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
                                                            setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }));
                                                            setSkillInput('');
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><Briefcase size={24} /> Professional Experience</h2>
                                        {form.experience.map((exp, i) => (
                                            <div key={i} className={s.entry}>
                                                <button type="button" className={s.entryRemove} onClick={() => setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }))}><Trash2 size={18} /></button>
                                                <div className={s.formGrid}>
                                                    <div className={s.formRow}>
                                                        <input className={s.input} placeholder="Position / Title" value={exp.title} onChange={e => { const list = [...form.experience]; list[i].title = e.target.value; setForm(f => ({ ...f, experience: list }))}} />
                                                        <input className={s.input} placeholder="Company Name" value={exp.company} onChange={e => { const list = [...form.experience]; list[i].company = e.target.value; setForm(f => ({ ...f, experience: list }))}} />
                                                    </div>
                                                    <div className={s.formRow}>
                                                        <input className={s.input} type="month" value={exp.startDate} onChange={e => { const list = [...form.experience]; list[i].startDate = e.target.value; setForm(f => ({ ...f, experience: list }))}} />
                                                        <input className={s.input} type="month" value={exp.endDate} disabled={exp.current} onChange={e => { const list = [...form.experience]; list[i].endDate = e.target.value; setForm(f => ({ ...f, experience: list }))}} />
                                                    </div>
                                                    <textarea className={s.textarea} placeholder="Key achievements and impact..." value={exp.description} onChange={e => { const list = [...form.experience]; list[i].description = e.target.value; setForm(f => ({ ...f, experience: list }))}} />
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" className={s.addEntry} onClick={() => setForm(f => ({ ...f, experience: [...f.experience, { ...emptyExp }] }))}>
                                            <Plus size={18} /> Add Role
                                        </button>
                                    </div>

                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><GraduationCap size={24} /> Academic Journey</h2>
                                        {form.education.map((edu, i) => (
                                            <div key={i} className={s.entry}>
                                                <button type="button" className={s.entryRemove} onClick={() => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }))}><Trash2 size={18} /></button>
                                                <div className={s.formGrid}>
                                                    <div className={s.formRow}>
                                                        <input className={s.input} placeholder="Degree / Qualification" value={edu.degree} onChange={e => { const list = [...form.education]; list[i].degree = e.target.value; setForm(f => ({ ...f, education: list }))}} />
                                                        <input className={s.input} placeholder="Institution" value={edu.institution} onChange={e => { const list = [...form.education]; list[i].institution = e.target.value; setForm(f => ({ ...f, education: list }))}} />
                                                    </div>
                                                    <div className={s.formRow}>
                                                        <input className={s.input} type="number" placeholder="Start Year" value={edu.startYear} onChange={e => { const list = [...form.education]; list[i].startYear = e.target.value; setForm(f => ({ ...f, education: list }))}} />
                                                        <input className={s.input} type="number" placeholder="End Year" value={edu.endYear} onChange={e => { const list = [...form.education]; list[i].endYear = e.target.value; setForm(f => ({ ...f, education: list }))}} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" className={s.addEntry} onClick={() => setForm(f => ({ ...f, education: [...f.education, { ...emptyEdu }] }))}>
                                            <Plus size={18} /> Add Education
                                        </button>
                                    </div>
                                </div>
                            )}

                            {tab === 'Resume & Links' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><FileText size={24} /> Professional Resume</h2>
                                        <div className={s.uploadArea} onClick={() => resumeRef.current?.click()}>
                                            <div className={s.uploadIcon}>{uploadingResume ? '...' : <Upload size={40} />}</div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                                                {form.resumeFileName || 'Select or drop your PDF resume'}
                                            </h3>
                                            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>PDF format only, maximum 5MB</p>
                                        </div>
                                        <input ref={resumeRef} type="file" accept=".pdf" hidden onChange={handleResumeUpload} />
                                    </div>

                                    <div className={s.section}>
                                        <h2 className={s.sectionTitle}><Globe size={24} /> Online Presence</h2>
                                        <div className={s.formGrid}>
                                            <div className={s.formRow}>
                                                <div className={s.field}>
                                                    <label className={s.label}>LinkedIn Profile</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Linkedin size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#0077b5' }} />
                                                        <input className={s.input} style={{ paddingLeft: '3rem' }} value={form.socialLinks.linkedin} onChange={e => handleNested('socialLinks', 'linkedin', e.target.value)} placeholder="linkedin.com/in/username" />
                                                    </div>
                                                </div>
                                                <div className={s.field}>
                                                    <label className={s.label}>GitHub Profile</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Github size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#181717' }} />
                                                        <input className={s.input} style={{ paddingLeft: '3rem' }} value={form.socialLinks.github} onChange={e => handleNested('socialLinks', 'github', e.target.value)} placeholder="github.com/username" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={s.formRow}>
                                                <div className={s.field}>
                                                    <label className={s.label}>Portfolio / Website</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Globe size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#2563eb' }} />
                                                        <input className={s.input} style={{ paddingLeft: '3rem' }} value={form.socialLinks.portfolio} onChange={e => handleNested('socialLinks', 'portfolio', e.target.value)} placeholder="yourportfolio.com" />
                                                    </div>
                                                </div>
                                                <div className={s.field}>
                                                    <label className={s.label}>Twitter / X</label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Twitter size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#1DA1F2' }} />
                                                        <input className={s.input} style={{ paddingLeft: '3rem' }} value={form.socialLinks.twitter} onChange={e => handleNested('socialLinks', 'twitter', e.target.value)} placeholder="twitter.com/handle" />
                                                    </div>
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
                        <Button type="button" variant="secondary" onClick={() => router.push('/dashboard/candidate')}>
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
