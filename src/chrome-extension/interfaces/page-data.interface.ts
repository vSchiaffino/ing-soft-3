export interface Page {
  isEcommercePage: boolean
  ecommercePage: 'mercadolibre' | null
  data: PageData | null
}

export interface PageData {
  title: string
}
