import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function SectionCard({ title, onCopy, children, accentColor, style }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!onCopy) return
    await onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className="card section-card"
      style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', ...style }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          {accentColor && (
            <div style={{ width: '2px', height: '10px', borderRadius: '2px', background: accentColor, flexShrink: 0 }} />
          )}
          <span className="label">{title}</span>
        </div>
        {onCopy && (
          <button
            onClick={handleCopy}
            className="copy-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '3px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '3px',
            }}
            title="Copy"
          >
            {copied
              ? <Check size={11} style={{ color: 'var(--green)' }} />
              : <Copy size={11} />
            }
          </button>
        )}
      </div>

      {children}
    </div>
  )
}
