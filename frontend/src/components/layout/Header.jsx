import { useLocation } from 'react-router-dom'
import { useDesignContext } from '../../context/DesignContext'
import { useTheme } from '../../context/ThemeContext'

const PAGE_TITLES = {
  '/': 'Welcome to VastuVision AI',
  '/new': 'Design Studio',
  '/history': 'Design History',
}

export const Header = () => {
  const location = useLocation()
  const { isMockData, mockModeEnabled } = useDesignContext()
  const { isDark, toggle } = useTheme()

  const isDesignPage = location.pathname.startsWith('/design/')
  const title = isDesignPage ? 'Design Result' : (PAGE_TITLES[location.pathname] || 'VastuVision AI')

  return (
    <header className="h-14 border-b border-white/5 bg-charcoal-900/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h2 className="font-heading font-semibold text-white/90 text-sm">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
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

        {/* ── Dark / Light Theme Toggle ── */}
        <button
          onClick={toggle}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
          style={{
            width: '54px',
            height: '28px',
            borderRadius: '999px',
            padding: '3px',
            border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.15)',
            background: isDark
              ? 'linear-gradient(135deg, #1c1a10 0%, #2a2410 100%)'
              : 'linear-gradient(135deg, #fff8e7 0%, #fdecc8 100%)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {/* Sliding knob */}
          <span
            style={{
              position: 'absolute',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: isDark
                ? 'linear-gradient(135deg, #c8860a, #f5b400)'
                : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              boxShadow: isDark
                ? '0 0 8px rgba(200,134,10,0.7), 0 2px 4px rgba(0,0,0,0.4)'
                : '0 0 10px rgba(251,191,36,0.6), 0 2px 4px rgba(0,0,0,0.15)',
              left: isDark ? '3px' : 'calc(100% - 25px)',
              transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
            }}
          >
            {isDark ? '🌙' : '☀️'}
          </span>

          {/* Right-side opposite icon (subtle) */}
          <span
            style={{
              position: 'absolute',
              right: '5px',
              fontSize: '10px',
              opacity: 0.45,
              transition: 'opacity 0.3s',
              pointerEvents: 'none',
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </span>
        </button>
      </div>
    </header>
  )
}
