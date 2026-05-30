import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

function getLanguageExtension(language) {
  switch (language) {
    case 'python':
      return python()
    case 'javascript':
      return javascript()
    case 'typescript':
      return javascript({ typescript: true })
    default:
      return python()
  }
}

const readOnlyTheme = EditorView.theme({
  '&': { height: 'auto' },
  '.cm-scroller': { overflow: 'auto', maxHeight: '220px' },
  '.cm-cursor': { display: 'none' },
})

export default function CodeEditor({ language, value, onChange, readOnly = false }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const extensions = [
      basicSetup,
      oneDark,
      getLanguageExtension(language),
    ]

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true))
      extensions.push(EditorView.editable.of(false))
      extensions.push(readOnlyTheme)
    } else {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChangeRef.current(update.state.doc.toString())
        })
      )
    }

    const view = new EditorView({
      state: EditorState.create({ doc: value, extensions }),
      parent: containerRef.current,
    })
    viewRef.current = view
    return () => view.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, readOnly])

  useEffect(() => {
    const view = viewRef.current
    if (!view || readOnly) return
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } })
    }
  }, [value, readOnly])

  return <div ref={containerRef} className={readOnly ? '' : 'h-full'} />
}
