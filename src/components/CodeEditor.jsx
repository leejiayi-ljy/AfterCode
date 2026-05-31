import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { tags as t } from '@lezer/highlight'

function getLanguageExtension(language) {
  switch (language) {
    case 'python': return python()
    case 'javascript': return javascript()
    case 'typescript': return javascript({ typescript: true })
    default: return python()
  }
}

// Custom Lavender mist syntax highlight
const paperHighlightStyle = HighlightStyle.define([
  { tag: t.keyword,                color: '#5B50C8', fontWeight: '500' },
  { tag: t.controlKeyword,         color: '#7C3AED', fontWeight: '500' },
  { tag: t.operatorKeyword,        color: '#5B50C8', fontWeight: '500' },
  { tag: t.definitionKeyword,      color: '#2D7A9A', fontWeight: '500' },
  { tag: t.string,                 color: '#A05A1E' },
  { tag: t.special(t.string),      color: '#A05A1E' },
  { tag: t.regexp,                 color: '#B5460C' },
  { tag: t.number,                 color: '#0F766E' },
  { tag: t.bool,                   color: '#0F766E', fontWeight: '500' },
  { tag: t.null,                   color: '#0F766E', fontWeight: '500' },
  { tag: t.comment,                color: '#B4B0CC', fontStyle: 'italic' },
  { tag: t.lineComment,            color: '#B4B0CC', fontStyle: 'italic' },
  { tag: t.blockComment,           color: '#B4B0CC', fontStyle: 'italic' },
  { tag: t.function(t.variableName), color: '#6D28D9' },
  { tag: t.function(t.definition(t.variableName)), color: '#6D28D9', fontWeight: '500' },
  { tag: t.definition(t.variableName), color: '#2D7A9A' },
  { tag: t.definition(t.propertyName), color: '#276749' },
  { tag: t.typeName,               color: '#276749', fontWeight: '500' },
  { tag: t.className,              color: '#276749', fontWeight: '500' },
  { tag: t.namespace,              color: '#276749' },
  { tag: t.propertyName,           color: '#3B5FC0' },
  { tag: t.operator,               color: '#8B7EC8' },
  { tag: t.punctuation,            color: '#7B7AA0' },
  { tag: t.bracket,                color: '#8B8AB0' },
  { tag: t.angleBracket,           color: '#8B8AB0' },
  { tag: t.tagName,                color: '#A05A1E', fontWeight: '500' },
  { tag: t.attributeName,          color: '#5B50C8' },
  { tag: t.attributeValue,         color: '#276749' },
  { tag: t.meta,                   color: '#8B8AB0' },
  { tag: t.variableName,           color: '#1E1B4B' },
  { tag: t.self,                   color: '#7C3AED', fontStyle: 'italic' },
  { tag: t.constant(t.variableName), color: '#0F766E', fontWeight: '500' },
  { tag: t.special(t.variableName), color: '#B5460C' },
  { tag: t.inserted,               color: '#276749' },
  { tag: t.deleted,                color: '#9F1239' },
  { tag: t.changed,                color: '#A05A1E' },
])

const paperLightTheme = EditorView.theme({
  '&': { backgroundColor: 'transparent', color: '#1E1B4B' },
  '.cm-content': { caretColor: '#1E1B4B' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#7C3AED' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'rgba(124, 58, 237, 0.1) !important',
  },
  '.cm-activeLine': { backgroundColor: 'rgba(124, 58, 237, 0.03)' },
  '.cm-activeLineGutter': { backgroundColor: 'rgba(124, 58, 237, 0.03)' },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: '#B4B0CC',
    borderRight: '1px solid rgba(55, 48, 107, 0.1)',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    outline: '1px solid rgba(124, 58, 237, 0.25)',
  },
}, { dark: false })

const readOnlyTheme = EditorView.theme({
  '&': { height: 'auto' },
  '.cm-scroller': { overflow: 'auto', maxHeight: '220px' },
  '.cm-cursor': { display: 'none' },
})

export default function CodeEditor({ language, value, onChange, readOnly = false, isDark = true }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const extensions = isDark
      ? [basicSetup, oneDark, getLanguageExtension(language)]
      : [basicSetup, paperLightTheme, syntaxHighlighting(paperHighlightStyle), getLanguageExtension(language)]

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
  }, [language, readOnly, isDark])

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
