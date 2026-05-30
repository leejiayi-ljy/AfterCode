import SectionCard from './SectionCard.jsx'
import { copyToClipboard, formatSectionAsText } from '../../lib/utils.js'

export default function AlternativesSection({ analysis }) {
  return (
    <SectionCard
      title='Alternatives'
      onCopy={() => copyToClipboard(formatSectionAsText('alternatives', analysis))}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {analysis.alternatives.map((alt, i) => (
          <div
            key={i}
            style={{
              paddingBottom: i < analysis.alternatives.length - 1 ? '16px' : 0,
              borderBottom:
                i < analysis.alternatives.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {/* Approach name + complexity */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span
                  className='mono'
                  style={{
                    fontSize: '9px',
                    color: 'var(--text-dim)',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                  {alt.approach}
                </span>
              </div>
              <span
                className='mono'
                style={{ fontSize: '10.5px', color: 'var(--amber)', flexShrink: 0 }}
              >
                {alt.complexity}
              </span>
            </div>

            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                lineHeight: '1.6',
                paddingLeft: '22px',
              }}
            >
              {alt.reasoning}
            </p>
            <p
              style={{
                fontSize: '11.5px',
                color: 'var(--text)',
                opacity: 0.55,
                lineHeight: '1.55',
                paddingLeft: '22px',
                fontStyle: 'italic',
              }}
            >
              {alt.tradeoff}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
