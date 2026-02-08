"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Button from './Button';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                height: 'var(--nav-height)',
                display: 'flex',
                alignItems: 'center',
                background: scrolled ? 'rgba(250, 250, 250, 0.8)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
                transition: 'background 0.3s, border-bottom 0.3s, backdrop-filter 0.3s'
            }}
        >
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo */}
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>J</div>
                    <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>JobPortal</span>
                </Link>

                {/* Navigation Links */}
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    {[
                        { name: 'Find Jobs', href: '/jobs' },
                        { name: 'Companies', href: '/companies' },
                        { name: 'Salaries', href: '/salaries' }
                    ].map((item) => (
                        <Link key={item.name} href={item.href} style={{ position: 'relative', fontWeight: 500, color: 'var(--secondary-foreground)' }} className="nav-link">
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/auth/login">
                        <Button variant="ghost">Log in</Button>
                    </Link>
                    <Link href="/auth/signup">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button style={{ background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }}>
                                Sign up
                            </Button>
                        </motion.div>
                    </Link>
                </div>
            </div>

            <style jsx global>{`
        .nav-link:hover {
          color: var(--primary);
        }
      `}</style>
        </motion.nav>
    );
}
