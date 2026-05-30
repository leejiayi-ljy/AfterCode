import SectionCard from './SectionCard.jsx'
import { copyToClipboard, formatSectionAsText } from '../../lib/utils.js'

export default function ComplexitySection({ analysis }) {
  const { complexity } = analysis
  return (
    <SectionCard
      title="Complexity"
      accentColor="var(--amber)"
      onCopy={() => copyToClipboard(formatSectionAsText('complexity', analysis))}
    >
      {/* Big-O readout */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {[{ label: 'time', value: complexity.time }, { label: 'space', value: complexity.space }].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="label" style={{ fontSize: '8px' }}>{label}</span>
            <span
              className="mono"
              style={{ fontSize: '18px', fontWeight: 500, color: 'var(--amber)', lineHeight: 1 }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.65' }}>
        {complexity.reasoning}
      </p>
    </SectionCard>
  )
}
