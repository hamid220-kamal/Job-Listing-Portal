"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionTemplate, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import Button from './Button';
import { Search, Bell, Menu, X, Globe, Zap, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Internships', href: '/jobs?type=Internship' },
    { name: 'Jobs', href: '/jobs?type=Full-time' },
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
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    } as any;

    const overlayVariants = {
        open: { opacity: 1 },
        closed: { opacity: 0 },
    };

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                onMouseMove={handleMouseMove}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100vw',
                    height: '80px', // Slightly taller for premium feel
                    zIndex: 50,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light Glass
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
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
                        opacity: 0.3,
                        background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mouseX}px ${mouseY}px,
                  rgba(37, 99, 235, 0.08),
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
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                        >
                            <motion.div
                                variants={{
                                    initial: { rotate: 0, scale: 1 },
                                    hover: { rotate: 180, scale: 1.1, boxShadow: '0 0 20px rgba(37, 99, 235, 0.2)' }
                                }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                style={{
                                    width: '40px', height: '40px',
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ffffff', fontWeight: 900,
                                    fontSize: '1.2rem'
                                }}
                            >
                                J
                            </motion.div>
                            <motion.span
                                variants={{
                                    initial: { x: 0 },
                                    hover: { x: 5 }
                                }}
                                style={{ fontWeight: 700, fontSize: '1.4rem', color: '#0f172a', letterSpacing: '-0.03em' }}
                            >
                                JobPortal
                            </motion.span>
                        </motion.div>
                    </Link>

                    {/* Desktop Nav Links - Staggered Entry */}
                    <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                                padding: '0.6rem 1.2rem',
                                                borderRadius: '12px',
                                                color: isActive ? '#0f172a' : '#64748b',
                                                fontSize: '0.95rem',
                                                fontWeight: 500,
                                                position: 'relative'
                                            }}
                                            whileHover={{ color: '#0f172a', backgroundColor: 'rgba(0,0,0,0.03)' }}
                                        >
                                            {item.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-glow"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -2,
                                                        left: '50%',
                                                        x: '-50%',
                                                        width: '20px',
                                                        height: '2px',
                                                        background: '#2563eb',
                                                        borderRadius: '2px',
                                                        boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)'
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Search"
                            style={{
                                padding: '12px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.05)',
                                background: 'rgba(0,0,0,0.02)', cursor: 'pointer', color: '#1e293b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <Search size={20} />
                        </motion.button>

                        <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {user ? (
                                <>
                                    <Link href={user.role === 'employer' ? `/profile/employer/${user._id}` : `/profile/candidate/${user._id}`}>
                                        <MagneticButton style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem', background: 'transparent', color: '#1e293b', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                            My Profile
                                        </MagneticButton>
                                    </Link>
                                    <MagneticButton
                                        onClick={async () => {
                                            await logout();
                                            toast.success('Logged out successfully');
                                        }}
                                        style={{ fontSize: '0.95rem', padding: '0.75rem 1.75rem', background: '#ef4444', color: '#ffffff', fontWeight: 700, borderRadius: '99px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
                                    >
                                        Logout
                                    </MagneticButton>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login">
                                        <MagneticButton style={{ fontSize: '0.9rem', padding: '0.75rem 1.25rem', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                            Sign in
                                        </MagneticButton>
                                    </Link>
                                    <Link href="/auth/signup">
                                        <MagneticButton style={{ fontSize: '0.9rem', padding: '0.75rem 1.75rem', background: '#2563eb', color: '#ffffff', fontWeight: 700, borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                                            Get Started
                                        </MagneticButton>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Icon */}
                        <button
                            className="mobile-only"
                            onClick={() => setIsOpen(true)}
                            aria-label="Menu"
                            style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#0f172a' }}
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Spacing for fixed header */}
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
                                background: 'rgba(15, 23, 42, 0.4)',
                                backdropFilter: 'blur(12px)',
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
                                maxWidth: '320px',
                                background: '#ffffff',
                                boxShadow: '-20px 0 60px -15px rgba(0, 0, 0, 0.1)',
                                padding: '1.5rem',
                                zIndex: 101,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>J</div>
                                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.02em' }}>JobPortal</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#0f172a', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {navLinks.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '1rem 1.25rem',
                                                borderRadius: '16px',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                color: isActive ? '#2563eb' : '#475569',
                                                background: isActive ? '#f0f7ff' : 'transparent',
                                                textDecoration: 'none',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ color: isActive ? '#2563eb' : '#94a3b8' }}>
                                                {item.name === 'Home' && <Globe size={20} />}
                                                {item.name === 'Internships' && <Zap size={20} />}
                                                {item.name === 'Jobs' && <Briefcase size={20} />}
                                                {item.name === 'Companies' && <Search size={20} />}
                                            </div>
                                            {item.name}
                                            {isActive && <motion.div layoutId="active-pill-mob" style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} />}
                                        </Link>
                                    );
                                })}
                            </div>

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
                                            <Link href={user.role === 'employer' ? `/profile/employer/${user._id}` : `/profile/candidate/${user._id}`} onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                                                <Button style={{ width: '100%', borderRadius: '12px', height: '50px' }}>Go to Profile</Button>
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
