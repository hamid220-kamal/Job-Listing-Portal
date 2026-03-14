import { Metadata } from 'next';
import ForgotPasswordClient from './ForgotPasswordClient';

export const metadata: Metadata = {
    title: 'Recover Identity | Job Listing Portal',
    description: 'Securely recover your account access instructions.',
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordClient />;
}
