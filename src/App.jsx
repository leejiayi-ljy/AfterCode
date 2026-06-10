import { useState, useCallback, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import CodeEditor from './components/CodeEditor.jsx'
import AnalysisPanel from './components/AnalysisPanel.jsx'
import SkeletonPanel from './components/SkeletonPanel.jsx'
import { DEMO } from './demo.js'

const LANGUAGES = [
  { value: 'python', label: 'py' },
  { value: 'javascript', label: 'js' },
  { value: 'typescript', label: 'ts' },
]

function AnalyzeButton({ status, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className='btn-analyze'>
      {status === 'loading' ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          analyzing
          <span className='ldot' style={{ marginLeft: '4px' }}>.</span>
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
  'brb, judging your code',
  "don't be shy, paste it",
  'your O(n!) solution is welcome here',
  'paste and pray',
]
const idlePrompt = IDLE_PROMPTS[Math.floor(Math.random() * IDLE_PROMPTS.length)]

export default function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('ac-theme') !== 'light')
  const [problem, setProblem] = useState(() => localStorage.getItem('ac-problem') || '')
  const [code, setCode] = useState(() => localStorage.getItem('ac-code') || '')
  const [language, setLanguage] = useState(() => localStorage.getItem('ac-language') || 'python')
  const [status, setStatus] = useState('idle')
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [secretKey, setSecretKey] = useState('')
  const [hasSecret, setHasSecret] = useState(() => !!localStorage.getItem('x-app-secret'))
  const [secretSaved, setSecretSaved] = useState(false)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('ac-theme', isDark ? 'dark' : 'light')
  }, [isDark])

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
      const headers = { 'Content-Type': 'application/json' }
      const storedSecret = localStorage.getItem('x-app-secret')
      if (storedSecret) headers['x-app-secret'] = storedSecret

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({ problem, code, language }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('x-app-secret')
          setHasSecret(false)
          setAuthError('incorrect key')
          setStatus('idle')
          return
        }
        if (res.status === 400) throw new Error('invalid request — make sure code is not empty')
        if (res.status === 502) throw new Error('upstream api error — claude may be unavailable')
        throw new Error(`server error (${res.status})`)
      }

      const data = await res.json()
      setAnalysis(data)
      setStatus('success')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }, [code, language, problem])

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

  const handleSaveSecret = useCallback(() => {
    if (!secretKey.trim()) return
    localStorage.setItem('x-app-secret', secretKey.trim())
    setHasSecret(true)
    setSecretSaved(true)
    setTimeout(() => setSecretSaved(false), 1500)
  }, [secretKey])

  const handleLoadDemo = useCallback(() => {
    setLanguage(DEMO.language)
    setProblem(DEMO.problem)
    setCode(DEMO.code)
    setAnalysis(DEMO.analysis)
    setStatus('success')
  }, [])

  const canAnalyze = code.trim().length > 0 && status !== 'loading'

  return (
    <div className='flex flex-col' style={{ height: '100%', background: 'var(--bg)' }}>
      {/* ── Header ── */}
      <header className='app-header flex items-center flex-shrink-0'>
        <span className='brand'>
          <span className='brand-after'>after</span>
          <span className='brand-code'>Code</span>
        </span>

        <div style={{ flex: 1 }} />

        <div className='flex items-center gap-3'>
          <span className='status-dot' data-status={status} />
          {status !== 'idle' && (
            <span className='label' style={{ letterSpacing: '0.10em', opacity: 0.8 }}>
              {status === 'loading' ? 'analyzing' : status}
            </span>
          )}
          <button
            onClick={() => setIsDark((d) => !d)}
            className='theme-toggle'
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className='flex flex-1 min-h-0'>
        {/* Left panel */}
        <div
          className='flex flex-col flex-shrink-0 left-panel'
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
              <CodeEditor language={language} value={code} onChange={setCode} isDark={isDark} />
            </div>
          </div>

          {/* Analyze */}
          <AnalyzeButton status={status} onClick={handleAnalyze} disabled={!canAnalyze} />
        </div>

        {/* Right panel */}
        <div className='flex-1 overflow-y-auto' style={{ padding: '14px' }}>
          {status === 'idle' && !hasSecret && (
            <div className='flex items-center justify-center' style={{ height: '100%' }}>
              <div
                className='mono'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  width: '260px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span className='label'>gated tool</span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: authError ? 'var(--red)' : 'var(--text-dim)',
                      lineHeight: 1.5,
                      transition: 'color 0.15s',
                    }}
                  >
                    {authError ?? 'secret key is required to run analyses'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type='password'
                    value={secretKey}
                    onChange={(e) => {
                      setSecretKey(e.target.value)
                      setAuthError(null)
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveSecret()}
                    placeholder='••••••••'
                    className='field'
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '12px',
                      borderColor: authError ? 'var(--red-border)' : undefined,
                    }}
                  />
                  <button
                    onClick={handleSaveSecret}
                    className='btn-analyze'
                    style={{ width: '100%' }}
                  >
                    {secretSaved ? 'unlocked ✓' : 'unlock →'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', opacity: 0.5 }}>
                    or
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>

                <button
                  onClick={handleLoadDemo}
                  style={{
                    width: '100%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: 'IBM Plex Mono, monospace',
                    textAlign: 'center',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-hi)'
                    e.currentTarget.style.color = 'var(--text)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  view demo
                </button>
              </div>
            </div>
          )}

          {status === 'idle' && hasSecret && (
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
              <AnalysisPanel analysis={analysis} language={language} isDark={isDark} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
