import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SITE_URL = 'https://sokopluss.co.tz'

export function FloatingVisitButton() {
  const { t } = useTranslation('nav')

  return (
    <a
      href={SITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-visit-btn group fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
    >
      {t('visitSite')}
      <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  )
}
