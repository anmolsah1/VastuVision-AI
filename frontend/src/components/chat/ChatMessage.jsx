import { useEffect, useRef } from 'react'
import { useDesignContext } from '../../context/DesignContext'

const Message = ({ msg }) => {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">
          🏠
        </div>
      )}
      <div className={isUser ? 'chat-user-bubble' : 'chat-ai-bubble'}>
        {msg.content}
      </div>
    </div>
  )
}

export const ChatMessage = ({ messages }) => {
  const bottomRef = useRef(null)
  const { isRefining } = useDesignContext()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isRefining])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
      {/* Welcome message */}
      <div className="flex justify-start">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">
          🏠
        </div>
        <div className="chat-ai-bubble">
          Your design has been generated! You can ask me to make changes — for example: "Make it more traditional", "Add a study table", or "Change wall color to beige".
        </div>
      </div>

      {messages.map((msg, i) => (
        <Message key={i} msg={msg} />
      ))}

      {/* Thinking indicator */}
      {isRefining && (
        <div className="flex justify-start animate-slide-up">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-sm mr-2 flex-shrink-0">
            🏠
          </div>
          <div className="chat-ai-bubble flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-white/50 text-xs">Refining your design...</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
