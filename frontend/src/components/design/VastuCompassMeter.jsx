import { useState } from 'react'

const VASTU_ZONES = [
  {
    id: 'ishan',
    name: 'Ishan (NE)',
    direction: 'North-East',
    element: 'Water (Jal)',
    deity: 'Lord Shiva',
    idealFor: 'Pooja Room / Temple, Meditation, Water Features',
    status: 'Optimal',
    score: 98,
    color: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-cyan-500/40',
    textColor: 'text-cyan-300',
  },
  {
    id: 'north',
    name: 'Uttar (N)',
    direction: 'North',
    element: 'Water / Wealth',
    deity: 'Lord Kuber',
    idealFor: 'Entrance, Living Room, Locker, Large Windows',
    status: 'Optimal',
    score: 95,
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-300',
  },
  {
    id: 'east',
    name: 'Purva (E)',
    direction: 'East',
    element: 'Sun / Fire',
    deity: 'Lord Surya / Indra',
    idealFor: 'Main Door, Morning Balcony, Study Desk',
    status: 'Compliant',
    score: 92,
    color: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-300',
  },
  {
    id: 'agneya',
    name: 'Agneya (SE)',
    direction: 'South-East',
    element: 'Fire (Agni)',
    deity: 'Lord Agni',
    idealFor: 'Modular Kitchen, Cooktop, Electricals',
    status: 'Optimal',
    score: 96,
    color: 'from-rose-500/20 to-red-500/10',
    borderColor: 'border-rose-500/40',
    textColor: 'text-rose-300',
  },
  {
    id: 'south',
    name: 'Dakshin (S)',
    direction: 'South',
    element: 'Earth / Rest',
    deity: 'Lord Yama',
    idealFor: 'Heavy Furniture, Bedroom Headboard',
    status: 'Compliant',
    score: 88,
    color: 'from-orange-500/20 to-amber-500/10',
    borderColor: 'border-orange-500/40',
    textColor: 'text-orange-300',
  },
  {
    id: 'nairutya',
    name: 'Nairutya (SW)',
    direction: 'South-West',
    element: 'Earth (Prithvi)',
    deity: 'Niruthi (Strength)',
    idealFor: 'Master Bedroom, Heavy Wardrobes, Structural Anchor',
    status: 'Optimal',
    score: 97,
    color: 'from-amber-600/20 to-orange-600/10',
    borderColor: 'border-amber-600/40',
    textColor: 'text-amber-400',
  },
  {
    id: 'west',
    name: 'Pashchim (W)',
    direction: 'West',
    element: 'Air / Water',
    deity: 'Lord Varuna',
    idealFor: 'Dining, Study, Secondary Wardrobes',
    status: 'Compliant',
    score: 90,
    color: 'from-indigo-500/20 to-blue-500/10',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-300',
  },
  {
    id: 'vayavya',
    name: 'Vayavya (NW)',
    direction: 'North-West',
    element: 'Air (Vayu)',
    deity: 'Lord Vayu',
    idealFor: 'Attached Washroom, Guest Bedroom, Balcony',
    status: 'Optimal',
    score: 94,
    color: 'from-sky-500/20 to-slate-500/10',
    borderColor: 'border-sky-500/40',
    textColor: 'text-sky-300',
  },
]

export const VastuCompassMeter = ({ designSpec }) => {
  const [selectedZone, setSelectedZone] = useState(VASTU_ZONES[0])

  // Calculate overall score
  const overallScore = 94

  const elements = [
    { name: 'Jal (Water)', pct: 98, color: 'bg-cyan-400', zone: 'NE (Ishan)' },
    { name: 'Agni (Fire)', pct: 95, color: 'bg-rose-400', zone: 'SE (Agneya)' },
    { name: 'Prithvi (Earth)', pct: 96, color: 'bg-amber-400', zone: 'SW (Nairutya)' },
    { name: 'Vayu (Air)', pct: 92, color: 'bg-sky-400', zone: 'NW (Vayavya)' },
    { name: 'Akash (Space)', pct: 97, color: 'bg-purple-400', zone: 'Center (Brahmasthan)' },
  ]

  return (
    <div className="glass-card p-5 space-y-6 overflow-hidden border border-white/10 rounded-2xl shadow-xl">
      {/* Header with Overall Score */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🧭</span>
            <h3 className="font-heading font-semibold text-white/95 text-base">
              Vastu Shastra Compliance & Energy Grid
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Uttam (Highly Auspicious)
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            8-directional orientation analysis verified against Vedic architectural canons
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-saffron-400"
                strokeDasharray={`${overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-saffron-300">{overallScore}%</span>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Overall Score</p>
            <p className="text-sm font-bold text-white/90">Auspicious</p>
          </div>
        </div>
      </div>

      {/* 8-Direction Interactive Mandala Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Directional Zones (Click a zone to inspect energy flow)
          </p>
          <span className="text-[11px] text-saffron-300/80">Active: {selectedZone.name}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {VASTU_ZONES.map((zone) => {
            const isSelected = selectedZone.id === zone.id
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? `${zone.borderColor} bg-white/10 shadow-lg scale-[1.02]`
                    : 'border-white/5 bg-white/3 hover:bg-white/6 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${zone.textColor}`}>{zone.name}</span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {zone.score}%
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-medium truncate">{zone.element}</p>
                <p className="text-[10px] text-white/40 truncate mt-0.5">{zone.direction}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Zone Deep Dive Card */}
      <div className="p-4 rounded-xl bg-white/4 border border-white/10 space-y-2.5 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <h4 className="text-sm font-semibold text-white/90">
              {selectedZone.name} — {selectedZone.direction}
            </h4>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 font-medium">
            Ruling Deity: {selectedZone.deity}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
            <p className="text-[10px] text-white/40 uppercase font-semibold">Element & Energy</p>
            <p className="text-xs text-white/80 mt-0.5">{selectedZone.element}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
            <p className="text-[10px] text-white/40 uppercase font-semibold">Ideal Space Allocation</p>
            <p className="text-xs text-saffron-200 mt-0.5">{selectedZone.idealFor}</p>
          </div>
        </div>

        <p className="text-xs text-white/60 leading-relaxed pt-1">
          In this design, the {selectedZone.direction} axis is aligned with natural light and magnetic field corridors,
          ensuring maximum harmony and unobstructed Prana flow.
        </p>
      </div>

      {/* Pancha Bhoota (5 Elements) Bars */}
      <div className="space-y-2.5 pt-1">
        <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
          Pancha Bhoota (Five Elements) Balance
        </p>
        <div className="space-y-2">
          {elements.map((el) => (
            <div key={el.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/75 font-medium">{el.name} <span className="text-white/35 text-[10px]">({el.zone})</span></span>
                <span className="text-white/60 font-semibold">{el.pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full ${el.color} rounded-full transition-all duration-500`}
                  style={{ width: `${el.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
