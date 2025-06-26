import { OpenAI } from 'openai'
import { Message } from '../interfaces/message.interface'

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: 'YOUR_OPENAI_API_KEY',
})

export default class OpenAiService {
  async createChatCompletion(messages: Message[]) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
      ].concat(
        messages.map((msg) => ({
          role: msg.from,
          content: msg.text,
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any[],
    })

    return response.choices[0].message.content
  }
}

export const openAiService = new OpenAiService()
