import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AppLayout from '../../components/AppLayout';
import { customerNav } from '../../lib/nav';
import {
  Card,
  SectionLabel,
  TextInput,
  TextLink,
} from '../../components/ui/primitives';
import LoadingPage from '../../components/ui/LoadingPage';
import EmptyState from '../../components/ui/EmptyState';
import { Search, MapPin, Phone } from 'lucide-react';

export default function CustomerServiceCenters() {
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await api.get('/service-centers');
        setCenters(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter(
    (c: any) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AppLayout
        title="Service centers"
        subtitle="Find an AutoServe location near you."
        navLinks={customerNav}
      >
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Service centers"
      subtitle="Find an AutoServe location near you."
      navLinks={customerNav}
    >
      <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
        <SectionLabel>Search</SectionLabel>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <TextInput
            type="text"
            placeholder="Search by name or location…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {filteredCenters.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No centers found"
          description="We couldn't find any locations matching your search."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredCenters.map((c) => (
            <Card key={c.id} style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-hover)',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '28px',
                }}
              >
                🏢
              </div>
              <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {c.name}
                </p>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{c.location}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Phone size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <span>(555) 123-4567</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <TextLink to="/customer/book-service">Book here →</TextLink>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
