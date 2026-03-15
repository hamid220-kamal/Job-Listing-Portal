"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
    Settings, Lock, Mail, User, 
    Shield, Bell, Trash2, Save,
    CheckCircle, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import Button from '@/components/Button';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function AccountSettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

    // Handle password change submission
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('New passwords do not match');
        }

        if (passwords.newPassword.length < 8) {
            return toast.error('Password must be at least 8 characters');
        }

        setLoading(true);
        try {
            await api.put('/auth/update-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success('Password updated successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ padding: '3rem 2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>
                        Account <span style={{ color: '#2563eb' }}>Settings</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                        Manage your account security and personal preferences.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
                    
                    {/* Main Settings Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        
                        {/* Account Info Section */}
                        <section style={{ 
                            background: 'white', padding: '2.5rem', borderRadius: '40px', 
                            border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' 
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ 
                                    width: 48, height: 48, borderRadius: '14px', 
                                    background: '#eff6ff', color: '#3b82f6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Account Information</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Your basic account identity details.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Full Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={user.name} 
                                            disabled
                                            style={{ 
                                                padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0',
                                                background: '#f8fafc', color: '#94a3b8', fontSize: '1rem', fontWeight: 500
                                            }} 
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Email Address</label>
                                        <input 
                                            type="email" 
                                            defaultValue={user.email} 
                                            disabled
                                            style={{ 
                                                padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0',
                                                background: '#f8fafc', color: '#94a3b8', fontSize: '1rem', fontWeight: 500
                                            }} 
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <AlertCircle size={18} color="#64748b" />
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                        To change your email or name, please visit your <Link href="/dashboard/candidate/profile" style={{ color: '#2563eb', fontWeight: 700 }}>Profile Page</Link>.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Security Section */}
                        <section style={{ 
                            background: 'white', padding: '2.5rem', borderRadius: '40px', 
                            border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' 
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ 
                                    width: 48, height: 48, borderRadius: '14px', 
                                    background: '#fef2f2', color: '#ef4444',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Security & Password</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Keep your account safe with a strong password.</p>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Current Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type={showPass.current ? 'text' : 'password'} 
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            placeholder="Enter current password"
                                            style={{ 
                                                width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', 
                                                border: '1px solid #e2e8f0', background: 'white', 
                                                fontSize: '1rem', fontWeight: 500, outline: 'none'
                                            }} 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                                            style={{ position: 'absolute', right: '1rem', top: '1.1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                        >
                                            {showPass.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>New Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input 
                                                type={showPass.new ? 'text' : 'password'} 
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                placeholder="Minimum 8 characters"
                                                style={{ 
                                                    width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', 
                                                    border: '1px solid #e2e8f0', background: 'white', 
                                                    fontSize: '1rem', fontWeight: 500, outline: 'none'
                                                }} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                                                style={{ position: 'absolute', right: '1rem', top: '1.1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                            >
                                                {showPass.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Confirm New Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input 
                                                type={showPass.confirm ? 'text' : 'password'} 
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                placeholder="Repeat new password"
                                                style={{ 
                                                    width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', 
                                                    border: '1px solid #e2e8f0', background: 'white', 
                                                    fontSize: '1rem', fontWeight: 500, outline: 'none'
                                                }} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                                                style={{ position: 'absolute', right: '1rem', top: '1.1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                            >
                                                {showPass.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '0.5rem' }}>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={loading || !passwords.newPassword}
                                        style={{ width: '100%', borderRadius: '16px', padding: '1rem' }}
                                    >
                                        {loading ? 'Changing Password...' : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Sidebar / Tips */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ 
                            background: '#0f172a', color: 'white', padding: '2rem', 
                            borderRadius: '40px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ 
                                    width: 40, height: 40, borderRadius: '12px', 
                                    background: 'rgba(255,255,255,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' 
                                }}>
                                    <Shield size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Security Tips</h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, listStyle: 'none' }}>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
                                        <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        Use at least 8 characters with a mix of letters, numbers, and symbols.
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
                                        <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        Avoid using common words or personal info like birthdays.
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
                                        <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        Change your password regularly for maximum account safety.
                                    </li>
                                </ul>
                            </div>
                            <div style={{ 
                                position: 'absolute', bottom: '-50px', right: '-50px', width: 200, height: 200, 
                                background: '#2563eb', opacity: 0.1, filter: 'blur(60px)', borderRadius: '50%' 
                            }} />
                        </div>

                        <div style={{ 
                            padding: '2rem', borderRadius: '40px', border: '2px dashed #f1f5f9',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.5rem' }}>Danger Zone</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '1.5rem' }}>
                                Request account deletion or data closure.
                            </p>
                            <Button variant="outline" style={{ borderColor: '#ef4444', color: '#ef4444', width: '100%', borderRadius: '16px' }}>
                                Delete Account
                            </Button>
                        </div>
                    </aside>
                </div>
            </motion.div>
        </div>
    );
}
