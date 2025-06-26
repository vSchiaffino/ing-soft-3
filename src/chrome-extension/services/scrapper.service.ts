import { Page } from '../interfaces/page-data.interface'

export default class ScrapperService {
  extractDataFromDocument(document: Document): Page {
    const h1 = document.querySelector('h1.ui-pdp-title')
    const isEcommercePage = window.location.href.includes('mercadolibre.com')
    const page: Page = {
      data: {
        title: h1?.innerHTML || '',
      },
      ecommercePage: isEcommercePage ? 'mercadolibre' : null,
      isEcommercePage,
    }
    return page
  }

  extractActualPageData(): Promise<Page> {
    return new Promise<Page>((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0]
        if (!tab?.id) return reject(new Error('No active tab found'))

        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              const h1 = document.querySelector('h1.ui-pdp-title')
              const isEcommercePage =
                window.location.href.includes('mercadolibre.com')
              return {
                data: {
                  title: h1?.innerHTML || '',
                },
                ecommercePage: isEcommercePage ? 'mercadolibre' : null,
                isEcommercePage,
              }
            },
          },
          (results) => {
            console.log('resulteds', results)
            if (chrome.runtime.lastError) {
              return reject(new Error(chrome.runtime.lastError.message))
            }
            if (results && results[0] && results[0].result) {
              resolve(results[0].result as Page)
            } else {
              reject(new Error('No result from content script'))
            }
          }
        )
      })
    })
  }
}

export const scrapperService = new ScrapperService()
