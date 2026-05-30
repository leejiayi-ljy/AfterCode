import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
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
