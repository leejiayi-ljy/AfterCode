import SectionCard from './SectionCard.jsx'
import { copyToClipboard } from '../../lib/utils.js'

export default function SolutionSummary({ analysis }) {
  return (
    <SectionCard title='Summary' onCopy={() => copyToClipboard(analysis.solution_summary)}>
      <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: '1.65' }}>
        {analysis.solution_summary}
      </p>
      {analysis.input_caveats && (
        <div
          style={{
            background: 'var(--orange-dim)',
            border: '1px solid var(--orange-border)',
            borderRadius: '4px',
            padding: '8px 10px',
            color: 'var(--orange)',
            fontSize: '11.5px',
            lineHeight: '1.55',
          }}
        >
          ⚠ {analysis.input_caveats}
        </div>
      )}
    </SectionCard>
  )
}
