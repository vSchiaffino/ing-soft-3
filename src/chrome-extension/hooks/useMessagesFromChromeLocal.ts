import { useEffect, useState } from 'react'
import { Message } from '../interfaces/message.interface'

export function useMessagesFromChromeLocal(): [
  Message[],
  React.Dispatch<React.SetStateAction<Message[]>>
] {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get('messages', (result) => {
        if (result.messages) {
          setMessages(result.messages)
        }
      })
    }
  }, [])

  useEffect(() => {
    if (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ messages })
    }
  }, [messages])
  return [messages, setMessages]
}
