function SkeletonCard({ rows = [60, 85, 70], header = true }) {
  return (
    <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {header && <div className="skeleton" style={{ height: '8px', width: '64px' }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {rows.map((w, i) => (
          <div key={i} className="skeleton" style={{ height: '11px', width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

export default function SkeletonPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SkeletonCard rows={[90, 72]} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <SkeletonCard rows={[55, 78, 62]} />
        <SkeletonCard rows={[40, 40, 68, 55]} />
      </div>
      <SkeletonCard rows={[80, 65, 88, 60]} />
      <SkeletonCard rows={[75, 55, 82]} />
      <SkeletonCard rows={[60, 78]} />
      <SkeletonCard rows={[88]} />
    </div>
  )
}
