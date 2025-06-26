export interface Message {
  from: 'user' | 'assistant' | 'system'
  text: string
}
