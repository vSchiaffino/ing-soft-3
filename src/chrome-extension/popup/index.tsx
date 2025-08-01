import { useEffect, useRef, useState } from 'react'
import '../global.css'
import { openAiService } from '../services/openAi.service'
import { Message } from '../interfaces/message.interface'
import { useMessagesFromChromeLocal } from '../hooks/useMessagesFromChromeLocal'
import { scrapperService } from '../services/scrapper.service'

export const Popup = () => {
  const [messages, setMessages] = useMessagesFromChromeLocal()
  const [input, setInput] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && input.trim() !== '') {
      const pageData = await scrapperService.extractActualPageData()
      console.log('extracted page data', pageData)
      const systemMessage: Message = {
        from: 'system',
        text: `
Eres un agente de ecommerce. Responde a las preguntas de los usuarios sobre productos, precios, envíos y devoluciones.
No hables de ti mismo ni de la tienda, solo responde a las preguntas.
La información de la pagina que se está viendo es la siguiente:
${JSON.stringify(pageData)}
`,
      }
      const userMessage: Message = { from: 'user', text: input }
      const text = await openAiService.createChatCompletion([
        systemMessage,
        ...messages,
        userMessage,
      ])
      if (!text) return
      const botMessage: Message = {
        from: 'assistant',
        text,
      }
      setMessages((prev) => [...prev, userMessage, botMessage])

      setInput('')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className='flex flex-col p-4 bg-white h-full'>
      <div className='flex items-center mb-2'>
        <button
          className='mr-2 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition'
          onClick={() => setMessages([])}
          title='Limpiar mensajes'
        >
          🗑️
        </button>
        <div className='text-2xl font-bold'>Ecommerce Agent</div>
      </div>

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
