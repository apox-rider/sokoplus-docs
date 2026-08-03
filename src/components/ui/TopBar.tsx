import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GitBranch, LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { SearchBox } from '@/components/ui/SearchBox'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { cn } from '@/lib/cn'
import { useDocsSession, clearSession } from '@/lib/docsAuth'
import { docsApi } from '@/lib/docsApi'
import { clearRestrictedCache } from '@/lib/restricted'
import type { Lang } from '@/i18n'

const GITHUB_URL = 'https://github.com/apox-rider/sokoplus-docs'

export function TopBar({ lang }: { lang: Lang }) {
  const { t } = useTranslation('nav')
  const [open, setOpen] = useState(false)
  const session = useDocsSession()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await docsApi.logout()
    } catch {
      // best effort — clear locally regardless
    }
    clearSession()
    clearRestrictedCache()
    navigate(`/${lang}`, { replace: true })
  }

  const links = [
    { to: `/${lang}`, label: t('home'), end: true },
    { to: `/${lang}/help`, label: t('helpCentre'), end: false },
    { to: `/${lang}/developers`, label: t('developers'), end: false },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 lg:px-8">
        <Link to={`/${lang}`} aria-label="SokoPlus Docs home">
          <Logo />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-brand-soft text-brand'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBox lang={lang} className="hidden lg:block" />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface md:inline-flex"
          >
            <GitBranch className="h-4 w-4" />
          </a>
          <LanguageSwitcher />
          {session ? (
            <>
              {session.role === 'superAdmin' && (
                <NavLink
                  to={`/${lang}/admin/tokens`}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold transition-colors',
                      isActive
                        ? 'border-brand text-brand'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
                    )
                  }
                >
                  <ShieldCheck className="h-4 w-4" />
                  {t('adminTokens')}
                </NavLink>
              )}
              <button
                type="button"
                onClick={() => void handleLogout()}
                aria-label={t('signOut')}
                title={t('signOut')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to={`/${lang}/redeem`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
            >
              {t('signIn')}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-on-surface-variant hover:bg-surface-container md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-surface px-4 py-4 md:hidden">
          <SearchBox lang={lang} className="mb-4" />
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-brand-soft text-brand'
                      : 'text-on-surface-variant hover:bg-surface-container',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            {session ? (
              <>
                {session.role === 'superAdmin' && (
                  <NavLink
                    to={`/${lang}/admin/tokens`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {t('adminTokens')}
                  </NavLink>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    void handleLogout()
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  <LogOut className="h-4 w-4" />
                  {t('signOut')}
                </button>
              </>
            ) : (
              <Link
                to={`/${lang}/redeem`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                {t('signIn')}
              </Link>
            )}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
