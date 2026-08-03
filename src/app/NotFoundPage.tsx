import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePageMeta } from '@/lib/seo'

export function NotFoundPage() {
  const { t } = useTranslation('common')

  usePageMeta({ title: 'Not found | SokoPlus Docs' })

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center">
      <p className="text-7xl font-black text-brand">404</p>
      <h1 className="mt-4 text-3xl font-black">{t('notFound.title')}</h1>
      <p className="mt-2 text-on-surface-variant">{t('notFound.message')}</p>
      <Link
        to="/en"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        {t('notFound.backHome')}
      </Link>
    </div>
  )
}
