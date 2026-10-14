import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DesignResult } from '../components/design/DesignResult'
import { DesignExplanation } from '../components/design/DesignExplanation'
import { FloorPlan2D } from '../components/design/FloorPlan2D'
import { ChatInput } from '../components/chat/ChatInput'
import { ChatMessage } from '../components/chat/ChatMessage'
import { DesignProgress } from '../components/design/DesignProgress'
import { useDesign } from '../hooks/useDesign'
import { useDesignContext } from '../context/DesignContext'

export const DesignResultPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loadDesign, handleRefineDesign } = useDesign()
  const {
    currentDesign,
    currentDesignId,
    currentImageUrl,
    currentViews,
    conversation,
    isGenerating,
    isRefining,
    error,
    isMockData,
    clearError,
    startNewDesign,
  } = useDesignContext()

  const [activeTab, setActiveTab] = useState('visualization')
  const [loadError, setLoadError] = useState(null)

  // Load from URL id if we don't have this design in context
  useEffect(() => {
    if (id && id !== currentDesignId) {
      loadDesign(id).catch(() => setLoadError('Design not found.'))
    }
  }, [id])

  if (isGenerating) return <DesignProgress />

  if (loadError || (!currentDesign && !isGenerating)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-4">🏠</p>
          <p className="text-white/60 text-lg font-semibold mb-2">{loadError || 'No design loaded'}</p>
          <p className="text-white/30 text-sm mb-6">Start a new design to see results here.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { startNewDesign(); navigate('/new') }} className="btn-primary">
              ✨ New Design
            </button>
            <button onClick={() => navigate('/history')} className="btn-secondary">
              View History
            </button>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'visualization', label: '🎨 6-View Grid' },
    { id: 'floorplan', label: '📐 2D Floor Plan' },
    { id: 'explanation', label: '🧭 Vastu & Specs' },
    { id: 'chat', label: `💬 Refine${conversation.length > 0 ? ` (${conversation.length})` : ''}` },
  ]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-white/5 bg-charcoal-900/30 px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px
                  ${activeTab === tab.id
                    ? 'border-saffron-400 text-saffron-300'
                    : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-300 text-sm flex-1">{error}</p>
            <button onClick={clearError} className="text-red-400/60 hover:text-red-400">×</button>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'visualization' && (
            <div className="p-6 space-y-6 page-enter max-w-4xl mx-auto w-full">
              <DesignResult
                imageUrl={currentImageUrl}
                views={currentViews}
                designSpec={currentDesign}
                isMockData={isMockData}
                onSwitchToChat={() => setActiveTab('chat')}
              />
            </div>
          )}

          {activeTab === 'floorplan' && (
            <div className="p-6 max-w-4xl mx-auto w-full page-enter">
              <FloorPlan2D designSpec={currentDesign} />
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="p-6 max-w-2xl mx-auto w-full">
              <DesignExplanation designSpec={currentDesign} isMockData={isMockData} />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <ChatMessage messages={conversation} />
              <ChatInput
                onSend={(msg) => handleRefineDesign(currentDesignId, msg)}
                disabled={isRefining || !currentDesignId}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Quick Actions */}
      <div className="w-64 flex-shrink-0 border-l border-white/5 bg-charcoal-900/50 p-4 space-y-4 overflow-y-auto hidden lg:block">
        <p className="section-label">Quick Actions</p>

        <button
          id="new-design-quick-btn"
          onClick={() => { startNewDesign(); navigate('/new') }}
          className="w-full btn-primary justify-center py-2.5 text-sm"
        >
          ✨ New Design
        </button>

        <button
          onClick={() => navigate('/history')}
          className="w-full btn-secondary justify-center py-2.5 text-sm"
        >
          🗂️ History
        </button>

        {currentDesign && (
          <div className="mt-4 space-y-3">
            <p className="section-label">This Design</p>
            <div className="glass-card p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Location</span>
                <span className="text-white/70 text-right truncate ml-2 max-w-[100px]">{currentDesign.normalizedLocation || currentDesign.location}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Room</span>
                <span className="text-white/70 capitalize">{currentDesign.roomType?.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Area</span>
                <span className="text-white/70">{currentDesign.dimensions?.areaSqFt} sq ft</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Style</span>
                <span className="text-white/70 capitalize">{currentDesign.designStyle?.style || currentDesign.designStyle}</span>
              </div>
            </div>

            {isMockData && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/15">
                <p className="text-amber-300 text-xs font-semibold mb-1">⚡ Demo Mode</p>
                <p className="text-amber-200/50 text-[10px] leading-relaxed">
                  Add AI API keys to backend .env to generate real designs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
