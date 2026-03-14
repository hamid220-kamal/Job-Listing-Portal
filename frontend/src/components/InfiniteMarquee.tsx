"use client";

import { motion } from 'framer-motion';

export default function InfiniteMarquee({ children }: { children: React.ReactNode }) {
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
