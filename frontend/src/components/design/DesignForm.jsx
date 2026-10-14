import { useState } from 'react'

// ── Data ──────────────────────────────────────────────────────────────────────

const ROOM_TYPES = [
  { value: 'bedroom',     label: 'Bedroom',      icon: '🛏️', countable: true,  max: 6 },
  { value: 'bathroom',    label: 'Bathroom',     icon: '🚿', countable: true,  max: 5 },
  { value: 'toilet',      label: 'Toilet',       icon: '🚽', countable: true,  max: 5 },
  { value: 'living_room', label: 'Living Room',  icon: '🛋️', countable: false, max: 1 },
  { value: 'kitchen',     label: 'Kitchen',      icon: '🍳', countable: true,  max: 2 },
  { value: 'dining_room', label: 'Dining Room',  icon: '🍽️', countable: false, max: 1 },
  { value: 'office',      label: 'Study/Office', icon: '💼', countable: false, max: 1 },
  { value: 'pooja_room',  label: 'Pooja Room',   icon: '🪔', countable: false, max: 1 },
  { value: 'guest_room',  label: 'Guest Room',   icon: '🏨', countable: true,  max: 3 },
  { value: 'store_room',  label: 'Store Room',   icon: '📦', countable: true,  max: 2 },
]

const ADDITIONAL_SPACES = [
  { value: 'mini_balcony',   label: 'Mini Balcony',     icon: '🌿', desc: 'Small outdoor ledge / sit-out' },
  { value: 'garden',         label: 'Garden / Terrace',  icon: '🌳', desc: 'Open green space or rooftop' },
  { value: 'utility',        label: 'Utility Area',      icon: '🧺', desc: 'Washing/drying area' },
  { value: 'foyer',          label: 'Foyer / Entry',     icon: '🚪', desc: 'Entrance lobby' },
  { value: 'wardrobe_wall',  label: 'Wardrobe Wall',     icon: '🗄️', desc: 'Built-in wardrobe unit' },
  { value: 'mandir_corner',  label: 'Mandir Corner',     icon: '🕯️', desc: 'Dedicated prayer nook' },
  { value: 'kids_play',      label: 'Kids Play Area',    icon: '🧸', desc: 'Dedicated children\'s zone' },
  { value: 'home_gym',       label: 'Home Gym Corner',   icon: '🏋️', desc: 'Workout / exercise space' },
]

const DESIGN_STYLES = [
  { value: 'modern_indian',    label: 'Modern Indian',     icon: '🏙️' },
  { value: 'traditional_indian', label: 'Traditional',     icon: '🏯' },
  { value: 'contemporary',    label: 'Contemporary',       icon: '✨' },
  { value: 'minimalist',      label: 'Minimalist',         icon: '⬜' },
  { value: 'fusion',          label: 'Fusion',             icon: '🌐' },
  { value: 'classic',         label: 'Classic',            icon: '🏛️' },
]

const BUDGETS = [
  { value: 'low',    label: '₹ Economy',   desc: 'Budget-friendly' },
  { value: 'medium', label: '₹₹ Mid-Range', desc: 'Best value' },
  { value: 'high',   label: '₹₹₹ Premium', desc: 'High quality' },
  { value: 'luxury', label: '₹₹₹₹ Luxury',  desc: 'Ultra premium' },
]

const MUMBAI_LOCATIONS = [
  'Airoli, Navi Mumbai', 'Vashi, Navi Mumbai', 'Nerul, Navi Mumbai',
  'Kharghar, Navi Mumbai', 'CBD Belapur, Navi Mumbai', 'Panvel, Navi Mumbai',
  'Andheri, Mumbai', 'Bandra, Mumbai', 'Powai, Mumbai', 'Thane',
  'Borivali, Mumbai', 'Dadar, Mumbai', 'Goregaon, Mumbai', 'Malad, Mumbai',
  'Mulund, Mumbai', 'Vikhroli, Mumbai', 'Kopar Khairane, Navi Mumbai',
  'Ghansoli, Navi Mumbai', 'Belapur, Navi Mumbai',
]

