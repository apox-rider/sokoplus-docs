import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { Sidebar } from '@/components/ui/Sidebar'
import { isLang, DEFAULT_LANG, type Lang } from '@/i18n'
import type { Section } from '@/lib/content'

export function DocsLayout({ section }: { section: Section }) {
  const { lang: langParam } = useParams()
  const lang: Lang = isLang(langParam) ? langParam : DEFAULT_LANG
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useTranslation(section === 'help' ? 'help' : 'developers')

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 md:flex-row md:gap-8 lg:px-8">
      {/* Mobile toggle */}
      <div className="flex md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-on-surface-variant sm:w-auto sm:justify-start"
        >
          <Menu className="h-4 w-4" />
          {t('title')}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <Sidebar section={section} lang={lang} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto border-r border-line bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold">{t('title')}</p>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-on-surface-variant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Sidebar section={section} lang={lang} onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
