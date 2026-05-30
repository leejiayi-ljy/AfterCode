import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import SectionCard from './SectionCard.jsx'
import CodeEditor from '../CodeEditor.jsx'
import { copyToClipboard, formatSectionAsText } from '../../lib/utils.js'

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    await copyToClipboard(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
      <CodeEditor language={language} value={code} readOnly />
      <button
        onClick={handle}
        style={{
          position: 'absolute',
          top: '7px',
          right: '7px',
          background: 'var(--surface-hhi)',
          border: '1px solid var(--border)',
          borderRadius: '3px',
          padding: '3px 5px',
          cursor: 'pointer',
          color: copied ? 'var(--green)' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.15s',
        }}
      >
        {copied ? <Check size={10} /> : <Copy size={10} />}
      </button>
    </div>
  )
}

export default function AlternativesSection({ analysis, language }) {
  return (
    <SectionCard
      title='Alternatives'
      onCopy={() => copyToClipboard(formatSectionAsText('alternatives', analysis))}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {analysis.alternatives.map((alt, i) => (
          <div
            key={i}
            style={{
              paddingBottom: i < analysis.alternatives.length - 1 ? '20px' : 0,
              borderBottom:
                i < analysis.alternatives.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Approach name + complexity */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span className='mono' style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: 500, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                  {alt.approach}
                </span>
              </div>
              <span className='mono' style={{ fontSize: '10.5px', color: 'var(--amber)', flexShrink: 0 }}>
                {alt.complexity}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '22px' }}>
              {alt.reasoning}
            </p>

            <p style={{ fontSize: '11.5px', color: 'var(--text)', opacity: 0.55, lineHeight: '1.55', paddingLeft: '22px', fontStyle: 'italic' }}>
              {alt.tradeoff}
            </p>

            {alt.code_example && (
              <div style={{ paddingLeft: '22px' }}>
                <CodeBlock code={alt.code_example} language={language} />
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
