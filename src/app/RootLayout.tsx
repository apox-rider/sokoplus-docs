import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { isLang, initI18n, DEFAULT_LANG } from '@/i18n'
import { TopBar } from '@/components/ui/TopBar'
import { Footer } from '@/components/ui/Footer'

export function RootLayout() {
  const { lang } = useParams<{ lang?: string }>()
  const current = isLang(lang) ? lang : DEFAULT_LANG

  useEffect(() => {
    initI18n(current)
  }, [current])

  if (lang && !isLang(lang)) {
    return <Navigate to={`/${DEFAULT_LANG}`} replace />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar lang={current} />
      <main id="main" className="flex-1">
        <Outlet context={{ lang: current }} />
      </main>
      <Footer lang={current} />
    </div>
  )
}
