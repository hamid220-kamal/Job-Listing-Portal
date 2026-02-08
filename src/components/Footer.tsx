"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
];

const footerLinks = [
    {
        title: 'Platform',
        links: [
            { name: 'Browse Jobs', href: '/jobs' },
            { name: 'Companies', href: '/companies' },
            { name: 'Salaries', href: '/salaries' },
            { name: 'Pricing', href: '/pricing' },
        ]
    },
    {
        title: 'Resources',
        links: [
            { name: 'Blog', href: '/blog' },
            { name: 'Guide', href: '/guide' },
            { name: 'Help Center', href: '/help' },
            { name: 'API Docs', href: '/api' },
        ]
    },
    {
        title: 'Company',
        links: [
            { name: 'About Us', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Contact', href: '/contact' },
            { name: 'Partners', href: '/partners' },
        ]
    },
];

export default function Footer() {
    return (
        <footer style={{ position: 'relative', overflow: 'hidden', background: '#09090b', color: 'white', borderTop: '1px solid #27272a' }}>
            {/* Background Glow */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '500px', background: 'radial-gradient(circle at 50% 100%, rgba(37,99,235,0.1), transparent 70%)', pointerEvents: 'none' }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, padding: '6rem 0 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>

                    {/* Brand Column */}
                    <div style={{ maxWidth: '300px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <span style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, white, #a1a1aa)', borderRadius: '6px' }} />
                            JobPortal
                        </motion.div>
                        <p style={{ color: '#a1a1aa', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Connecting exceptional talent with world-class organizations. The future of hiring is here.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ y: -5, color: '#2563eb' }}
                                    style={{ color: '#d4d4d8', transition: 'colors 0.2s', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}
                                >
                                    <social.icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((column, i) => (
                        <div key={column.title}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'white' }}>{column.title}</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} style={{ textDecoration: 'none' }}>
                                            <motion.span
                                                style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'inline-block' }}
                                                whileHover={{ x: 5, color: 'white' }}
                                            >
                                                {link.name}
                                            </motion.span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter Column */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'white' }}>Stay Updated</h4>
                        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Join 50,000+ others and get the latest job trends and tips.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid #3f3f46',
                                    borderRadius: '8px',
                                    padding: '0.75rem',
                                    color: 'white',
                                    flex: 1,
                                    outline: 'none'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: '#3b82f6' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Send size={18} />
                            </motion.button>
                        </div>
                    </div>

                </div>

                <div style={{ borderTop: '1px solid #27272a', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: '#71717a', fontSize: '0.875rem' }}>© {new Date().getFullYear()} JobPortal Inc. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link href="/privacy" style={{ color: '#71717a', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link>
                        <Link href="/terms" style={{ color: '#71717a', fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
