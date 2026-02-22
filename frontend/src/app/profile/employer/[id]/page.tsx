import { Metadata } from 'next';
import EmployerProfileClient from './EmployerProfileClient';

async function getProfile(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/profile/${id}`, {
        next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const profile = await getProfile(params.id);
    if (!profile) return { title: 'Company Not Found | JobPortal' };

    const companyName = profile.company || profile.name;
    return {
        title: `${companyName} | ${profile.industry || 'Company'} | JobPortal`,
        description: profile.companyDescription?.slice(0, 160) || `Learn more about ${companyName}, their industry, and open job positions on JobPortal.`,
        openGraph: {
            title: companyName,
            description: profile.companyDescription?.slice(0, 160),
            images: [profile.logo || '/default-company.png'],
        }
    };
}

export default async function PublicEmployerPage({ params }: { params: { id: string } }) {
    const profile = await getProfile(params.id);

    return <EmployerProfileClient profile={profile} id={params.id} />;
}

