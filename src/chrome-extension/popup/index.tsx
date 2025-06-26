import { useEffect, useRef, useState } from 'react'
import '../global.css'

type Message = {
  from: 'user' | 'bot'
  text: string
}

export const Popup = () => {
  useEffect(() => {
    chrome.storage.local.get('messages', (result) => {
      if (result.messages) {
        setMessages(result.messages)
      }
    })
  }, [])

  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    chrome.storage.local.set({ messages })
  }, [messages])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && input.trim() !== '') {
      const userMessage: Message = { from: 'user', text: input }
      const botMessage: Message = { from: 'bot', text: `Respuesta a: ${input}` }
      setMessages((prev) => [...prev, userMessage, botMessage])
      setInput('')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className='flex flex-col p-4 bg-white h-full'>
      <div className='text-2xl font-bold mb-2'>Ecommerce Agent</div>

      <div className='flex flex-col flex-1 min-h-0 overflow-y-auto gap-2 border p-4 rounded-lg bg-gray-50 mb-2'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-xs ${
              message.from === 'user'
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-200 self-start text-left'
            }`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        className='border-2 border-gray-300 rounded-lg p-2'
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Escribí un mensaje...'
      />
    </div>
  )
}
