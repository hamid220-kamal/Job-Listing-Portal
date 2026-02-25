import Button from './Button';
import Input from './Input';

export default function JobFilter() {
    return (
        <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What</span>
                <Input placeholder="Job title or keyword" icon={<span>🔍</span>} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Where</span>
                <Input placeholder="Location (e.g. Remote)" icon={<span>📍</span>} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</span>
                <select style={{
                    height: '2.75rem',
                    width: '100%',
                    borderRadius: 'var(--radius)',
                    border: '1px solid #e2e8f0',
                    padding: '0 0.75rem',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    fontWeight: 500
                }}>
                    <option value="">Any Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ opacity: 0, fontSize: '0.8rem' }}>Search</span>
                <Button variant="primary" style={{ height: '2.75rem', width: '100%', borderRadius: '12px' }}>
                    Find Jobs
                </Button>
            </div>
        </div>
    );
}
