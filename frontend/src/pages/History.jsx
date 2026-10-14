import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDesign } from '../hooks/useDesign'
import { useDesignContext } from '../context/DesignContext'

const DesignCard = ({ design, onDelete, onOpen }) => {
  const roomIcon = {
    bedroom: '🛏️', living_room: '🛋️', kitchen: '🍳', office: '💼',
    guest_room: '🏨', pooja_room: '🪔', dining_room: '🍽️', studio: '🏠',
  }[design.roomType] || '🏠'

  const heroImages = {
    bedroom: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=450&fit=crop&auto=format',
    living_room: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=450&fit=crop&auto=format',
    kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop&auto=format',
    pooja_room: '/views/temple.png',
    bathroom: '/views/washroom.png',
    office: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=450&fit=crop&auto=format',
  }

  const rawUrl = design.generatedImages?.[design.generatedImages.length - 1]?.url || design.imageUrl
  const thumbnail = (rawUrl && rawUrl !== '/views/demo_6views.png')
    ? rawUrl
    : (design.dimensions?.areaSqFt > 500
        ? '/views/demo_6views.png'
        : (heroImages[design.roomType] || rawUrl || '/views/demo_6views.png'))

  return (
    <div className="design-card group animate-fade-in" id={`design-card-${design._id}`}>
      {/* Thumbnail */}
      <div className="aspect-video rounded-xl overflow-hidden bg-charcoal-800 mb-4 relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={design.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl">{roomIcon}</span>
              <p className="text-white/20 text-xs mt-2">No preview</p>
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {design.dimensions?.areaSqFt && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white/90 border border-white/10">
              {design.dimensions.areaSqFt} sq ft
            </span>
          )}
        </div>
        {design.isMockData && (
          <div className="absolute top-2 right-2">
            <span className="badge-mock text-[10px]">Demo</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-4">
        <h3 className="font-heading font-semibold text-white/90 text-sm truncate">{design.title}</h3>
        <p className="text-xs text-white/45 flex items-center gap-1.5">
          <span>📍</span>
          {design.normalizedLocation || design.location}
        </p>
        <p className="text-xs text-white/35">
          {new Date(design.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </p>
        {design.projectSummary && (
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{design.projectSummary}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onOpen(design._id)}
          id={`open-design-${design._id}`}
          className="flex-1 btn-secondary justify-center py-2 text-xs"
        >
          Open Design
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(design._id) }}
          id={`delete-design-${design._id}`}
          className="btn-danger py-2 px-3 text-xs"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export const History = () => {
  const navigate = useNavigate()
  const { loadHistory, handleDeleteDesign } = useDesign()
  const { history, historyLoading, historyTotal } = useDesignContext()

  useEffect(() => {
    loadHistory()
  }, [])

  const handleOpen = (id) => navigate(`/design/${id}`)

  const handleDelete = async (id) => {
    if (window.confirm('Delete this design? This cannot be undone.')) {
      await handleDeleteDesign(id)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 page-enter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white mb-1">Design History</h1>
          <p className="text-white/40 text-sm">
            {historyTotal > 0 ? `${historyTotal} design${historyTotal !== 1 ? 's' : ''} saved` : 'Your generated designs will appear here'}
          </p>
        </div>
        <button
          id="new-design-history-btn"
          onClick={() => navigate('/new')}
          className="btn-primary"
        >
          ✨ New Design
        </button>
      </div>

      {historyLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card p-5">
              <div className="aspect-video rounded-xl shimmer-bg mb-4" />
              <div className="space-y-2">
                <div className="h-4 rounded shimmer-bg w-3/4" />
                <div className="h-3 rounded shimmer-bg w-1/2" />
                <div className="h-3 rounded shimmer-bg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-6 float-slow">🏘️</div>
          <h2 className="font-heading text-xl font-semibold text-white/60 mb-3">No designs yet</h2>
          <p className="text-white/30 text-sm mb-8 max-w-md">
            Create your first AI-powered Vastu-aware room design. It only takes a few minutes!
          </p>
          <button
            onClick={() => navigate('/new')}
            className="btn-primary text-base px-8 py-4"
          >
            ✨ Generate Your First Design
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map(design => (
            <DesignCard
              key={design._id}
              design={design}
              onOpen={handleOpen}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
