import { useState, useCallback, useEffect } from 'react'
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
    <div
      style={{ height: '100%', background: 'var(--bg)' }}
      className='flex flex-col items-center justify-center gap-10'
    >
      <div className='flex flex-col items-center gap-3'>
        <div className='brand'>
          <span className='brand-after'>after</span>
          <span className='brand-code'>Code</span>
        </div>
        <span className='label' style={{ letterSpacing: '0.2em', opacity: 0.6 }}>
          private access
        </span>
      </div>

      <div
        className='flex flex-col gap-2.5'
        style={{
          width: '260px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <input
          type='password'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value && onUnlock(value)}
          placeholder='enter secret'
          autoFocus
          className='field mono'
          style={{ letterSpacing: '0.05em' }}
        />
        <button disabled={!value} onClick={() => onUnlock(value)} className='btn-analyze'>
          unlock →
        </button>
      </div>
    </div>
  )
}

function AnalyzeButton({ status, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className='btn-analyze'>
      {status === 'loading' ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          analyzing
          <span className='ldot' style={{ marginLeft: '4px' }}>
            .
          </span>
          <span className='ldot'>.</span>
          <span className='ldot'>.</span>
        </span>
      ) : (
        '→ analyze'
      )}
    </button>
  )
}

const IDLE_PROMPTS = [
  "brb, judging your code",
  "don't be shy, paste it",
  "your O(n!) solution is welcome here",
  "paste and pray 🙏",
]
const idlePrompt = IDLE_PROMPTS[Math.floor(Math.random() * IDLE_PROMPTS.length)]

export default function App() {
  const [secret, setSecret] = useState(() => localStorage.getItem('secret-token') || '')
  const [problem, setProblem] = useState(() => localStorage.getItem('ac-problem') || '')
  const [code, setCode] = useState(() => localStorage.getItem('ac-code') || '')
  const [language, setLanguage] = useState(() => localStorage.getItem('ac-language') || 'python')
  const [status, setStatus] = useState('idle')
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const handleUnlock = useCallback((val) => {
    localStorage.setItem('secret-token', val)
    setSecret(val)
  }, [])

  useEffect(() => {
    localStorage.setItem('ac-problem', problem)
  }, [problem])
  useEffect(() => {
    localStorage.setItem('ac-code', code)
  }, [code])
  useEffect(() => {
    localStorage.setItem('ac-language', language)
  }, [language])

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

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (code.trim() && status !== 'loading') handleAnalyze()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [code, status, handleAnalyze])

  if (!secret) return <SecretGate onUnlock={handleUnlock} />

  const canAnalyze = code.trim().length > 0 && status !== 'loading'

  return (
    <div className='flex flex-col' style={{ height: '100%', background: 'var(--bg)' }}>
      {/* ── Header ── */}
      <header
        className='flex items-center flex-shrink-0'
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 18px',
          height: '42px',
          gap: '12px',
          background: 'rgba(31, 35, 53, 0.6)',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <span className='brand'>
          <span className='brand-after'>after</span>
          <span className='brand-code'>Code</span>
        </span>

        <div style={{ flex: 1 }} />

        <div className='flex items-center gap-2'>
          <span className='status-dot' data-status={status} />
          {status !== 'idle' && (
            <span className='label' style={{ letterSpacing: '0.10em', opacity: 0.8 }}>
              {status === 'loading' ? 'analyzing' : status}
            </span>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className='flex flex-1 min-h-0'>
        {/* Left panel */}
        <div
          className='flex flex-col flex-shrink-0'
          style={{
            width: '440px',
            borderRight: '1px solid var(--border)',
            padding: '14px',
            gap: '12px',
          }}
        >
          {/* Language tabs */}
          <div className='flex items-center gap-1'>
            {LANGUAGES.map((l) => (
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
          <div className='flex flex-col gap-2'>
            <span className='label'>problem</span>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder='paste description or URL (optional)'
              rows={3}
              className='field'
            />
          </div>

          {/* Solution editor */}
          <div className='flex flex-col flex-1 min-h-0 gap-2'>
            <span className='label'>solution</span>
            <div
              className='flex-1 min-h-0 overflow-hidden'
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
        <div className='flex-1 overflow-y-auto' style={{ padding: '14px' }}>
          {status === 'idle' && (
            <div className='flex items-center justify-center' style={{ height: '100%' }}>
              <span className='mono' style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>❯ </span>
                {idlePrompt}
                <span className='cursor' />
              </span>
            </div>
          )}

          {status === 'loading' && <SkeletonPanel />}

          {status === 'error' && (
            <div
              className='mono'
              style={{
                background: 'var(--red-dim)',
                border: '1px solid var(--red-border)',
                borderRadius: '5px',
                padding: '12px 14px',
                color: 'var(--red)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <span>✕ {error}</span>
              <button
                onClick={handleAnalyze}
                style={{
                  background: 'none',
                  border: '1px solid var(--red-border)',
                  borderRadius: '4px',
                  padding: '3px 10px',
                  color: 'var(--red)',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  opacity: 0.85,
                }}
              >
                retry →
              </button>
            </div>
          )}

          {status === 'success' && analysis && (
            <div className='fade-up'>
              <AnalysisPanel analysis={analysis} language={language} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
