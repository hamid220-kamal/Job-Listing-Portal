"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.getAttribute('role') === 'button'
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            <style jsx global>{`
        body, a, button {
          cursor: none; /* Hide default cursor */
        }
        @media (max-width: 768px) {
           body, a, button {
             cursor: auto; /* Restore on mobile */
           }
           .custom-cursor {
             display: none !important;
           }
        }
      `}</style>
            <motion.div
                className="custom-cursor"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--foreground)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    mixBlendMode: 'difference',
                    backgroundColor: isHovering ? 'var(--foreground)' : 'transparent',
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <motion.div
                className="custom-cursor"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    position: 'fixed',
                    left: 14, // Center dot
                    top: 14,
                    width: '4px',
                    height: '4px',
                    backgroundColor: 'var(--foreground)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    mixBlendMode: 'difference'
                }}
            />
        </>
    );
}