// ── Counter Component ─────────────────────────────────────────────────────────

const Counter = ({ value, min = 1, max = 6, onChange }) => (
  <div className="flex items-center gap-1.5">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold
                 text-white/60 hover:text-white hover:bg-white/15 active:scale-90
                 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >−</button>
    <span className="w-5 text-center text-sm font-bold text-saffron-300">{value}</span>
    <button
      type="button"
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold
                 text-white/60 hover:text-white hover:bg-white/15 active:scale-90
                 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >+</button>
  </div>
)

// ── Main Form ─────────────────────────────────────────────────────────────────

export const DesignForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    location:    '',
    areaSqFt:    '',
    length:      '',
    width:       '',
    occupants:   '2',
    budget:      'medium',
    designStyle: 'modern_indian',
  })

  // Multi-select rooms: { value: count }
  const [selectedRooms, setSelectedRooms] = useState({ bedroom: 1 })

  // Additional spaces toggles
  const [additionalSpaces, setAdditionalSpaces] = useState([])

  // Requirements
  const [requirements, setRequirements] = useState([])
  const [newReq, setNewReq] = useState('')

  // Location autocomplete
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [errors, setErrors] = useState({})

  const filteredLocations = MUMBAI_LOCATIONS.filter(l =>
    l.toLowerCase().includes(formData.location.toLowerCase()) && formData.location.length > 0
  )

  // ── Room selection helpers
  const toggleRoom = (value) => {
    setSelectedRooms(prev => {
      if (prev[value] !== undefined) {
        const next = { ...prev }
        delete next[value]
        return next
      }
      return { ...prev, [value]: 1 }
    })
  }

  const setRoomCount = (value, count) => {
    setSelectedRooms(prev => ({ ...prev, [value]: count }))
  }

  const toggleAdditional = (value) => {
    setAdditionalSpaces(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const addRequirement = () => {
    if (newReq.trim() && requirements.length < 10) {
      setRequirements([...requirements, newReq.trim()])
      setNewReq('')
    }
  }

  const removeRequirement = (idx) => setRequirements(requirements.filter((_, i) => i !== idx))

  // ── Validation
  const validate = () => {
    const errs = {}
    if (!formData.location.trim()) errs.location = 'Location is required'
    if (!formData.areaSqFt || isNaN(formData.areaSqFt)) errs.areaSqFt = 'Enter a valid area'
    if (parseFloat(formData.areaSqFt) < 50) errs.areaSqFt = 'Minimum area is 50 sq ft'
    if (Object.keys(selectedRooms).length === 0) errs.rooms = 'Select at least one room type'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Build a readable room summary for the AI
    const roomSummary = Object.entries(selectedRooms)
      .map(([type, count]) => {
        const rt = ROOM_TYPES.find(r => r.value === type)
        return count > 1 ? `${count} ${rt?.label}s` : rt?.label
      })
      .join(', ')

    const additionalList = additionalSpaces
      .map(v => ADDITIONAL_SPACES.find(a => a.value === v)?.label)
      .filter(Boolean)

    const primaryRoom = Object.keys(selectedRooms)[0] || 'bedroom'

    onSubmit({
      ...formData,
      roomType: primaryRoom,
      roomConfiguration: roomSummary,
      selectedRooms: JSON.stringify(selectedRooms),
      additionalSpaces: JSON.stringify(additionalSpaces),
      requirements: [
        ...requirements,
        ...(roomSummary ? [`Room configuration: ${roomSummary}`] : []),
        ...(additionalList.length ? [`Additional spaces: ${additionalList.join(', ')}`] : []),
      ],
    })
  }

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-7" id="design-form">

      {/* ── Location ─────────────────────────────────── */}
      <div className="space-y-2" style={{ position: 'relative', zIndex: showLocationSuggestions ? 50 : 'auto' }}>
        <label className="section-label">📍 Location *</label>
        <input
          id="location-input"
          type="text"
          value={formData.location}
          onChange={(e) => {
            set('location')(e)
            setShowLocationSuggestions(e.target.value.length > 0)
          }}
          onFocus={() => setShowLocationSuggestions(formData.location.length > 0)}
          onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 150)}
          placeholder="e.g. Airoli, Navi Mumbai"
          className={`input-field ${errors.location ? 'border-red-500/50' : ''}`}
          autoComplete="off"
        />
        {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}

        {showLocationSuggestions && filteredLocations.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999,
            marginTop: '6px', backgroundColor: '#1a1a2a',
            border: '1px solid rgba(200,134,10,0.35)', borderRadius: '14px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden',
            maxHeight: '220px', overflowY: 'auto',
          }}>
            {filteredLocations.map(loc => (
              <button
                key={loc} type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => { setFormData(p => ({ ...p, location: loc })); setShowLocationSuggestions(false) }}
                className="w-full text-left px-4 py-3 text-sm text-white/85 hover:text-white flex items-center gap-2.5 border-b border-white/5 last:border-0 transition-colors"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(200,134,10,0.12)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="text-saffron-400 flex-shrink-0">📍</span>
                <span>{loc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Room Configuration ───────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="section-label">🏠 Room Configuration *</label>
          <span className="text-xs text-white/30">Select multiple · adjust counts</span>
        </div>

        {errors.rooms && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            ⚠️ {errors.rooms}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          {ROOM_TYPES.map(rt => {
            const isSelected = selectedRooms[rt.value] !== undefined
            const count = selectedRooms[rt.value] || 1
            return (
              <div
                key={rt.value}
                className={`rounded-xl border transition-all duration-200
                  ${isSelected
                    ? 'border-saffron-500/50 bg-saffron-500/10'
                    : 'border-white/10 bg-white/3 hover:bg-white/6 hover:border-white/20'
                  }`}
              >
                {/* Toggle row */}
                <button
                  type="button"
                  id={`room-${rt.value}`}
                  onClick={() => toggleRoom(rt.value)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
                >
                  {/* Checkbox indicator */}
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all
                    ${isSelected
                      ? 'bg-saffron-500 border-saffron-400'
                      : 'border-white/25 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-charcoal-950" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base">{rt.icon}</span>
                  <span className={`text-sm font-medium flex-1 ${isSelected ? 'text-saffron-200' : 'text-white/60'}`}>
                    {rt.label}
                  </span>
                </button>

                {/* Counter row (only when selected and countable) */}
                {isSelected && rt.countable && (
                  <div className="px-3 pb-2.5 flex items-center justify-between border-t border-saffron-500/15 pt-2">
                    <span className="text-xs text-white/40">How many?</span>
                    <Counter
                      value={count}
                      min={1}
                      max={rt.max}
                      onChange={(v) => setRoomCount(rt.value, v)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Selected summary pill */}
        {Object.keys(selectedRooms).length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Object.entries(selectedRooms).map(([type, count]) => {
              const rt = ROOM_TYPES.find(r => r.value === type)
              return (
                <span key={type} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-saffron-500/15 text-saffron-300 border border-saffron-500/20">
                  {rt?.icon} {count > 1 ? `${count}× ` : ''}{rt?.label}
                  <button
                    type="button"
                    onClick={() => toggleRoom(type)}
                    className="ml-0.5 text-saffron-400/60 hover:text-red-400 transition-colors leading-none"
                  >×</button>
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Additional Spaces ────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="section-label">🌿 Additional Spaces</label>
          <span className="text-xs text-white/30">Toggle what you want</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ADDITIONAL_SPACES.map(space => {
            const isOn = additionalSpaces.includes(space.value)
            return (
              <button
                key={space.value}
                type="button"
                id={`space-${space.value}`}
                onClick={() => toggleAdditional(space.value)}
                className={`flex items-start gap-2.5 px-3 py-3 rounded-xl border text-left transition-all duration-200
                  ${isOn
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-white/10 bg-white/3 hover:bg-white/6 hover:border-white/20'
                  }`}
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                  ${isOn ? 'bg-emerald-500 border-emerald-400' : 'border-white/25'}`}
                >
                  {isOn && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{space.icon}</span>
                    <span className={`text-xs font-semibold ${isOn ? 'text-emerald-300' : 'text-white/65'}`}>
                      {space.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{space.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Room Dimensions ──────────────────────────── */}
      <div className="space-y-2">
        <label className="section-label">📐 Total Floor Area</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="text-xs text-white/40 mb-1 block">Area (sq ft) *</label>
            <input
              id="area-input" type="number" value={formData.areaSqFt}
              onChange={set('areaSqFt')} placeholder="800" min="50" max="10000"
              className={`input-field ${errors.areaSqFt ? 'border-red-500/50' : ''}`}
            />
            {errors.areaSqFt && <p className="text-red-400 text-xs mt-1">{errors.areaSqFt}</p>}
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Length (ft)</label>
            <input id="length-input" type="number" value={formData.length} onChange={set('length')} placeholder="32" className="input-field" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Width (ft)</label>
            <input id="width-input" type="number" value={formData.width} onChange={set('width')} placeholder="25" className="input-field" />
          </div>
        </div>
      </div>

      {/* ── Occupants & Budget ───────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="section-label">👥 Occupants</label>
          <select id="occupants-select" value={formData.occupants} onChange={set('occupants')} className="input-field">
            {[1,2,3,4,5,6,7,8].map(n => (
              <option key={n} value={n} className="bg-charcoal-800">{n} {n === 1 ? 'Person' : 'People'}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="section-label">💰 Budget</label>
          <select id="budget-select" value={formData.budget} onChange={set('budget')} className="input-field">
            {BUDGETS.map(b => (
              <option key={b.value} value={b.value} className="bg-charcoal-800">{b.label} — {b.desc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Design Style ─────────────────────────────── */}
      <div className="space-y-2">
        <label className="section-label">🎨 Design Style</label>
        <div className="grid grid-cols-3 gap-2">
          {DESIGN_STYLES.map(ds => (
            <button
              key={ds.value} type="button" id={`style-${ds.value}`}
              onClick={() => setFormData(p => ({ ...p, designStyle: ds.value }))}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border
                ${formData.designStyle === ds.value
                  ? 'bg-saffron-500/15 border-saffron-500/50 text-saffron-300'
                  : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/75 hover:bg-white/5'
                }`}
            >
              <span>{ds.icon}</span>
              <span>{ds.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Special Requirements ─────────────────────── */}
      <div className="space-y-2">
        <label className="section-label">📝 Special Requirements</label>
        <div className="flex gap-2">
          <input
            id="requirement-input" type="text" value={newReq}
            onChange={e => setNewReq(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRequirement() } }}
            placeholder='e.g. "Wheelchair accessible" or "Vastu strictly north-facing"'
            className="input-field flex-1"
          />
          <button
            type="button" onClick={addRequirement} disabled={!newReq.trim()}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm font-medium transition-all disabled:opacity-40 border border-white/10 flex-shrink-0"
          >Add</button>
        </div>
        {requirements.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {requirements.map((req, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/10 text-sm text-white/70">
                {req}
                <button type="button" onClick={() => removeRequirement(i)} className="text-white/30 hover:text-red-400 transition-colors ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Submit ───────────────────────────────────── */}
      <button
        id="generate-design-btn" type="submit" disabled={isLoading}
        className="w-full btn-primary justify-center py-4 text-base"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-charcoal-950/50 border-t-charcoal-950 rounded-full animate-spin" />
            <span>Generating Design...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>Generate Vastu-Aware Design</span>
          </>
        )}
      </button>
    </form>
  )
}
