import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

export function formatFullAnalysis(analysis) {
  const { correctness: c, complexity: cx, code_review: cr, pattern: p } = analysis
  const lines = []

  lines.push('## Summary')
  lines.push(analysis.solution_summary)
  if (analysis.input_caveats) lines.push(`\n> ⚠ ${analysis.input_caveats}`)

  lines.push('\n## Correctness')
  lines.push(`**${c.assessment.replace(/_/g, ' ')}** — ${c.reasoning}`)
  if (c.edge_cases.length) {
    lines.push('\n**Edge cases:**')
    c.edge_cases.forEach((e) => lines.push(`- ${e}`))
  }

  lines.push('\n## Complexity')
  lines.push(`| | |`)
  lines.push(`|---|---|`)
  lines.push(`| Time | \`${cx.time}\` |`)
  lines.push(`| Space | \`${cx.space}\` |`)
  lines.push(`\n${cx.reasoning}`)

  lines.push('\n## Code Review')
  if (cr.strengths.length) {
    lines.push('\n**Strengths:**')
    cr.strengths.forEach((s) => lines.push(`- ${s}`))
  }
  if (cr.improvements.length) {
    lines.push('\n**Improvements:**')
    cr.improvements.forEach((i) => lines.push(`- **${i.issue}**\n  → ${i.suggestion}`))
  }

  lines.push('\n## Alternatives')
  analysis.alternatives.forEach((alt, i) => {
    lines.push(`\n### ${i + 1}. ${alt.approach} \`${alt.complexity}\``)
    lines.push(alt.reasoning)
    lines.push(`\n> ${alt.tradeoff}`)
    if (alt.code_example) lines.push(`\n\`\`\`\n${alt.code_example}\n\`\`\``)
  })

  lines.push('\n## Pattern')
  lines.push(`**${p.category}**`)
  lines.push(`\n${p.explanation}`)
  if (p.similar_problems.length) {
    lines.push('\n**Drill these next:**')
    p.similar_problems.forEach((sp, i) => {
      const eg = sp.named_example ? ` — e.g. *"${sp.named_example}"*` : ''
      lines.push(`${i + 1}. ${sp.problem_type}${eg}`)
    })
  }

  lines.push('\n## Follow-up')
  lines.push(`> "${analysis.interviewer_followup}"`)

  return lines.join('\n')
}

export function formatSectionAsText(section, analysis) {
  const parts = []
  switch (section) {
    case 'correctness':
      parts.push(`Assessment: ${analysis.correctness.assessment}`)
      parts.push(`Reasoning: ${analysis.correctness.reasoning}`)
      if (analysis.correctness.edge_cases.length) {
        parts.push(
          `Edge cases:\n${analysis.correctness.edge_cases.map((e) => `- ${e}`).join('\n')}`,
        )
      }
      break
    case 'complexity':
      parts.push(`Time: ${analysis.complexity.time}`)
      parts.push(`Space: ${analysis.complexity.space}`)
      parts.push(`Reasoning: ${analysis.complexity.reasoning}`)
      break
    case 'code_review':
      if (analysis.code_review.strengths.length) {
        parts.push(`Strengths:\n${analysis.code_review.strengths.map((s) => `+ ${s}`).join('\n')}`)
      }
      if (analysis.code_review.improvements.length) {
        parts.push(
          `Improvements:\n${analysis.code_review.improvements.map((i) => `- ${i.issue}\n  → ${i.suggestion}`).join('\n')}`,
        )
      }
      break
    case 'alternatives':
      analysis.alternatives.forEach((alt, i) => {
        parts.push(`${i + 1}. ${alt.approach} [${alt.complexity}]\n   ${alt.tradeoff}`)
      })
      break
    case 'pattern':
      parts.push(`Pattern: ${analysis.pattern.category}`)
      parts.push(analysis.pattern.explanation)
      parts.push(
        `Similar problems:\n${analysis.pattern.similar_problems.map((p) => `- ${p.problem_type}${p.named_example ? ` (e.g. "${p.named_example}")` : ''}`).join('\n')}`,
      )
      break
    default:
      return ''
  }
  return parts.join('\n\n')
}
