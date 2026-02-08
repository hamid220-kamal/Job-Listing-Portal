"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import JobFilter from '@/components/JobFilter';
import JobCard from '@/components/JobCard';
import { MOCK_JOBS } from '@/lib/mock_data';
import MotionWrapper, { slideUp, staggerContainer, fadeIn } from '@/components/MotionWrapper';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '8rem 0 6rem',
        overflow: 'hidden'
      }}>
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'var(--gradient-glow)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <MotionWrapper style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
            <motion.div variants={slideUp} initial="initial" animate="animate">
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}>
                ✨ The #1 Platform for Top Talent
              </span>
              <h1 style={{
                fontSize: '4rem',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                marginBottom: '1.5rem',
                lineHeight: 1.1,
                background: 'linear-gradient(to right, var(--secondary-foreground), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Find your next <span style={{ color: 'var(--primary)' }}>dream job</span> <br /> without the hassle.
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '700px', marginInline: 'auto' }}>
                Connect with 500+ top companies and startups. No spam, just quality listings.
                Human-verified and authentic opportunities.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
                <Link href="/jobs">
                  <Button size="lg" style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-glow)', border: 'none' }}>
                    Browse Jobs <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="secondary" size="lg" style={{ background: 'white', border: '1px solid var(--border)' }}>Post a Job</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <JobFilter />
            </motion.div>
          </MotionWrapper>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' }}
          >
            Featured Opportunities
          </motion.h2>
          <Link href="/jobs">
            <Button variant="ghost">View all jobs →</Button>
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}
        >
          {MOCK_JOBS.slice(0, 6).map((job) => (
            <motion.div key={job.id} variants={fadeIn}>
              <JobCard {...job} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats / Trust Section */}
      <section style={{ marginTop: '2rem' }}>
        <div className="container" style={{
          background: 'var(--primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '4rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url("https://www.transparenttextures.com/patterns/cubes.png")', opacity: 0.1, mixBlendMode: 'overlay' }}></div>

          <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
            {[
              { label: 'Active Jobs', value: '10k+' },
              { label: 'Companies', value: '500+' },
              { label: 'Candidates', value: '100k+' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{stat.value}</div>
                <div style={{ fontSize: '1.25rem', opacity: 0.9 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
