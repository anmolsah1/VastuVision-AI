import { useState, useEffect } from 'react'

const DEFAULT_6_VIEWS = [
  {
    id: 'rooftop',
    label: 'Roof Top View',
    title: 'Roof Top / Terrace View',
    url: '/views/rooftop.png',
    vastuPrinciple: 'Terrace & Overhead Water Tank in SW / West; open airy deck in NE for positive solar energy flow.',
    description: 'Architectural isometric overview featuring solar panel setup, open terrace lounge, and perimeter greenery.',
  },
  {
    id: 'front_view',
    label: 'Front View',
    title: 'Front Elevation & Entrance',
    url: '/views/front_view.png',
    vastuPrinciple: 'Main entrance gate aligned to favorable Northern/Eastern Pada; welcoming foyer with warm lighting.',
    description: 'Modern two-story elevation with natural wood battens, glass balconies, warm ambient wall washers, and clean boundary.',
  },
  {
    id: 'back_view',
    label: 'Back View',
    title: 'Back Garden & Patio',
    url: '/views/back_view.png',
    vastuPrinciple: 'Backyard landscape with manicured lawn, cross-ventilation openings, and tranquil terrace canopy.',
    description: 'Rear view showing lush lawn pathway, ground floor sliding glass access, and first-floor covered pergola terrace.',
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    title: 'Master Bedroom',
    url: '/views/bedroom.png',
    vastuPrinciple: 'Master bed placed along South/West wall; head towards East or South for peaceful sleep without overhead beams.',
    description: 'Luxurious modern Indian bedroom with fluted wooden acoustic panel, cove ceiling lighting, fitted wardrobe, and study nook.',
  },
  {
    id: 'washroom',
    label: 'Washroom',
    title: 'En-Suite Bathroom',
    url: '/views/washroom.png',
    vastuPrinciple: 'Washroom placed in NW or West; slope and drainage towards North/East; mirrors mounted on North/East walls.',
    description: 'Sleek stone-textured bathroom with frameless glass shower cubicle, wall-hung WC, backlit LED mirror, and warm teak vanity.',
  },
  {
    id: 'temple',
    label: 'Temple',
    title: 'Pooja Room / Mandir',
    url: '/views/temple.png',
    vastuPrinciple: 'Ishan Kon (Northeast) holy orientation; deities facing East/West; illuminated wooden jali and brass accessories.',
    description: 'Sacred Mandir sanctuary with intricately carved wooden arch, backlit glowing Om, brass Ganesha and diyas, and velvet prayer rug.',
  },
]

