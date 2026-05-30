import SectionCard from './SectionCard.jsx'
import { copyToClipboard, formatSectionAsText } from '../../lib/utils.js'

const VERDICT = {
  correct: {
    label: 'correct',
    color: 'var(--green)',
    dim: 'var(--green-dim)',
    border: 'var(--green-border)',
  },
  likely_correct: {
    label: 'likely correct',
    color: 'var(--blue)',
    dim: 'var(--blue-dim)',
    border: 'var(--blue-border)',
  },
  has_issues: {
    label: 'has issues',
    color: 'var(--orange)',
    dim: 'var(--orange-dim)',
    border: 'var(--orange-border)',
  },
  incorrect: {
    label: 'incorrect',
    color: 'var(--red)',
    dim: 'var(--red-dim)',
    border: 'var(--red-border)',
  },
  cannot_determine: {
    label: 'unclear',
    color: 'var(--text-muted)',
    dim: 'transparent',
    border: 'var(--border)',
  },
}

export default function CorrectnessSection({ analysis }) {
  const { correctness } = analysis
  const v = VERDICT[correctness.assessment] ?? VERDICT.cannot_determine

  return (
    <SectionCard
      title='Correctness'
      accentColor={v.color}
      onCopy={() => copyToClipboard(formatSectionAsText('correctness', analysis))}
    >
      {/* Verdict chip */}
      <div
        className='mono'
        style={{
          display: 'inline-block',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          padding: '3px 8px',
          borderRadius: '3px',
          background: v.dim,
          border: `1px solid ${v.border}`,
          color: v.color,
        }}
      >
        {v.label}
      </div>

      <p style={{ fontSize: '12.5px', color: 'var(--text)', lineHeight: '1.65' }}>
        {correctness.reasoning}
      </p>

      {correctness.edge_cases.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {correctness.edge_cases.map((ec, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '8px',
                fontSize: '11.5px',
                color: 'var(--text-muted)',
              }}
            >
              <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>·</span>
              {ec}
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
