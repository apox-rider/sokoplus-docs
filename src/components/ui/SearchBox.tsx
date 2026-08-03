import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '@/lib/search'
import { cn } from '@/lib/cn'
import type { Lang } from '@/i18n'

export function SearchBox({ lang, className }: { lang: Lang; className?: string }) {
  const { t } = useTranslation('common')
  const { fuse, loaded } = useSearch(lang)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length >= 2 && fuse ? fuse.search(query.trim()).slice(0, 8) : []

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={rootRef} className={cn('relative w-full max-w-md', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-lg border border-line bg-surface-dim py-2 pl-9 pr-9 text-sm text-on-surface placeholder:text-on-surface-muted focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setOpen(false)
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-on-surface-muted hover:text-on-surface"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && (query.trim().length >= 2 || !loaded) && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
          {!loaded ? (
            <p className="px-4 py-3 text-sm text-on-surface-muted">{t('loading')}</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-on-surface-muted">{t('searchNoResults')}</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((r) => (
                <li key={r.item.id}>
                  <Link
                    to={`/${lang}/${r.item.section}/${r.item.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 transition-colors hover:bg-brand-soft"
                  >
                    <span className="block text-sm font-semibold text-on-surface">
                      {r.item.title}
                    </span>
                    {r.item.description && (
                      <span className="line-clamp-1 block text-xs text-on-surface-variant">
                        {r.item.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
