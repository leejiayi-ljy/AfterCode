import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import SolutionSummary from './sections/SolutionSummary.jsx'
import CorrectnessSection from './sections/CorrectnessSection.jsx'
import ComplexitySection from './sections/ComplexitySection.jsx'
import CodeReviewSection from './sections/CodeReviewSection.jsx'
import AlternativesSection from './sections/AlternativesSection.jsx'
import PatternSection from './sections/PatternSection.jsx'
import FollowUpSection from './sections/FollowUpSection.jsx'
import { copyToClipboard, formatFullAnalysis } from '../lib/utils.js'

export default function AnalysisPanel({ analysis, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopyAll = async () => {
    await copyToClipboard(formatFullAnalysis(analysis))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Copy-all row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '2px' }}>
        <button
          onClick={handleCopyAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '4px 9px',
            cursor: 'pointer',
            color: copied ? 'var(--green)' : 'var(--text-muted)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.04em',
            transition: 'color 0.15s, border-color 0.15s',
          }}
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? 'copied' : 'copy as md'}
        </button>
      </div>

      <SolutionSummary analysis={analysis} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <CorrectnessSection analysis={analysis} />
        <ComplexitySection analysis={analysis} />
      </div>
      <CodeReviewSection analysis={analysis} />
      <AlternativesSection analysis={analysis} language={language} />
      <PatternSection analysis={analysis} />
      <FollowUpSection analysis={analysis} />
    </div>
  )
}
