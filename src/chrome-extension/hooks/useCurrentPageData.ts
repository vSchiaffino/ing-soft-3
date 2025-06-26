import { useEffect, useState } from 'react'
import { Page } from '../interfaces/page-data.interface'
import { scrapperService } from '../services/scrapper.service'

export function useCurrentPageData(): Page {
  const [page, setPage] = useState<Page>({
    data: null,
    isEcommercePage: false,
    ecommercePage: null,
  })
  useEffect(() => {
    if (
      typeof chrome !== 'undefined' &&
      chrome.runtime &&
      chrome.runtime.onMessage
    ) {
      chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'PAGE_TEXT') {
          console.log('contenido pagina', message.page)
          setPage(message.page)
        }
      })
    }
  }, [])
  chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => {
          chrome.runtime.sendMessage({
            type: 'PAGE_TEXT',
            page: scrapperService.extractDataFromDocument(document),
          })
        },
      })
    }
  })
  return page
}
