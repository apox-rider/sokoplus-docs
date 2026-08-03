import { useEffect } from 'react'

const BASE_URL = 'https://docs.sokopluss.co.tz'

export function usePageMeta(opts: {
  title: string
  description?: string
  lang?: string
  canonicalPath?: string
  alternatePaths?: { lang: string; path: string }[]
}) {
  useEffect(() => {
    document.title = opts.title

    function setMeta(attr: 'name' | 'property', key: string, value: string) {
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`,
      )
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    if (opts.description) setMeta('name', 'description', opts.description)

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute(
      'href',
      `${BASE_URL}${opts.canonicalPath ?? '/'}`,
    )

    const alternates = document.head.querySelectorAll('link[rel="alternate"]')
    alternates.forEach((el) => el.remove())
    for (const alt of opts.alternatePaths ?? []) {
      const link = document.createElement('link')
      link.setAttribute('rel', 'alternate')
      link.setAttribute('hreflang', alt.lang)
      link.setAttribute('href', `${BASE_URL}${alt.path}`)
      document.head.appendChild(link)
    }

    document.documentElement.lang = opts.lang ?? 'en'
  }, [
    opts.title,
    opts.description,
    opts.lang,
    opts.canonicalPath,
    opts.alternatePaths,
  ])
}
