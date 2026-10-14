import { useState, useRef } from 'react'

const QUICK_PROMPTS = [
  'Make it more traditional Indian',
  'Add a study table',
  'Change wall color to beige',
  'More natural light',
  'Minimize furniture',
  'Add indoor plants',
]

export const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setMessage('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e) => {
    setMessage(e.target.value)
    // Auto-resize
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt)
    textareaRef.current?.focus()
  }

  return (
    <div className="border-t border-white/5 bg-charcoal-900/50 backdrop-blur-sm p-4 space-y-3">
      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => handleQuickPrompt(p)}
            disabled={disabled}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8 hover:border-white/20 transition-all disabled:opacity-40"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="flex items-end gap-3">
        <div className="flex-1 glass-card flex items-end gap-2 px-4 py-2.5 min-h-[48px]">
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask to refine your design... (e.g. 'Make the room more modern')"
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent resize-none text-white text-sm placeholder-white/25 focus:outline-none py-0.5 max-h-[120px]"
            style={{ minHeight: '24px' }}
          />
        </div>
        <button
          id="chat-send-btn"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center flex-shrink-0
                     hover:from-saffron-400 hover:to-saffron-500 active:scale-95 transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {disabled ? (
            <div className="w-4 h-4 border-2 border-charcoal-950/50 border-t-charcoal-950 rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-charcoal-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-[10px] text-white/20 text-center">Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
