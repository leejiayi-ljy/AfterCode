import SectionCard from './SectionCard.jsx'
import { copyToClipboard } from '../../lib/utils.js'

export default function FollowUpSection({ analysis }) {
  return (
    <SectionCard
      title="Interviewer follow-up"
      onCopy={() => copyToClipboard(analysis.interviewer_followup)}
    >
      <div
        style={{
          paddingLeft: '14px',
          borderLeft: '2px solid var(--amber)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text)',
            lineHeight: '1.7',
            fontStyle: 'italic',
          }}
        >
          &ldquo;{analysis.interviewer_followup}&rdquo;
        </p>
      </div>
    </SectionCard>
  )
}
