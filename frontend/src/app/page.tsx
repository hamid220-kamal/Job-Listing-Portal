"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import Button from '@/components/Button';
import JobFilter from '@/components/JobFilter';
import JobCard from '@/components/JobCard';
import FAQAccordion from '@/components/FAQAccordion';
import { MOCK_JOBS } from '@/lib/mock_data';
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Zap, Globe, Award, Briefcase } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// --- Components ---

function CountUp({ to }: { to: number }) {
  const [count, setCount] = useState(0);

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
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        style={{ display: 'flex', gap: '4rem', whiteSpace: 'nowrap', paddingRight: '4rem', alignItems: 'center' }}
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
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
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
      onMouseLeave={() => { x.set(0); y.set(0); }}
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
    <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'hidden', background: 'var(--background)' }}>

      {/* --- HERO SECTION --- */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', overflow: 'hidden', background: 'white' }}>

        {/* Tech Mesh Background - Subtler for light theme */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `radial-gradient(#e2e8f0 1.5px, transparent 1.5px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 90%)',
          opacity: 0.4
        }} />

        {/* Gradient Orbs - Optimized for Light Theme */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ position: 'absolute', top: '-10%', right: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)', filter: 'blur(80px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          style={{ position: 'absolute', bottom: '0%', left: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)', filter: 'blur(100px)' }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity, margin: '0 auto', textAlign: 'center', maxWidth: '1100px' }}>

            {/* Chip */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '99px', background: '#f1f5f9', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '2rem' }}
            >
              <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Over 12,000+ New Jobs Added Today</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1.5rem', color: '#0f172a' }}>
              Find a job that <br className="mobile-hide" />
              <span style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>matches your passion.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '3rem', maxWidth: '650px', marginInline: 'auto', lineHeight: 1.6 }}
            >
              The most advanced AI-powered platform designed to connect top-tier talent with world-class organizations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem', flexWrap: 'wrap' }}
            >
              <Link href="/jobs">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '1.25rem 3rem', borderRadius: '16px', background: '#2563eb', color: 'white',
                    fontSize: '1.1rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  Browse Jobs
                </motion.button>
              </Link>
              <Link href="/companies">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '1.25rem 3rem', borderRadius: '16px', background: 'white', color: '#1e293b',
                    fontSize: '1.1rem', fontWeight: 600, border: '1px solid #e2e8f0', cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  View Companies
                </motion.button>
              </Link>
            </motion.div>

            {/* 3D Filter Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              <JobFilter />
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* --- TRUSTED BRANDS --- */}
      <section style={{ padding: '3rem 0', background: 'white', borderBottom: '1px solid #f1f5f9' }}>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Trusted by teams at world's best companies</p>
        <InfiniteMarquee>
          {['MICROSOFT', 'GOOGLE', 'AMAZON', 'NETFLIX', 'SPOTIFY', 'META', 'APPLE', 'TESLA', 'OPENAI', 'STRIPE', 'AIRBNB', 'UBER'].map((brand, i) => (
            <span key={i} style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em', margin: '0 3rem' }}>{brand}</span>
          ))}
        </InfiniteMarquee>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="container" style={{ padding: '8rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Why top professionals <br />
              <span style={{ color: '#2563eb' }}>choose our platform.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {[
                { title: 'AI-Powered Matching', desc: 'Our advanced algorithms match you with roles that truly fit your skills and career trajectory.', icon: Zap },
                { title: 'Direct Access', desc: 'Skip the noise and connect directly with hiring managers at world-class companies.', icon: Users },
                { title: 'Salary Transparency', desc: 'Make informed decisions with upfront salary expectations and market insights.', icon: TrendingUp }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ minWidth: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              borderRadius: '32px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'
            }}>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Engagement" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
            </div>
            {/* Floating Stats */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute', top: '10%', right: '-5%', background: 'white', padding: '1.5rem',
                borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9'
              }}
            >
              <div style={{ color: '#2563eb', fontWeight: 800, fontSize: '1.5rem' }}>92%</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>MATCH RATE</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{
                position: 'absolute', bottom: '10%', left: '-5%', background: 'white', padding: '1.5rem',
                borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9'
              }}
            >
              <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.5rem' }}>10k+</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>SUCCESSFUL HIRES</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="container" style={{ padding: '8rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>Explore by <br /><span style={{ color: '#2563eb' }}>Category</span></h2>
          </div>
          <Link href="/categories" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View All Categories <ArrowRight size={18} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'Engineering', icon: Briefcase, count: '1.2k jobs' },
            { name: 'Design', icon: Award, count: '850 jobs' },
            { name: 'Marketing', icon: TrendingUp, count: '600 jobs' },
            { name: 'Sales', icon: Zap, count: '920 jobs' },
            { name: 'Finance', icon: Shield, count: '340 jobs' },
            { name: 'Remote', icon: Globe, count: '4.5k jobs' },
          ].map((cat, i) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', borderColor: '#2563eb' }}
              style={{
                padding: '2rem', borderRadius: '24px', background: 'white', border: '1px solid #e2e8f0',
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#2563eb' }}>
                <cat.icon size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>{cat.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS (Light Mode) --- */}
      <section style={{ padding: '10rem 0', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.05)' }} />

        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>Standard Recruitment Process</h2>
            <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Experience a seamless journey from browsing to joining your dream team.</p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {[
              { title: 'Create Account', desc: 'Sign up in seconds and build your professional profile to showcase your skills.', icon: Users, color: '#2563eb' },
              { title: 'Upload Resume', desc: 'Our smart AI parses your resume to match you with roles that fit your expertise.', icon: Briefcase, color: '#8b5cf6' },
              { title: 'Get Hired', desc: 'Connect directly with hiring managers, ace your interview, and land the job.', icon: CheckCircle, color: '#10b981' }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                style={{ background: 'white', padding: '3.5rem 2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
              >
                <div style={{ width: '70px', height: '70px', background: `${step.color}15`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                  <step.icon size={32} color={step.color} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1e293b' }}>{step.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '1.05rem' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRENDING JOBS --- */}
      <section className="container" style={{ padding: '8rem 1.5rem' }}>
        <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a', letterSpacing: '-0.02em' }}>Trending Opportunities</h2>
          <p style={{ color: '#64748b', fontSize: '1.25rem' }}>Hand-picked jobs from global industry leaders.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
          {MOCK_JOBS.slice(0, 6).map((job, i) => (
            <TiltCard key={job.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                style={{ height: '100%' }}
              >
                <JobCard {...job} />
              </motion.div>
            </TiltCard>
          ))}
        </div>

        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <Link href="/jobs">
            <Button variant="outline" size="lg" style={{ borderRadius: '14px', padding: '1rem 3rem', fontWeight: 700 }}>View All Opportunities</Button>
          </Link>
        </div>
      </section>

      {/* --- STATS PARALLAX --- */}
      <section style={{ position: 'relative', padding: '10rem 0', overflow: 'hidden', background: '#0f172a', color: 'white' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" alt="stats-bg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0f172a, transparent, #0f172a)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', textAlign: 'center' }}>
            {[
              { label: 'Active Jobs', value: 12540 },
              { label: 'Companies', value: 850 },
              { label: 'Hires', value: 45000 },
              { label: 'Candidates', value: 120000 }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to bottom, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  <CountUp to={stat.value} />+
                </div>
                <div style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="container" style={{ padding: '10rem 1.5rem', maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Common Questions</h2>
          <p style={{ color: '#64748b', marginTop: '1.25rem', fontSize: '1.2rem' }}>Everything you need to know about the platform.</p>
        </div>
        <FAQAccordion items={[
          { q: "Is this platform really free for job seekers?", a: "Yes, completely. You can create a profile, upload your resume, and apply to as many jobs as you want without paying a dime." },
          { q: "How does the AI matching algorithm work?", a: "Our proprietary AI analyzes your skills, experience, and career goals to match you with roles where you're most likely to succeed. It learns from your interactions to get smarter over time." },
          { q: "Can companies contact me directly?", a: "Yes. If your profile is public, verified recruiters can invite you to apply for roles that match your expertise." },
          { q: "What makes this different from LinkedIn?", a: "We focus purely on hiring. No social feed, no noise. Just high-quality job listings, salary transparency, and direct connections to hiring managers." }
        ]} />
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{ padding: '8rem 0', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Ready to shape your future?</h2>
          <p style={{ fontSize: '1.4rem', opacity: 0.8, marginBottom: '3.5rem', maxWidth: '700px', margin: '0 auto 3.5rem', lineHeight: 1.6 }}>Join over 100,000 professionals who have found their dream job using our platform.</p>
          <Link href="/auth/signup">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              style={{ padding: '1.5rem 4rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.25rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Get Started Now
            </motion.button>
          </Link>
        </div>
      </section>

    </div>
  );
}
