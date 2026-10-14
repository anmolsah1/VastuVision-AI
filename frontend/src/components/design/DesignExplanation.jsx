import { useState } from 'react'
import { VastuCompassMeter } from './VastuCompassMeter'

const Section = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <h3 className="font-heading font-semibold text-white/90 text-sm">{title}</h3>
        </div>
        <span className={`text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">{children}</div>}
    </div>
  )
}

const VastuItem = ({ title, item }) => {
  if (!item) return null
  const isVastu = item.type === 'vastu' || item.type === 'both'
  const isPractical = item.type === 'practical' || item.type === 'both'

  return (
    <div className="space-y-2 p-4 rounded-xl bg-white/3 border border-white/8">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-white/80">{title}</p>
        <div className="flex gap-1">
          {isVastu && <span className="badge-vastu">🕉️ Vastu</span>}
          {isPractical && <span className="badge-practical">🏗️ Practical</span>}
        </div>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">{item.recommendation}</p>
      {item.reason && (
        <p className="text-xs text-white/45 leading-relaxed italic border-l-2 border-saffron-500/30 pl-3">
          {item.reason}
        </p>
      )}
    </div>
  )
}

const ColorSwatch = ({ color, label }) => (
  <div className="flex items-center gap-2.5">
    <div
      className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0 shadow-card"
      style={{ backgroundColor: color }}
    />
    <div>
      <p className="text-xs text-white/70 font-medium">{label}</p>
      <p className="text-[10px] text-white/30 font-mono">{color}</p>
    </div>
  </div>
)

export const DesignExplanation = ({ designSpec, isMockData }) => {
  if (!designSpec) return null

  const {
    projectSummary,
    siteAnalysis,
    vastuAnalysis,
    spacePlan,
    designStyle,
    colorPalette,
    recommendations,
  } = designSpec

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Mock Mode Notice */}
      {isMockData && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-amber-400 text-lg flex-shrink-0">⚡</span>
          <div>
            <p className="text-amber-300 text-sm font-semibold">Demo Mode Active</p>
            <p className="text-amber-200/60 text-xs mt-0.5">
              This design was generated using realistic sample data. Add your AI API keys to generate actual AI-powered designs.
            </p>
          </div>
        </div>
      )}

      {/* Project Summary */}
      {projectSummary && (
        <div className="p-5 glass-card">
          <h3 className="font-heading font-semibold text-white/90 text-sm mb-3 flex items-center gap-2">
            <span>📋</span> Project Summary
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">{projectSummary}</p>
        </div>
      )}

      {/* Vastu Compass & Energy Grid Meter */}
      <VastuCompassMeter designSpec={designSpec} />

      {/* Vastu Analysis */}
      {vastuAnalysis && (
        <Section title="Vastu Shastra Analysis" icon="🕉️">
          <div className="mb-3 p-3 rounded-lg bg-saffron-500/8 border border-saffron-500/15">
            <p className="text-xs text-saffron-300/80 leading-relaxed">
              <strong>Disclaimer:</strong> The following Vastu recommendations are based on traditional Indian cultural and architectural beliefs. They are presented as cultural traditions, not scientifically proven facts.
            </p>
          </div>
          <VastuItem title="Entrance Placement" item={vastuAnalysis.entrance} />
          <VastuItem title="Bed Position & Sleeping Direction" item={vastuAnalysis.bed} />
          <VastuItem title="Bathroom Placement" item={vastuAnalysis.bathroom} />
          <VastuItem title="Storage" item={vastuAnalysis.storage} />
          <VastuItem title="Study / Work Area" item={vastuAnalysis.studyArea} />
          <VastuItem title="Windows & Natural Light" item={vastuAnalysis.windows} />
          {vastuAnalysis.additionalNotes && (
            <div className="p-3 rounded-lg bg-white/3 border border-white/8">
              <p className="text-xs text-white/50 leading-relaxed">{vastuAnalysis.additionalNotes}</p>
            </div>
          )}
        </Section>
      )}

      {/* Space Plan */}
      {spacePlan && (
        <Section title="Space Planning" icon="📐">
          {spacePlan.zones?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Zones</p>
              {spacePlan.zones.map((zone, i) => (
                <div key={i} className="flex gap-2.5 text-sm">
                  <span className="text-saffron-400 flex-shrink-0 font-bold">{i + 1}.</span>
                  <p className="text-white/70">{zone}</p>
                </div>
              ))}
            </div>
          )}
          {spacePlan.furniture?.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Furniture Plan</p>
              {spacePlan.furniture.map((item, i) => (
                <div key={i} className="flex gap-2.5 text-sm">
                  <span className="text-white/20 flex-shrink-0">•</span>
                  <p className="text-white/65">{item}</p>
                </div>
              ))}
            </div>
          )}
          {spacePlan.circulation && (
            <div className="mt-3 p-3 rounded-lg bg-white/3 border border-white/8">
              <p className="text-xs text-white/40 mb-1">Circulation</p>
              <p className="text-sm text-white/65">{spacePlan.circulation}</p>
            </div>
          )}
          {spacePlan.ventilation && (
            <div className="p-3 rounded-lg bg-white/3 border border-white/8">
              <p className="text-xs text-white/40 mb-1">Ventilation</p>
              <p className="text-sm text-white/65">{spacePlan.ventilation}</p>
            </div>
          )}
        </Section>
      )}

      {/* Design Style */}
      {designStyle && (
        <Section title="Design Style & Materials" icon="🎨">
          <div className="grid grid-cols-2 gap-3">
            {designStyle.colors?.slice(0, 4).map((color, i) => (
              <div key={i} className="text-xs text-white/60 p-2.5 rounded-lg bg-white/3 border border-white/8">
                {color}
              </div>
            ))}
          </div>
          {designStyle.materials?.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Materials</p>
              {designStyle.materials.map((m, i) => (
                <p key={i} className="text-sm text-white/65">• {m}</p>
              ))}
            </div>
          )}
          {designStyle.furnitureStyle && (
            <div className="mt-3 p-3 rounded-lg bg-white/3 border border-white/8">
              <p className="text-xs text-white/40 mb-1">Furniture Style</p>
              <p className="text-sm text-white/65">{designStyle.furnitureStyle}</p>
            </div>
          )}
        </Section>
      )}

      {/* Color Palette */}
      {colorPalette && (
        <Section title="Color Palette" icon="🎨" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3">
            {colorPalette.primary && <ColorSwatch color={colorPalette.primary} label="Primary" />}
            {colorPalette.secondary && <ColorSwatch color={colorPalette.secondary} label="Secondary" />}
            {colorPalette.accent && <ColorSwatch color={colorPalette.accent} label="Accent" />}
            {colorPalette.neutral && <ColorSwatch color={colorPalette.neutral} label="Neutral" />}
          </div>
          {colorPalette.description && (
            <p className="text-xs text-white/45 leading-relaxed mt-3">{colorPalette.description}</p>
          )}
        </Section>
      )}

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <Section title="Key Recommendations" icon="💡" defaultOpen={false}>
          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const isVastu = rec.toLowerCase().includes('[vastu')
              const isPractical = rec.toLowerCase().includes('[practical')
              return (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                  <span className="text-base flex-shrink-0">
                    {isVastu ? '🕉️' : isPractical ? '🏗️' : '💡'}
                  </span>
                  <p className="text-sm text-white/70 leading-relaxed">{rec}</p>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Assumptions */}
      {siteAnalysis?.assumptions?.length > 0 && (
        <Section title="Assumptions & Limitations" icon="⚠️" defaultOpen={false}>
          <div className="p-3 rounded-lg bg-amber-500/8 border border-amber-500/15 mb-3">
            <p className="text-xs text-amber-300/80">
              These assumptions were made due to limited information. They do not affect the overall design quality but should be verified before construction.
            </p>
          </div>
          {siteAnalysis.assumptions.map((a, i) => (
            <p key={i} className="text-sm text-white/55 flex gap-2">
              <span className="text-amber-400/60">→</span>{a}
            </p>
          ))}
        </Section>
      )}
    </div>
  )
}
