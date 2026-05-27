export default function LoadingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', padding: '8px 0', animation: 'fadeInUp 0.4s ease' }}>
      
      {/* Title skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px' }}>
        <div className="skeleton" style={{ width: '40%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '80%', height: '10px', borderRadius: '3px' }} />
      </div>

      {/* Cards skeleton grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div className="skeleton" style={{ width: '30%', height: '10px', borderRadius: '3px' }} />
            <div className="skeleton" style={{ width: '60%', height: '20px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '45%', height: '10px', borderRadius: '3px' }} />
          </div>
        ))}
      </div>

      {/* List skeleton */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div className="skeleton" style={{ width: '20%', height: '12px', borderRadius: '3px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '50%' }}>
                <div className="skeleton" style={{ width: '70%', height: '12px', borderRadius: '3px' }} />
                <div className="skeleton" style={{ width: '40%', height: '8px', borderRadius: '2px' }} />
              </div>
              <div className="skeleton" style={{ width: '80px', height: '18px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
