import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDesign } from '../../hooks/useDesign'

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-glow-saffron/50 flex-shrink-0">
      <span className="text-lg">🏠</span>
    </div>
    <div>
      <h1 className="font-heading font-bold text-base text-white leading-none">VastuVision</h1>
      <p className="text-[10px] text-saffron-400 font-medium tracking-wider uppercase">AI</p>
    </div>
  </div>
)

const NavItem = ({ to, icon, label, exact = false }) => (
  <NavLink
    to={to}
    end={exact}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
       ${isActive
         ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/20'
         : 'text-white/50 hover:text-white/80 hover:bg-white/5'
       }`
    }
  >
    <span className="text-base">{icon}</span>
    <span>{label}</span>
  </NavLink>
)

export const Sidebar = () => {
  const navigate = useNavigate()
  const { startNewDesign, history, loadHistory, historyLoading } = useDesign()

  useEffect(() => {
    loadHistory()
  }, [])

  const handleNewDesign = () => {
    startNewDesign()
    navigate('/new')
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-charcoal-900 border-r border-white/5 flex flex-col h-screen">
      {/* Brand */}
      <div className="p-5 border-b border-white/5">
        <Logo />
      </div>

      {/* New Design Button */}
      <div className="p-4">
        <button
          onClick={handleNewDesign}
          id="new-design-btn"
          className="w-full btn-primary justify-center py-2.5 text-sm"
        >
          <span>✨</span>
          <span>New Design</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1">
        <p className="section-label px-3 pb-2">Navigation</p>
        <NavItem to="/" icon="🏡" label="Home" exact />
        <NavItem to="/new" icon="🎨" label="Design Studio" />
        <NavItem to="/history" icon="🗂️" label="Design History" />
      </nav>

      {/* Recent Designs */}
      <div className="flex-1 overflow-hidden flex flex-col mt-6">
        <p className="section-label px-6 pb-3">Recent Designs</p>
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {historyLoading ? (
            <div className="space-y-2 px-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-xl shimmer-bg bg-white/3" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-3xl mb-2">🏘️</p>
              <p className="text-white/30 text-xs">No designs yet.<br />Start by creating one!</p>
            </div>
          ) : (
            history.slice(0, 8).map((design) => (
              <NavLink
                key={design._id}
                to={`/design/${design._id}`}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-xl transition-all duration-200 group
                   ${isActive ? 'bg-saffron-500/10 border border-saffron-500/15' : 'hover:bg-white/5'}`
                }
              >
                <p className="text-sm text-white/70 group-hover:text-white/90 truncate font-medium">
                  {design.title || `${design.roomType} design`}
                </p>
                <p className="text-xs text-white/30 truncate mt-0.5">
                  {design.normalizedLocation || design.location}
                </p>
              </NavLink>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="px-3 py-2.5 rounded-xl glass-card">
          <p className="text-xs text-white/40 leading-relaxed">
            College Project — AI + Vastu<br />
            <span className="text-saffron-500/70">Mumbai · Navi Mumbai</span>
          </p>
        </div>
      </div>
    </aside>
  )
}
