"use client";

import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
    fullWidth?: boolean;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    style,
    fullWidth,
    ...props
}: ButtonProps) {

    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: size === 'xl' ? '24px' : '16px',
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid transparent',
        fontFamily: 'inherit',
        outline: 'none',
        width: fullWidth ? '100%' : 'auto',
        letterSpacing: '-0.01em',
    };

    const variantStyles = {
        primary: {
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
            border: 'none',
        },
        accent: {
            background: '#0f172a',
            color: '#ffffff',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
            border: 'none',
        },
        secondary: {
            backgroundColor: '#f1f5f9',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: '#64748b',
        },
        outline: {
            backgroundColor: 'transparent',
            color: '#0f172a',
            border: '2px solid #e2e8f0',
        }
    };

    const sizeStyles = {
        sm: { padding: '0.5rem 1rem', fontSize: '0.85rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '0.95rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.05rem' },
        xl: { padding: '1.25rem 3rem', fontSize: '1.15rem' },
    };

    return (
        <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`premium-btn btn-${variant} ${className}`}
            style={{
                ...baseStyles,
                ...variantStyles[variant],
                ...sizeStyles[size],
                ...style,
            }}
            {...props}
        >
            {children}
        </motion.button>
    );
}
