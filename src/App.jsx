import { useState, useCallback } from 'react'
import CodeEditor from './components/CodeEditor.jsx'
import AnalysisPanel from './components/AnalysisPanel.jsx'
import SkeletonPanel from './components/SkeletonPanel.jsx'

const LANGUAGES = [
  { value: 'python', label: 'py' },
  { value: 'javascript', label: 'js' },
  { value: 'typescript', label: 'ts' },
]

function SecretGate({ onUnlock }) {
  const [value, setValue] = useState('')
  return (
    <div style={{ height: '100%', background: 'var(--bg)' }} className="flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <div className="mono" style={{ fontSize: '15px', letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--amber)' }}>lc</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text)' }}>companion</span>
        </div>
        <span className="label" style={{ letterSpacing: '0.18em' }}>private</span>
      </div>

      <div className="flex flex-col gap-2.5" style={{ width: '260px' }}>
        <input
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && value && onUnlock(value)}
          placeholder="secret"
          autoFocus
          className="field mono"
          style={{ letterSpacing: '0.05em' }}
        />
        <button
          disabled={!value}
          onClick={() => onUnlock(value)}
          className="btn-analyze"
        >
          unlock →
        </button>
      </div>
    </div>
  )
}

function AnalyzeButton({ status, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-analyze">
      {status === 'loading' ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          analyzing
          <span className="ldot" style={{ marginLeft: '4px' }}>.</span>
          <span className="ldot">.</span>
          <span className="ldot">.</span>
        </span>
      ) : (
        '→ analyze'
      )}
    </button>
  )
}

export default function App() {
  const [secret, setSecret] = useState(() => localStorage.getItem('lc-secret') || '')
  const [problem, setProblem] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [status, setStatus] = useState('idle')
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const handleUnlock = useCallback((val) => {
    localStorage.setItem('lc-secret', val)
    setSecret(val)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) return
    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-secret': secret,
        },
        body: JSON.stringify({ problem, code, language }),
      })

      if (res.status === 401) throw new Error('Invalid secret — clear localStorage and re-enter.')
      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const data = await res.json()
      setAnalysis(data)
      setStatus('success')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }, [code, language, problem, secret])

  if (!secret) return <SecretGate onUnlock={handleUnlock} />

  const canAnalyze = code.trim().length > 0 && status !== 'loading'

  return (
    <div className="flex flex-col" style={{ height: '100%', background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <header
        className="flex items-center flex-shrink-0"
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 18px',
          height: '40px',
          gap: '12px',
        }}
      >
        <span className="mono" style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>
          <span style={{ color: 'var(--amber)' }}>lc</span>
          <span style={{ color: 'var(--text-dim)' }}>/</span>
          <span style={{ color: 'var(--text)' }}>companion</span>
        </span>

        <div style={{ flex: 1 }} />

        <div className="flex items-center gap-2">
          <span className="status-dot" data-status={status} />
          {status !== 'idle' && (
            <span className="label" style={{ letterSpacing: '0.10em', opacity: 0.8 }}>
              {status === 'loading' ? 'analyzing' : status}
            </span>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">

        {/* Left panel */}
        <div
          className="flex flex-col flex-shrink-0"
          style={{
            width: '440px',
            borderRight: '1px solid var(--border)',
            padding: '14px',
            gap: '12px',
          }}
        >
          {/* Language tabs */}
          <div className="flex items-center gap-1">
            {LANGUAGES.map(l => (
              <button
                key={l.value}
                onClick={() => setLanguage(l.value)}
                className={`lang-tab${language === l.value ? ' active' : ''}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Problem */}
          <div className="flex flex-col gap-2">
            <span className="label">problem</span>
            <textarea
              value={problem}
              onChange={e => setProblem(e.target.value)}
              placeholder="paste description or URL (optional)"
              rows={3}
              className="field"
            />
          </div>

          {/* Solution editor */}
          <div className="flex flex-col flex-1 min-h-0 gap-2">
            <span className="label">solution</span>
            <div
              className="flex-1 min-h-0 overflow-hidden"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '5px',
              }}
            >
              <CodeEditor language={language} value={code} onChange={setCode} />
            </div>
          </div>

          {/* Analyze */}
          <AnalyzeButton status={status} onClick={handleAnalyze} disabled={!canAnalyze} />
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '14px' }}>
          {status === 'idle' && (
            <div
              className="flex items-center justify-center"
              style={{ height: '100%' }}
            >
              <span
                className="mono"
                style={{ fontSize: '12px', color: 'var(--text-dim)' }}
              >
                <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>❯ </span>
                paste a solution
                <span className="cursor" />
              </span>
            </div>
          )}

          {status === 'loading' && <SkeletonPanel />}

          {status === 'error' && (
            <div
              className="mono"
              style={{
                background: 'var(--red-dim)',
                border: '1px solid var(--red-border)',
                borderRadius: '5px',
                padding: '12px 14px',
                color: 'var(--red)',
                fontSize: '12px',
              }}
            >
              ✕ {error}
            </div>
          )}

          {status === 'success' && analysis && (
            <div className="fade-up">
              <AnalysisPanel analysis={analysis} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