export const DesignResult = ({
  imageUrl,
  views,
  designSpec,
  isMockData,
  onSwitchToChat,
}) => {
  // Use views from prop or designSpec or default 6 views
  const displayViews = views && views.length === 6
    ? views
    : designSpec?.views && designSpec.views.length === 6
    ? designSpec.views
    : DEFAULT_6_VIEWS

  const compositeUrl = imageUrl || '/views/demo_6views.png'

  const [activeViewMode, setActiveViewMode] = useState('grid') // 'grid' | 'composite'
  const [selectedViewIndex, setSelectedViewIndex] = useState(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copiedNotification, setCopiedNotification] = useState(false)

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedViewIndex === null) return
      if (e.key === 'Escape') setSelectedViewIndex(null)
      if (e.key === 'ArrowRight') {
        setSelectedViewIndex((prev) => (prev + 1) % displayViews.length)
      }
      if (e.key === 'ArrowLeft') {
        setSelectedViewIndex((prev) => (prev - 1 + displayViews.length) % displayViews.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedViewIndex, displayViews.length])

  // Download a single image
  const downloadImage = async (url, filename) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = filename
      a.click()
      URL.revokeObjectURL(objectUrl)
    } catch {
      window.open(url, '_blank')
    }
  }

  // Download all 6 views
  const handleDownloadAllViews = async () => {
    for (let i = 0; i < displayViews.length; i++) {
      const v = displayViews[i]
      await downloadImage(v.url, `vastuvision-${v.id}-${Date.now()}.png`)
      await new Promise((r) => setTimeout(r, 400))
    }
  }

  // Copy share link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 2500)
    setShowShareMenu(false)
  }

  return (
    <div className="space-y-6">
      {/* 6-View Visualization Card */}
      <div className="glass-card overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/5 bg-charcoal-900/60">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎨</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-white/95 text-sm sm:text-base tracking-wide">
                  6-View Design Visualization
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                  6 Views
                </span>
                {isMockData && <span className="badge-mock">Demo</span>}
              </div>
              <p className="text-[11px] text-white/40 hidden sm:block">
                All 6 architectural perspectives in a single unified view
              </p>
            </div>
          </div>

          {/* View Mode Controls & Download */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10">
              <button
                onClick={() => setActiveViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeViewMode === 'grid'
                    ? 'bg-saffron-500/30 text-saffron-300 border border-saffron-500/40'
                    : 'text-white/45 hover:text-white/80'
                }`}
                title="6 Images in 3x2 Grid"
              >
                ⊞ 6-View Grid
              </button>
              <button
                onClick={() => setActiveViewMode('composite')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeViewMode === 'composite'
                    ? 'bg-saffron-500/30 text-saffron-300 border border-saffron-500/40'
                    : 'text-white/45 hover:text-white/80'
                }`}
                title="Single Composite Sheet"
              >
                🖼️ Full Sheet
              </button>
            </div>

            <button
              id="download-all-btn"
              onClick={() => downloadImage(compositeUrl, `vastuvision-6views-${Date.now()}.png`)}
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 hover:border-saffron-500/40"
              title="Download Full 6-View Sheet"
            >
              <span>⬇️</span>
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* ── Main Canvas ── */}
        <div className="relative bg-charcoal-950 p-2 sm:p-3 select-none">
          {activeViewMode === 'grid' ? (
            /* 3-Column x 2-Row Grid matching user's demo format */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5 rounded-xl overflow-hidden bg-black/40 p-1">
              {displayViews.map((view, idx) => (
                <div
                  key={view.id || idx}
                  onClick={() => setSelectedViewIndex(idx)}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-charcoal-900 cursor-pointer border border-white/5 hover:border-saffron-500/50 transition-all duration-300 shadow-md hover:shadow-saffron-500/10"
                >
                  {/* Top-Left View Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-white text-[11px] sm:text-xs font-medium shadow-md flex items-center gap-1.5 pointer-events-none">
                    <span>{view.label}</span>
                  </div>

                  {/* Image */}
                  <img
                    src={view.url}
                    alt={view.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (view.fallbackUrl && e.currentTarget.src !== view.fallbackUrl) {
                        e.currentTarget.src = view.fallbackUrl
                      }
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-[11px] font-medium drop-shadow truncate">
                      🔍 Click to enlarge & inspect
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Composite Sheet View */
            <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/5">
              <img
                src={compositeUrl}
                alt="AI-generated 6-view architectural visualization"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* ── Floating "Edit" Button (Bottom-Left) ── */}
          <button
            id="floating-edit-btn"
            onClick={() => {
              if (onSwitchToChat) {
                onSwitchToChat()
              } else {
                const chatTab = document.getElementById('tab-chat')
                if (chatTab) chatTab.click()
              }
            }}
            className="absolute bottom-5 left-5 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white font-medium text-sm shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 group"
            title="Refine and modify this design with AI chat"
          >
            <span className="text-base group-hover:rotate-12 transition-transform">✏️</span>
            <span>Edit</span>
          </button>

          {/* ── Floating Share / Action Button (Bottom-Right) ── */}
          <div className="absolute bottom-5 right-5 z-20">
            <button
              id="floating-share-btn"
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 text-lg"
              title="Share or download options"
            >
              📤
            </button>

            {/* Share / Download Dropdown Menu */}
            {showShareMenu && (
              <div className="absolute bottom-14 right-0 w-60 rounded-xl bg-charcoal-900/95 backdrop-blur-xl border border-white/15 p-2 shadow-2xl z-30 space-y-1 animate-fade-in">
                <button
                  onClick={() => {
                    downloadImage(compositeUrl, `vastuvision-6views-${Date.now()}.png`)
                    setShowShareMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                >
                  <span>🖼️</span>
                  <span>Download 6-View Sheet</span>
                </button>
                <button
                  onClick={() => {
                    handleDownloadAllViews()
                    setShowShareMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                >
                  <span>🗂️</span>
                  <span>Download All 6 Separate Views</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors border-t border-white/5 pt-2"
                >
                  <span>🔗</span>
                  <span>Copy Design Link</span>
                </button>
              </div>
            )}
          </div>

          {/* Copy Notification Toast */}
          {copiedNotification && (
            <div className="absolute top-5 right-5 z-30 px-3.5 py-2 rounded-lg bg-emerald-600/90 text-white text-xs font-medium shadow-xl backdrop-blur-md animate-fade-in flex items-center gap-1.5">
              <span>✅</span>
              <span>Link copied to clipboard!</span>
            </div>
          )}
        </div>

        {/* Footer Caption */}
        <div className="px-5 py-3 bg-charcoal-900/70 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            6 Views Composite: {displayViews.map(v => v.label).join(' · ')}
          </p>
          <p className="text-[11px] text-white/30">
            {designSpec?.normalizedLocation || designSpec?.location || 'Mumbai'}
          </p>
        </div>
      </div>

      {/* ── Lightbox / Fullscreen Modal ── */}
      {selectedViewIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setSelectedViewIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-charcoal-900 border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-charcoal-950/70">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 text-xs font-semibold">
                  {displayViews[selectedViewIndex].label}
                </span>
                <h4 className="text-white font-heading font-semibold text-base">
                  {displayViews[selectedViewIndex].title}
                </h4>
                <span className="text-white/35 text-xs">
                  ({selectedViewIndex + 1} of {displayViews.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    downloadImage(
                      displayViews[selectedViewIndex].url,
                      `vastuvision-${displayViews[selectedViewIndex].id}.png`
                    )
                  }
                  className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1"
                >
                  <span>⬇️</span>
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setSelectedViewIndex(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center text-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Image Display */}
            <div className="relative aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={displayViews[selectedViewIndex].url}
                alt={displayViews[selectedViewIndex].label}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const fallback = displayViews[selectedViewIndex]?.fallbackUrl
                  if (fallback && e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback
                  }
                }}
              />

              {/* Prev / Next Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedViewIndex(
                    (prev) => (prev - 1 + displayViews.length) % displayViews.length
                  )
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center text-xl backdrop-blur-md border border-white/10 transition-all hover:scale-110"
                title="Previous view (Left Arrow)"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedViewIndex((prev) => (prev + 1) % displayViews.length)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center text-xl backdrop-blur-md border border-white/10 transition-all hover:scale-110"
                title="Next view (Right Arrow)"
              >
                ›
              </button>
            </div>

            {/* Modal Vastu & Design Insights */}
            <div className="p-5 bg-charcoal-950/60 border-t border-white/10 space-y-2">
              {displayViews[selectedViewIndex].vastuPrinciple && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-saffron-500/10 border border-saffron-500/20">
                  <span className="text-base flex-shrink-0">🕉️</span>
                  <div>
                    <p className="text-saffron-300 font-semibold text-xs">Vastu Alignment</p>
                    <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
                      {displayViews[selectedViewIndex].vastuPrinciple}
                    </p>
                  </div>
                </div>
              )}
              {displayViews[selectedViewIndex].description && (
                <p className="text-white/50 text-xs px-1">
                  {displayViews[selectedViewIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Design Specifications & Metadata Cards */}
      {designSpec && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="glass-card p-4">
            <p className="text-xs text-white/40 mb-1.5">📐 Total Area</p>
            <p className="text-lg font-heading font-bold text-white">
              {designSpec.dimensions?.areaSqFt || '—'}{' '}
              <span className="text-sm font-normal text-white/50">sq ft</span>
            </p>
            {designSpec.dimensions?.length && designSpec.dimensions?.width && (
              <p className="text-[11px] text-white/40 mt-0.5">
                {designSpec.dimensions.length} × {designSpec.dimensions.width} ft
              </p>
            )}
          </div>

          <div className="glass-card p-4">
            <p className="text-xs text-white/40 mb-1.5">👥 Occupancy</p>
            <p className="text-lg font-heading font-bold text-white">
              {designSpec.occupants || '—'}{' '}
              <span className="text-sm font-normal text-white/50">persons</span>
            </p>
          </div>

          <div className="glass-card p-4">
            <p className="text-xs text-white/40 mb-1.5">🏠 Layout Type</p>
            <p className="text-sm font-semibold text-white capitalize truncate">
              {designSpec.roomType?.replace(/_/g, ' ') || 'Residential'}
            </p>
          </div>

          <div className="glass-card p-4">
            <p className="text-xs text-white/40 mb-1.5">🎨 Design Style</p>
            <p className="text-sm font-semibold text-white capitalize truncate">
              {designSpec.designStyle?.style || designSpec.designStyle || 'Modern Indian'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
