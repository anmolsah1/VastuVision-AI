import { useLocation } from 'react-router-dom'
import { useDesignContext } from '../../context/DesignContext'

const PAGE_TITLES = {
  '/': 'Welcome to Archie AI',
  '/new': 'Design Studio',
  '/history': 'Design History',
}

export const Header = () => {
  const location = useLocation()
  const { isMockData, mockModeEnabled } = useDesignContext()

  const isDesignPage = location.pathname.startsWith('/design/')
  const title = isDesignPage ? 'Design Result' : (PAGE_TITLES[location.pathname] || 'Archie AI')

  return (
    <header className="h-14 border-b border-white/5 bg-charcoal-900/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h2 className="font-heading font-semibold text-white/90 text-sm">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Mock Mode Badge */}
        {mockModeEnabled && (
          <div className="badge-mock gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Demo Mode
          </div>
        )}

        {/* AI Status */}
        <div className="flex items-center gap-1.5 text-xs text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>AI Ready</span>
        </div>
      </div>
    </header>
  )
}
