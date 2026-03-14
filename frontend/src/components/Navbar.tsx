"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionTemplate, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import Button from './Button';
import { Search, Bell, Menu, X, Globe, Briefcase, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Companies', href: '/companies' },
];

function MagneticButton({ children, className, style, onClick }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, onClick?: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const ySpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const xPos = e.clientX - (left + width / 2);
        const yPos = e.clientY - (top + height / 2);
        x.set(xPos * 0.3);
        y.set(yPos * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring, ...style }}
            className={className}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
}

import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const { user, logout } = useAuth();

    // Mouse Spotlight Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 10);
    });

    const menuVariants: Variants = {
        open: { 
            x: 0, 
            transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 40,
                staggerChildren: 0.07,
                delayChildren: 0.2
            } 
        },
        closed: { 
            x: "100%", 
            transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 40,
                staggerChildren: 0.05,
                staggerDirection: -1
            } 
        },
    } as any;

    const itemVariants = {
        open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        closed: { opacity: 0, x: 20, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    const overlayVariants = {
        open: { opacity: 1, backdropFilter: 'blur(12px)' },
        closed: { opacity: 0, backdropFilter: 'blur(0px)' },
    };

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                onMouseMove={handleMouseMove}
                className="glass-premium"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100vw',
                    height: '80px',
                    zIndex: 50,
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Spotlight Effect Background */}
                <motion.div
                    className="spotlight"
                    style={{
                        pointerEvents: 'none',
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.4,
                        background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mouseX}px ${mouseY}px,
                  rgba(37, 99, 235, 0.12),
                  transparent 80%
                )
              `,
                    }}
                />

                <div className="container" style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 10
                }}>
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none', zIndex: 20 }}>
                        <motion.div
                            className="logo-container"
                            whileHover="hover"
                            initial="initial"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}
                        >
                            <motion.div
                                variants={{
                                    initial: { rotate: 0, scale: 1 },
                                    hover: { rotate: 180, scale: 1.15, boxShadow: '0 0 30px rgba(37, 99, 235, 0.3)' }
                                }}
                                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                style={{
                                    width: '44px', height: '44px',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ffffff', fontWeight: 900,
                                    fontSize: '1.3rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            >
                                J
                            </motion.div>
                            <motion.span
                                variants={{
                                    initial: { x: 0 },
                                    hover: { x: 5 }
                                }}
                                style={{ fontWeight: 850, fontSize: '1.5rem', color: '#0f172a', letterSpacing: '-0.04em' }}
                            >
                                JobPortal
                            </motion.span>
                        </motion.div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="desktop-only" style={{ 
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: 'rgba(0,0,0,0.03)', padding: '4px', borderRadius: '16px'
                    }}>
                        {navLinks.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 + 0.2 }}
                                >
                                    <Link href={item.href} style={{ position: 'relative', textDecoration: 'none' }}>
                                        <motion.div
                                            style={{
                                                padding: '0.6rem 1.4rem',
                                                borderRadius: '12px',
                                                color: isActive ? '#0f172a' : '#64748b',
                                                fontSize: '0.95rem',
                                                fontWeight: 650,
                                                position: 'relative',
                                                transition: 'color 0.3s ease'
                                            }}
                                            whileHover={{ color: '#0f172a' }}
                                        >
                                            {item.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-pill"
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'white',
                                                        borderRadius: '11px',
                                                        zIndex: -1,
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                                    }}
                                                />
                                            )}
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </nav>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Search"
                            style={{
                                padding: '12px', borderRadius: '14px', border: '1px solid var(--border)',
                                background: 'white', cursor: 'pointer', color: '#1e293b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Search size={20} strokeWidth={2.5} />
                        </motion.button>

                        <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {user ? (
                                <>
                                    <Link href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'}>
                                        <MagneticButton style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem', background: '#0f172a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: '14px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}>
                                            Dashboard
                                        </MagneticButton>
                                    </Link>
                                    <Link href={user.role === 'employer' ? `/profile/employer/${user._id}` : `/profile/candidate/${user._id}`}>
                                        <div style={{ 
                                            width: '44px', height: '44px', borderRadius: '14px', border: '1px solid var(--border)',
                                            overflow: 'hidden', background: '#f8fafc', cursor: 'pointer'
                                        }}>
                                            {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{user.name[0]}</div>}
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login">
                                        <MagneticButton style={{ fontSize: '0.95rem', padding: '0.75rem 1.25rem', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                            Sign in
                                        </MagneticButton>
                                    </Link>
                                    <Link href="/auth/signup">
                                        <MagneticButton style={{ 
                                            fontSize: '0.95rem', padding: '0.75rem 1.75rem', 
                                            background: 'var(--gradient-accent)', color: '#ffffff', 
                                            fontWeight: 800, borderRadius: '14px', border: 'none', 
                                            cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)' 
                                        }}>
                                            Get Started
                                        </MagneticButton>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Icon */}
                        <motion.button
                            className="mobile-only"
                            onClick={() => setIsOpen(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{ 
                                width: '44px', height: '44px', borderRadius: '14px',
                                border: '1px solid var(--border)', background: 'white', 
                                cursor: 'pointer', color: '#0f172a',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <Menu size={24} strokeWidth={2.5} />
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Spacing */}
            <div style={{ height: '80px' }} />

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            variants={overlayVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(2, 6, 23, 0.3)',
                                zIndex: 100
                            }}
                        />
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: '100%',
                                maxWidth: '340px',
                                background: '#ffffff',
                                borderLeft: '1px solid var(--border)',
                                padding: '2rem',
                                zIndex: 101,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'var(--gradient-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>J</div>
                                    <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#0f172a', letterSpacing: '-0.04em' }}>JobPortal</span>
                                </div>
                                <motion.button
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: '#f8fafc', border: '1px solid var(--border)', cursor: 'pointer', color: '#0f172a', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <X size={20} strokeWidth={2.5} />
                                </motion.button>
                            </div>

                            <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {navLinks.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div key={item.name} variants={itemVariants}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1.25rem',
                                                    padding: '1.25rem',
                                                    borderRadius: '18px',
                                                    fontSize: '1.15rem',
                                                    fontWeight: 750,
                                                    color: isActive ? '#2563eb' : '#475569',
                                                    background: isActive ? 'var(--accent-soft)' : 'transparent',
                                                    textDecoration: 'none',
                                                    border: isActive ? '1px solid rgba(37, 99, 235, 0.1)' : '1px solid transparent',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                            >
                                                <div style={{ 
                                                    width: '44px', height: '44px', borderRadius: '12px',
                                                    background: isActive ? 'white' : '#f8fafc',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none'
                                                }}>
                                                    {item.name === 'Home' && <Globe size={22} />}
                                                    {item.name === 'Jobs' && <Briefcase size={22} />}
                                                    {item.name === 'Companies' && <Search size={22} />}
                                                </div>
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>

                            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                                {user ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 0.5rem' }}>
                                            <div style={{
                                                width: '52px', height: '52px', borderRadius: '14px',
                                                background: '#f1f5f9', border: '1px solid #e2e8f0',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#1e293b', fontWeight: 800, overflow: 'hidden'
                                            }}>
                                                {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name[0].toUpperCase()}
                                            </div>
                                            <div style={{ overflow: 'hidden' }}>
                                                <div style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <Link href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'} onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                                                <Button style={{ width: '100%', borderRadius: '12px', height: '50px', background: 'var(--gradient-primary)', border: 'none' }}>
                                                    <LayoutDashboard size={18} style={{ marginRight: '8px' }} /> Go to Dashboard
                                                </Button>
                                            </Link>
                                            <Link href={user.role === 'employer' ? `/profile/employer/${user._id}` : `/profile/candidate/${user._id}`} onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                                                <Button variant="outline" style={{ width: '100%', borderRadius: '12px', height: '50px' }}>My Profile</Button>
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    await logout();
                                                    setIsOpen(false);
                                                    toast.success('Logged out');
                                                }}
                                                style={{
                                                    width: '100%', padding: '0.85rem', background: '#fff', color: '#ef4444',
                                                    border: '1px solid #fee2e2', borderRadius: '12px',
                                                    fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem'
                                                }}
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <Link href="/auth/login" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                                            <Button variant="outline" style={{ width: '100%', borderRadius: '12px', height: '50px', border: '1px solid #e2e8f0' }}>Sign in</Button>
                                        </Link>
                                        <Link href="/auth/signup" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                                            <Button style={{ width: '100%', borderRadius: '12px', height: '50px', background: '#2563eb' }}>Create Account</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
        </>
    );
}
