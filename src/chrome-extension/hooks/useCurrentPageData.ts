import { useEffect, useState } from 'react'
import { Page } from '../interfaces/page-data.interface'

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
          const h1 = document.querySelector('h1.ui-pdp-title')
          const isEcommercePage =
            window.location.href.includes('mercadolibre.com')
          const page = {
            data: {
              title: h1?.innerHTML || '',
            },
            ecommercePage: isEcommercePage ? 'mercadolibre' : null,
            isEcommercePage,
          }
          chrome.runtime.sendMessage({ type: 'PAGE_TEXT', page })
        },
      })
    }
  })
  return page
}
