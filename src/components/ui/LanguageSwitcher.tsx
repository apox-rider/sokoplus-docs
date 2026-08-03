import { Link, useLocation } from 'react-router-dom'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import type { Lang } from '@/i18n'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'sw', label: 'SW' },
]

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation()
  const { pathname } = useLocation()
  const current = i18n.language

  const toPath = (code: Lang) => {
    const rest = pathname.replace(/^\/(en|sw)/, '')
    return `/${code}${rest}`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-lg border border-line bg-surface-dim p-1',
        className,
      )}
      aria-label="Language"
    >
      <Languages className="ml-1 h-4 w-4 text-on-surface-muted" />
      {LANGS.map((l) => (
        <Link
          key={l.code}
          to={toPath(l.code)}
          aria-current={current.startsWith(l.code) ? 'page' : undefined}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-bold transition-colors',
            current.startsWith(l.code)
              ? 'bg-btn text-white'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
        >
          {l.label}
        </Link>
      ))}
    </div>
  )
}
