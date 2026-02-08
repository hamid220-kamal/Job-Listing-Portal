"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import Button from '@/components/Button';
import JobFilter from '@/components/JobFilter';
import JobCard from '@/components/JobCard';
import { MOCK_JOBS } from '@/lib/mock_data';
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Zap } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// --- Components ---

function CountUp({ to }: { to: number }) {
  const [count, setCount] = useState(0);

  // Simple count up effect on mount/view
  // In a real app, use useInView to trigger
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = to / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [to]);

  return <>{count.toLocaleString()}</>;
}

function InfiniteMarquee({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflow: 'hidden', display: 'flex', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        style={{ display: 'flex', gap: '4rem', whiteSpace: 'nowrap', paddingRight: '4rem' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]); // Inverted for tilt
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  return (
    <motion.div
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', paddingBottom: '8rem', overflowX: 'hidden', background: 'var(--background)' }}>

      {/* --- HERO SECTION --- */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', overflow: 'hidden' }}>
        {/* Animated Aurora Background */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4,
            background: 'radial-gradient(circle at center, rgba(59,130,246,0.15), rgba(168,85,247,0.15), transparent 60%)',
            backgroundSize: '200% 200%'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, perspective: '1000px' }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity, margin: '0 auto', textAlign: 'center', maxWidth: '1000px' }}>

            {/* Floating Badge */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '99px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem' }}
            >
              <Zap size={16} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#18181b' }}>Voted #1 Job Platform of 2026</span>
            </motion.div>

            {/* Headline with Staggered Words */}
            <motion.h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '2rem', color: '#09090b' }}>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Career</motion.span>{' '}
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ color: '#71717a' }}>growth,</motion.span> <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                style={{
                  background: 'linear-gradient(to right, #2563eb, #9333ea)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Reimagined.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              style={{ fontSize: '1.25rem', color: '#52525b', marginBottom: '3rem', maxWidth: '600px', marginInline: 'auto', lineHeight: 1.6 }}
            >
              Experience the future of hiring. AI-matched opportunities, salary transparency, and instant connections with top tech companies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}
            >
              <Link href="/jobs">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(37, 99, 235, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '1.25rem 3rem', borderRadius: '16px', background: '#18181b', color: 'white', fontSize: '1.1rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Start Hunt <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>

            {/* 3D Filter Container */}
            <motion.div
              initial={{ opacity: 0, rotateX: 20, y: 100 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ delay: 1, type: 'spring', damping: 20 }}
              style={{ perspective: '2000px' }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(30px)',
                padding: '2rem',
                borderRadius: '32px',
                border: '1px solid rgba(255,255,255,1)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'
              }}>
                <JobFilter />
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* --- INFINITE MARQUEE --- */}
      <section style={{ padding: '4rem 0', background: '#fafafa', borderBlock: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <InfiniteMarquee>
          {['MICROSOFT', 'GOOGLE', 'AMAZON', 'NETFLIX', 'SPOTIFY', 'META', 'APPLE', 'TESLA', 'OPENAI', 'STRIPE'].map((brand, i) => (
            <span key={i} style={{ fontSize: '3rem', fontWeight: 900, color: '#e4e4e7', letterSpacing: '-0.05em' }}>{brand}</span>
          ))}
        </InfiniteMarquee>
      </section>

      {/* --- 3D CARDS SECTION --- */}
      <section className="container">
        <div style={{ marginBottom: '4rem' }}>
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', color: '#18181b' }}
          >
            Trending <span style={{ color: '#2563eb' }}>Opportunities</span>
          </motion.h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
          {MOCK_JOBS.slice(0, 6).map((job, i) => (
            <TiltCard key={job.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', height: '100%' }} // Ensure full height for card
              >
                <JobCard {...job} />
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* --- DYNAMIC STATS --- */}
      <section className="container">
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
            borderRadius: '40px',
            padding: '6rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', filter: 'blur(50px)' }} />

          <div style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem', textAlign: 'center' }}>
            {[
              { label: 'Active Jobs', value: 12540 },
              { label: 'Companies Hiring', value: 850 },
              { label: 'Matches Made', value: 45000 }
            ].map((stat, i) => (
              <div key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to bottom, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  <CountUp to={stat.value} />+
                </motion.div>
                <div style={{ color: '#a1a1aa', fontSize: '1.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

    </div>
  );
}
