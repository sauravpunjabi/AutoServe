import React from 'react';

export const Skeleton = ({ 
  width = '100%', 
  height = '14px', 
  borderRadius = '4px',
  style = {}
}: { 
  width?: string | number, height?: string | number, 
  borderRadius?: string, style?: React.CSSProperties 
}) => (
  <div style={{
    width, height, borderRadius,
    background: 'linear-gradient(90deg, #0f0f0f 25%, #161616 50%, #0f0f0f 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    ...style
  }} />
);

export const SkeletonStatCard = () => (
  <div style={{ 
    background: '#0f0f0f', 
    border: '1px solid #1f1f1f', 
    borderRadius: '10px', 
    padding: '20px' 
  }}>
    <Skeleton height="10px" width="55%" />
    <Skeleton height="36px" width="30%" style={{ marginTop: '12px' }} />
  </div>
);

export const SkeletonRow = () => (
  <div style={{ 
    display: 'flex', alignItems: 'center',
    gap: '32px', padding: '13px 16px', 
    borderBottom: '1px solid #111' 
  }}>
    <Skeleton height="11px" width="70px" />
    <Skeleton height="11px" width="160px" />
    <Skeleton height="11px" width="90px" />
    <Skeleton height="18px" width="54px" borderRadius="4px" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div style={{ 
    background: '#0f0f0f', 
    border: '1px solid #1f1f1f', 
    borderRadius: '10px', 
    overflow: 'hidden' 
  }}>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        height="11px" 
        width={i === lines - 1 ? '60%' : '100%'} 
      />
    ))}
  </div>
);
