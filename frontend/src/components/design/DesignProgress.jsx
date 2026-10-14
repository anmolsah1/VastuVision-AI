import { useDesignContext } from '../../context/DesignContext'

const STAGE_ORDER = ['start', 'analyzing', 'vastu', 'planning', 'image', 'complete']

const StageIcon = ({ stage, currentStage, done }) => {
  const icons = {
    start:     '🚀',
    analyzing: '🔍',
    vastu:     '🕉️',
    planning:  '📐',
    image:     '🎨',
    complete:  '✨',
  }

  const stageIdx = STAGE_ORDER.indexOf(stage)
  const currentIdx = STAGE_ORDER.indexOf(currentStage)
  const isDone = stageIdx < currentIdx || done
  const isActive = stageIdx === currentIdx

  return (
    <div className={`flex items-center gap-3 transition-all duration-500
      ${isDone ? 'opacity-100' : isActive ? 'opacity-100' : 'opacity-30'}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all duration-500
        ${isDone ? 'bg-green-500/20 border border-green-500/30' : ''}
        ${isActive ? 'bg-saffron-500/20 border border-saffron-500/40 animate-pulse-glow' : ''}
        ${!isDone && !isActive ? 'bg-white/5 border border-white/10' : ''}
      `}>
        {isDone ? '✅' : icons[stage]}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium transition-colors ${isActive ? 'text-saffron-300' : isDone ? 'text-green-400' : 'text-white/40'}`}>
          {STAGE_LABELS[stage]}
        </p>
        {isActive && (
          <div className="mt-1.5 h-1 bg-charcoal-800 rounded-full overflow-hidden w-32">
            <div className="h-full bg-gradient-to-r from-saffron-500 to-saffron-300 rounded-full animate-pulse w-3/4" />
          </div>
        )}
      </div>
    </div>
  )
}

const STAGE_LABELS = {
  start:     'Starting AI Analysis',
  analyzing: 'Analyzing Your Space',
  vastu:     'Applying Vastu Shastra',
  planning:  'Planning Furniture Layout',
  image:     'Creating 6-View Visualization',
  complete:  'Design Ready!',
}

export const DesignProgress = () => {
  const { progress, isGenerating } = useDesignContext()
  const currentStage = progress.stage || 'start'
  const isDone = currentStage === 'complete'

  if (!isGenerating && !isDone) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-8 page-enter">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-400/20 to-saffron-600/20 border border-saffron-500/30 flex items-center justify-center text-3xl mx-auto mb-4 animate-spin-slow">
          🏠
        </div>
        <h2 className="font-heading text-2xl font-bold text-white mb-2">
          {isDone ? 'Design Complete!' : 'Generating Your Vastu-Aware Design'}
        </h2>
        <p className="text-white/50 text-sm max-w-md">
          {isDone
            ? 'Your AI-generated 6-view design with Vastu analysis is ready.'
            : 'Our AI is analyzing your space using traditional Vastu principles and modern design theory.'
          }
        </p>
      </div>

      {/* Stage List */}
      <div className="w-full max-w-sm space-y-4 glass-card p-6">
        {STAGE_ORDER.filter(s => s !== 'error').map(stage => (
          <StageIcon
            key={stage}
            stage={stage}
            currentStage={currentStage}
            done={isDone}
          />
        ))}
      </div>

      {/* Disclaimer */}
      {isGenerating && (
        <p className="mt-8 text-xs text-white/25 text-center max-w-xs">
          AI generation can take 15–60 seconds. Vastu analysis is based on traditional Indian principles, not scientific claims.
        </p>
      )}
    </div>
  )
}
