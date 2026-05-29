import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '14px',
  borderRadius = '2px',
  style = {},
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}) => (
  <div className="sk" style={{ width, height, borderRadius, ...style }} />
);

export const SkeletonStatCard = () => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '20px',
  }}>
    <Skeleton height="10px" width="55%" />
    <Skeleton height="32px" width="35%" style={{ marginTop: '12px' }} />
  </div>
);

export const SkeletonRow = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border)',
  }}>
    <Skeleton height="10px" width="70px" />
    <Skeleton height="10px" width="160px" />
    <Skeleton height="10px" width="90px" />
    <Skeleton height="16px" width="54px" borderRadius="2px" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    overflow: 'hidden',
  }}>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height="11px" width={i === lines - 1 ? '60%' : '100%'} />
    ))}
  </div>
);
