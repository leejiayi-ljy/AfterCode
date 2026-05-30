import SectionCard from './SectionCard.jsx'
import { copyToClipboard, formatSectionAsText } from '../../lib/utils.js'

export default function CodeReviewSection({ analysis }) {
  const { code_review } = analysis
  return (
    <SectionCard
      title="Code Review"
      onCopy={() => copyToClipboard(formatSectionAsText('code_review', analysis))}
    >
      {code_review.strengths.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="label" style={{ color: 'var(--green)', fontSize: '8px' }}>strengths</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {code_review.strengths.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '12.5px', color: 'var(--text)', lineHeight: '1.6' }}>
                <span style={{ color: 'var(--green)', opacity: 0.6, flexShrink: 0, marginTop: '1px', fontFamily: 'monospace' }}>+</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {code_review.improvements.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: code_review.strengths.length ? '6px' : 0 }}>
          <span className="label" style={{ color: 'var(--orange)', fontSize: '8px' }}>improvements</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {code_review.improvements.map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '12.5px', color: 'var(--text)', lineHeight: '1.55' }}>{item.issue}</p>
                <p
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--text-muted)',
                    lineHeight: '1.55',
                    paddingLeft: '10px',
                    borderLeft: '2px solid var(--border-hi)',
                  }}
                >
                  {item.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  )
}
