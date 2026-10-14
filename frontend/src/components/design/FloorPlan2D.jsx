import { useState } from 'react'

export const FloorPlan2D = ({ designSpec }) => {
  const [viewLayer, setViewLayer] = useState('architectural') // 'architectural' | 'mandala' | 'circulation'

  const areaSqFt = designSpec?.dimensions?.areaSqFt || 400
  const length = designSpec?.dimensions?.length || 20
  const width = designSpec?.dimensions?.width || 15

  return (
    <div className="glass-card p-5 space-y-5 overflow-hidden border border-white/10 rounded-2xl shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <h3 className="font-heading font-semibold text-white/95 text-base">
              Interactive 2D Architectural Floor Plan
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
              {length}' × {width}' ({areaSqFt} sq ft)
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            Top-down Vastu-calibrated spatial schematic with door swing and furniture layout
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10">
          <button
            onClick={() => setViewLayer('architectural')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewLayer === 'architectural'
                ? 'bg-saffron-500/30 text-saffron-300 border border-saffron-500/40'
                : 'text-white/45 hover:text-white/80'
            }`}
          >
            🏛️ Layout
          </button>
          <button
            onClick={() => setViewLayer('mandala')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewLayer === 'mandala'
                ? 'bg-saffron-500/30 text-saffron-300 border border-saffron-500/40'
                : 'text-white/45 hover:text-white/80'
            }`}
          >
            🕉️ Vastu Grid
          </button>
          <button
            onClick={() => setViewLayer('circulation')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewLayer === 'circulation'
                ? 'bg-saffron-500/30 text-saffron-300 border border-saffron-500/40'
                : 'text-white/45 hover:text-white/80'
            }`}
          >
            🔄 Circulation
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto bg-charcoal-950 rounded-xl border border-white/10 p-4 shadow-inner overflow-hidden">
        <svg viewBox="0 0 600 450" className="w-full h-full select-none">
          <defs>
            {/* Grid Pattern */}
            <pattern id="cad-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            {/* Wood Texture */}
            <linearGradient id="wood-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8D5524" />
              <stop offset="100%" stopColor="#5C3412" />
            </linearGradient>
            {/* Bed Fabric */}
            <linearGradient id="linen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2D9C8" />
              <stop offset="100%" stopColor="#C4B7A0" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="600" height="450" fill="url(#cad-grid)" />

          {/* Exterior Perimeter Walls */}
          <rect
            x="60"
            y="50"
            width="480"
            height="350"
            fill="#12161F"
            stroke="#4A5568"
            strokeWidth="10"
            rx="4"
          />

          {/* Inner Room Area */}
          <rect x="65" y="55" width="470" height="340" fill="#181F2E" />

          {/* ── 3x3 Vastu Mandala Overlay (When layer active) ── */}
          {viewLayer === 'mandala' && (
            <g stroke="#EAB308" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
              {/* Vertical Lines */}
              <line x1="221" y1="55" x2="221" y2="395" />
              <line x1="378" y1="55" x2="378" y2="395" />
              {/* Horizontal Lines */}
              <line x1="65" y1="168" x2="535" y2="168" />
              <line x1="65" y1="281" x2="535" y2="281" />

              {/* Mandala Zone Badges */}
              <text x="143" y="115" fill="#38BDF8" fontSize="11" textAnchor="middle" fontWeight="bold">Vayavya (NW)</text>
              <text x="300" y="115" fill="#34D399" fontSize="11" textAnchor="middle" fontWeight="bold">Uttar (N)</text>
              <text x="456" y="115" fill="#67E8F9" fontSize="11" textAnchor="middle" fontWeight="bold">Ishan (NE)</text>

              <text x="143" y="228" fill="#818CF8" fontSize="11" textAnchor="middle" fontWeight="bold">Pashchim (W)</text>
              <text x="300" y="228" fill="#FBBF24" fontSize="12" textAnchor="middle" fontWeight="bold">BRAHMASTHAN</text>
              <text x="456" y="228" fill="#FBBF24" fontSize="11" textAnchor="middle" fontWeight="bold">Purva (E)</text>

              <text x="143" y="341" fill="#F97316" fontSize="11" textAnchor="middle" fontWeight="bold">Nairutya (SW)</text>
              <text x="300" y="341" fill="#FB923C" fontSize="11" textAnchor="middle" fontWeight="bold">Dakshin (S)</text>
              <text x="456" y="341" fill="#F43F5E" fontSize="11" textAnchor="middle" fontWeight="bold">Agneya (SE)</text>
            </g>
          )}

          {/* ── Circulation Paths ── */}
          {viewLayer === 'circulation' && (
            <g stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 6" fill="none" opacity="0.8">
              <path d="M 280 55 L 280 200 L 400 200" />
              <path d="M 280 200 L 160 200 L 160 300" />
              <circle cx="280" cy="55" r="5" fill="#38BDF8" />
              <circle cx="280" cy="200" r="4" fill="#38BDF8" />
              <text x="290" y="140" fill="#38BDF8" fontSize="10" fontStyle="italic">Primary 3-ft Pathway</text>
            </g>
          )}

          {/* ── Architectural Elements ── */}

          {/* Main Entrance (North Wall) */}
          <g>
            {/* Door Opening */}
            <rect x="250" y="47" width="60" height="8" fill="#181F2E" />
            {/* Door Leaf */}
            <line x1="250" y1="52" x2="250" y2="105" stroke="#E2E8F0" strokeWidth="3" />
            {/* Swing Arc */}
            <path d="M 250 105 A 53 53 0 0 0 303 52" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <text x="280" y="40" fill="#E2E8F0" fontSize="10" textAnchor="middle" fontWeight="bold">ENTRANCE (NORTH)</text>
          </g>

          {/* East Window with Light Rays */}
          <g>
            <rect x="532" y="160" width="8" height="90" fill="#38BDF8" />
            <line x1="535" y1="175" x2="480" y2="190" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="535" y1="205" x2="470" y2="215" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="535" y1="235" x2="480" y2="240" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x="548" y="210" fill="#38BDF8" fontSize="9" transform="rotate(90 548 210)" textAnchor="middle">EAST WINDOW (SUNLIGHT)</text>
          </g>

          {/* Master Bed (South/Southwest Wall) */}
          <g>
            {/* Bed Frame */}
            <rect x="180" y="270" width="160" height="120" rx="4" fill="url(#linen-grad)" stroke="#8D5524" strokeWidth="3" />
            {/* Headboard */}
            <rect x="175" y="380" width="170" height="12" rx="2" fill="url(#wood-grad)" />
            {/* Pillows */}
            <rect x="195" y="340" width="55" height="32" rx="4" fill="#FFFFFF" opacity="0.9" stroke="#CBD5E1" />
            <rect x="270" y="340" width="55" height="32" rx="4" fill="#FFFFFF" opacity="0.9" stroke="#CBD5E1" />
            {/* Quilt fold */}
            <line x1="180" y1="315" x2="340" y2="315" stroke="#CBD5E1" strokeWidth="2" />
            <text x="260" y="300" fill="#475569" fontSize="11" textAnchor="middle" fontWeight="bold">MASTER BED</text>
            <text x="260" y="312" fill="#64748B" fontSize="8" textAnchor="middle">(Head South / SW)</text>

            {/* Bedside Tables */}
            <rect x="135" y="350" width="35" height="35" rx="3" fill="url(#wood-grad)" stroke="#4A5568" strokeWidth="1" />
            <rect x="350" y="350" width="35" height="35" rx="3" fill="url(#wood-grad)" stroke="#4A5568" strokeWidth="1" />
            <circle cx="152" cy="367" r="4" fill="#FBBF24" opacity="0.7" />
            <circle cx="367" cy="367" r="4" fill="#FBBF24" opacity="0.7" />
          </g>

          {/* Full-Height Wardrobe (West Wall) */}
          <g>
            <rect x="67" y="160" width="40" height="150" fill="url(#wood-grad)" stroke="#2D1F13" strokeWidth="2" rx="2" />
            <line x1="87" y1="160" x2="87" y2="310" stroke="#E2E8F0" strokeWidth="1" opacity="0.4" />
            <text x="85" y="240" fill="#E2E8F0" fontSize="9" transform="rotate(-90 85 240)" textAnchor="middle" fontWeight="bold">
              WARDROBE (WEST WALL)
            </text>
          </g>

          {/* Study & Work Desk (Northeast Zone near East Window) */}
          <g>
            <rect x="420" y="65" width="105" height="45" rx="3" fill="#2E384D" stroke="#4A5568" strokeWidth="2" />
            {/* Monitor */}
            <rect x="455" y="72" width="35" height="6" rx="1" fill="#94A3B8" />
            {/* Ergonomic Chair facing North/East */}
            <circle cx="472" cy="125" r="14" fill="#3B82F6" opacity="0.6" stroke="#93C5FD" strokeWidth="2" />
            <text x="472" y="95" fill="#E2E8F0" fontSize="9" textAnchor="middle" fontWeight="bold">STUDY DESK</text>
            <text x="472" y="105" fill="#38BDF8" fontSize="7" textAnchor="middle">(Face North/East)</text>
          </g>

          {/* Pooja / Mandir Nook (Ishan / Extreme NE Corner) */}
          <g>
            <rect x="495" y="65" width="35" height="35" rx="2" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="512" cy="82" r="8" fill="#F59E0B" opacity="0.5" />
            <text x="512" y="86" fill="#FFF" fontSize="10" textAnchor="middle" fontWeight="bold">🕉️</text>
            <text x="512" y="112" fill="#F59E0B" fontSize="8" textAnchor="middle" fontWeight="bold">MANDIR (NE)</text>
          </g>

          {/* Attached Washroom (Northwest Zone) */}
          <g>
            <rect x="67" y="65" width="85" height="80" fill="#1E293B" stroke="#475569" strokeWidth="2" rx="2" />
            <rect x="75" y="73" width="30" height="25" rx="2" fill="#334155" />
            <circle cx="90" cy="85" r="7" fill="#64748B" />
            <text x="110" y="115" fill="#94A3B8" fontSize="8" textAnchor="middle">WASHROOM (NW)</text>
          </g>

          {/* Compass Rose in Corner */}
          <g transform="translate(530, 390)">
            <circle cx="0" cy="0" r="18" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />
            <path d="M 0 -15 L 4 -2 L -4 -2 Z" fill="#EF4444" />
            <path d="M 0 15 L 4 2 L -4 2 Z" fill="#64748B" />
            <path d="M 15 0 L 2 4 L 2 -4 Z" fill="#64748B" />
            <path d="M -15 0 L -2 4 L -2 -4 Z" fill="#64748B" />
            <text x="0" y="-18" fill="#EF4444" fontSize="8" textAnchor="middle" fontWeight="bold">N</text>
            <text x="18" y="3" fill="#E2E8F0" fontSize="8" textAnchor="start">E</text>
          </g>
        </svg>
      </div>

      {/* Blueprint Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-400"></span>
          <span>South Wall: Master Bed</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-3 h-3 rounded-full bg-cyan-500/40 border border-cyan-400"></span>
          <span>East Wall: Sunlight Window</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-400"></span>
          <span>NE Corner: Ishan Mandir</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-3 h-3 rounded-full bg-slate-500/40 border border-slate-400"></span>
          <span>West Wall: Teak Wardrobe</span>
        </div>
      </div>
    </div>
  )
}
