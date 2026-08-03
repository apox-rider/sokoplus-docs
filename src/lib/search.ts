import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import type { Lang } from '@/i18n'

export interface SearchItem {
  id: string
  lang: string
  section: string
  slug: string
  title: string
  description: string
  group: string
  order: number
  text: string
}

export function useSearch(lang: Lang) {
  const [items, setItems] = useState<SearchItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoaded(false)
    fetch(`/search-index.${lang}.json`)
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        if (!cancelled) {
          setItems(data)
          setLoaded(true)
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'description', weight: 0.2 },
        { name: 'group', weight: 0.1 },
        { name: 'text', weight: 0.2 },
      ],
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })
  }, [items])

  return { fuse, loaded }
}
