import SectionCard from './SectionCard.jsx'
import { copyToClipboard, formatSectionAsText } from '../../lib/utils.js'

export default function PatternSection({ analysis }) {
  const { pattern } = analysis
  return (
    <SectionCard
      title="Pattern"
      accentColor="var(--blue)"
      onCopy={() => copyToClipboard(formatSectionAsText('pattern', analysis))}
    >
      {/* Category chip */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span
          className="mono"
          style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            padding: '3px 8px',
            borderRadius: '3px',
            background: 'var(--blue-dim)',
            border: '1px solid var(--blue-border)',
            color: 'var(--blue)',
          }}
        >
          {pattern.category}
        </span>
      </div>

      <p style={{ fontSize: '12.5px', color: 'var(--text)', lineHeight: '1.65' }}>
        {pattern.explanation}
      </p>

      {/* Similar problems */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span className="label" style={{ fontSize: '8px', marginBottom: '2px' }}>drill these next</span>
        {pattern.similar_problems.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
            <span className="mono" style={{ color: 'var(--text-dim)', flexShrink: 0, fontSize: '10px', marginTop: '2px' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>
              <span style={{ color: 'var(--text)' }}>{p.problem_type}</span>
              {p.named_example && (
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '6px' }}>
                  eg. &ldquo;{p.named_example}&rdquo;
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
