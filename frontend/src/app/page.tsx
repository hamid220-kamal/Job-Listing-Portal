"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '@/components/Button';
import JobFilter from '@/components/JobFilter';
import JobCard from '@/components/JobCard';
import FAQAccordion from '@/components/FAQAccordion';
import { ArrowRight, TrendingUp, Shield, Zap, Globe, Award, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import CountUp from '@/components/CountUp';
import InfiniteMarquee from '@/components/InfiniteMarquee';

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [trendingJobs, setTrendingJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/search?limit=6');
        setTrendingJobs(data.jobs || []);
      } catch (err) {
        console.error('Failed to fetch trending jobs:', err);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'hidden', background: '#fff' }}>

      {/* --- HERO SECTION --- */}
      <section style={{ 
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', 
        paddingTop: '80px', overflow: 'hidden', background: 'white' 
      }}>
        {/* Advanced Grid Background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(to right, #f1f5f9 2px, transparent 2px), linear-gradient(to bottom, #f1f5f9 2px, transparent 2px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
          opacity: 0.4
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '4rem', alignItems: 'center', textAlign: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: heroY, opacity: heroOpacity }}
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem', 
                  padding: '0.6rem 1.5rem', borderRadius: '99px', marginBottom: '3rem',
                  background: '#f1f5f9', border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <motion.span 
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '10px', height: '10px', background: '#2563eb', borderRadius: '50%' }} 
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em' }}>
                  THE FUTURE OF PROFESSIONAL CORRELATION
                </span>
              </motion.div>

              <motion.h1 style={{ 
                fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', fontWeight: 950, 
                lineHeight: 0.9, letterSpacing: '-0.06em', marginBottom: '2.5rem', color: '#0f172a' 
              }}>
                Orchestrate your <br /> 
                <span style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  position: 'relative'
                }}>
                  professional era.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ 
                  fontSize: '1.45rem', color: '#475569', marginBottom: '4rem', 
                  maxWidth: '800px', marginInline: 'auto', lineHeight: 1.5, fontWeight: 500
                }}
              >
                Join an elite ecosystem where world-class talent converges with visionary organizations. 
                Our AI-driven matching engine defines the new standard for executive placement.
              </motion.p>

              {/* Enhanced Hero Filter Integration */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ maxWidth: '1100px', margin: '0 auto 8rem' }}
              >
                <JobFilter />
              </motion.div>

              {/* Tech Stack / Trusted By Floating Logos */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.5 }}
              >
                {['MICROSOFT', 'GOOGLE', 'META', 'STRIPE', 'AIRBNB'].map(b => (
                   <span key={b} style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.2em' }}>{b}</span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ELITE SPECIALIZATIONS (BENTO) --- */}
      <section style={{ padding: '12rem 0', background: 'white' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '8rem' }}
          >
            <h2 style={{ fontSize: '4.5rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.05em', lineHeight: 1 }}>
              Elite <span style={{ color: '#2563eb' }}>Specializations.</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.4rem', marginTop: '2rem', fontWeight: 500, maxWidth: '600px', marginInline: 'auto' }}>
              Precision-categorized pathways for high-impact professionals.
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', 
            gridAutoRows: '400px', gap: '2rem' 
          }}>
            {[
              { name: 'Engineering', icon: Zap, count: '2.4k', grid: 'span 2 / span 1', bg: '#0f172a', color: 'white' },
              { name: 'Architecture', icon: Award, count: '450', grid: 'span 1 / span 1', bg: '#eff6ff', color: '#2563eb' },
              { name: 'Product', icon: Globe, count: '890', grid: 'span 1 / span 1', bg: '#f5f3ff', color: '#7c3aed' },
              { name: 'Design', icon: Sparkles, count: '1.1k', grid: 'span 1 / span 1', bg: '#f8fafc', color: '#0f172a' },
              { name: 'Strategy', icon: TrendingUp, count: '340', grid: 'span 1 / span 1', bg: '#fff7ed', color: '#ea580c' },
              { name: 'Executive', icon: Shield, count: '120+', grid: 'span 2 / span 1', bg: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: 'white' },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{ y: -15, scale: 1.02 }}
                style={{
                  gridArea: cat.grid,
                  padding: '3.5rem', borderRadius: '48px', 
                  background: cat.bg, color: cat.color,
                  border: '1px solid #f1f5f9',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <cat.icon size={48} strokeWidth={2.5} style={{ marginBottom: '2.5rem' }} />
                  <h3 style={{ fontSize: '2.25rem', fontWeight: 950, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>{cat.name}</h3>
                  <p style={{ opacity: 0.8, fontSize: '1.2rem', fontWeight: 700 }}>{cat.count} VERIFIED ROLES</p>
                </div>
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Explore Track <ArrowRight size={24} strokeWidth={3.5} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS OVERLAY --- */}
      <section style={{ padding: '15rem 0', background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, filter: 'grayscale(100%)' }}>
           <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8rem', textAlign: 'center' }}>
            {[
              { label: 'GLOBAL PARTNERS', value: 2400 },
              { label: 'SUCCESSFUL PLACEMENTS', value: 15800 },
              { label: 'ACTIVE DISCOVERY', value: 950, symbol: 'k' },
              { label: 'AVERAGE SALARY BUMP', value: 45, symbol: '%' }
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.2 }}>
                <div style={{ fontSize: '6rem', fontWeight: 950, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>
                  <CountUp to={stat.value} />{stat.symbol || '+'}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2563eb', letterSpacing: '0.2em', marginTop: '1.5rem' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section style={{ padding: '12rem 0', background: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: '5.5rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.06em', lineHeight: 0.9, marginBottom: '3rem' }}>
              Your sovereign <br /> career <span style={{ color: '#2563eb' }}>awaits.</span>
            </h2>
            <p style={{ fontSize: '1.6rem', color: '#475569', marginBottom: '5rem', fontWeight: 500, lineHeight: 1.5 }}>
              Join the pinnacle of professional networking. <br />
              Secure your place among the world's most innovative builders.
            </p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="xl" style={{ boxShadow: '0 30px 60px rgba(37, 99, 235, 0.3)' }}>Initialize Profile</Button>
              </Link>
              <Link href="/jobs" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="xl">Browse Opportunities</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
