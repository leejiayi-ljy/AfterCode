import SolutionSummary from './sections/SolutionSummary.jsx'
import CorrectnessSection from './sections/CorrectnessSection.jsx'
import ComplexitySection from './sections/ComplexitySection.jsx'
import CodeReviewSection from './sections/CodeReviewSection.jsx'
import AlternativesSection from './sections/AlternativesSection.jsx'
import PatternSection from './sections/PatternSection.jsx'
import FollowUpSection from './sections/FollowUpSection.jsx'

export default function AnalysisPanel({ analysis }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SolutionSummary analysis={analysis} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <CorrectnessSection analysis={analysis} />
        <ComplexitySection analysis={analysis} />
      </div>
      <CodeReviewSection analysis={analysis} />
      <AlternativesSection analysis={analysis} />
      <PatternSection analysis={analysis} />
      <FollowUpSection analysis={analysis} />
    </div>
  )
}
