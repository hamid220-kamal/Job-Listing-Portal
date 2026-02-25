"use client";

import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    User,
    Briefcase,
    Settings,
    Bell,
    ChevronRight,
    Search
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const pathname = usePathname();

    if (!user) return <>{children}</>;

    const role = user.role;
    const baseRoute = `/dashboard/${role}`;

    const navItems = role === 'employer'
        ? [
            { name: 'Overview', href: baseRoute, icon: LayoutDashboard },
            { name: 'Manage Jobs', href: `${baseRoute}/jobs`, icon: Briefcase }, // Adjust if needed
            { name: 'Applicants', href: `${baseRoute}/applications`, icon: Bell },
            { name: 'Company Profile', href: `${baseRoute}/profile`, icon: User },
        ]
        : [
            { name: 'Overview', href: baseRoute, icon: LayoutDashboard },
            { name: 'My Applications', href: `${baseRoute}/applications`, icon: Briefcase },
            { name: 'My Profile', href: `${baseRoute}/profile`, icon: User },
            { name: 'Account Settings', href: `${baseRoute}/settings`, icon: Settings },
        ];

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            {/* Desktop Sidebar */}
            <aside className="desktop-only" style={{
                width: '280px',
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'sticky',
                top: '80px',
                height: 'calc(100vh - 80px)'
            }}>
                <div style={{ padding: '0 1rem 2rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        Dashboard Menu
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'var(--gradient-primary)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            {user.name[0].toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{user.role} Account</p>
                        </div>
                    </div>
                </div>

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ x: 5, background: '#f1f5f9' }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: isActive ? 700 : 500,
                                    color: isActive ? '#2563eb' : '#64748b',
                                    background: isActive ? '#f0f7ff' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <item.icon size={18} />
                                {item.name}
                                {isActive && <motion.div layoutId="sidebar-dot" style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} />}
                            </motion.div>
                        </Link>
                    );
                })}
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, overflowY: 'auto' }}>
                {/* Mobile Submenu (Quick Chips) */}
                <div className="mobile-only" style={{
                    padding: '1rem 1.5rem',
                    background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: '0.5rem',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'none'
                }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '99px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    background: isActive ? '#2563eb' : '#f1f5f9',
                                    color: isActive ? 'white' : '#64748b',
                                    border: isActive ? 'none' : '1px solid #e2e8f0'
                                }}>
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div style={{ padding: '0 0 2rem' }}>
                    {children}
                </div>
            </main>

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                }
                @media (min-width: 769px) {
                    .mobile-only { display: none !important; }
                }
            `}</style>
        </div>
    );
}
