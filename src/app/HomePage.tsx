import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  BookOpen,
  Code2,
  Globe2,
  Languages,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { getArticles } from '@/lib/content'
import { usePageMeta } from '@/lib/seo'
import { isLang, DEFAULT_LANG, type Lang } from '@/i18n'

export function HomePage() {
  const { lang: langParam } = useParams()
  const lang: Lang = isLang(langParam) ? langParam : DEFAULT_LANG
  const { t } = useTranslation(['landing', 'common', 'nav'])
  const helpNs = useTranslation('help')
  const devNs = useTranslation('developers')

  usePageMeta({
    title: 'SokoPlus Docs & Help Centre',
    description: t('landing:subtitle'),
    lang,
    canonicalPath: `/${lang}`,
    alternatePaths: [
      { lang: 'en', path: '/en' },
      { lang: 'sw', path: '/sw' },
    ],
  })

  const helpArticles = getArticles({ section: 'help', lang }).slice(0, 4)
  const devArticles = getArticles({ section: 'developers', lang }).slice(0, 3)

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-shop-accent/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          {/* <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            {t('landing:badge')}
          </span> */}
          <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-6xl">
            {t('landing:title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
            {t('landing:subtitle')}
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to={`/${lang}/help`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
            >
              {t('landing:ctaHelp')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={`/${lang}/developers`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong px-6 py-3 text-base font-semibold text-on-surface transition-colors hover:border-brand hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
            >
              <Code2 className="h-4 w-4" />
              {t('landing:ctaDevelopers')}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="glass-card px-2 py-4 sm:px-4 sm:py-5">
              <MapPin className="mx-auto mb-2 h-5 w-5 text-brand" />
              <p className="text-xl font-black sm:text-2xl">31</p>
              <p className="text-xs text-on-surface-variant sm:text-sm">{t('landing:stats.regions')}</p>
            </div>
            <div className="glass-card px-2 py-4 sm:px-4 sm:py-5">
              <Languages className="mx-auto mb-2 h-5 w-5 text-brand" />
              <p className="text-xl font-black sm:text-2xl">2</p>
              <p className="text-xs text-on-surface-variant sm:text-sm">{t('landing:stats.languages')}</p>
            </div>
            <div className="glass-card px-2 py-4 sm:px-4 sm:py-5">
              <Globe2 className="mx-auto mb-2 h-5 w-5 text-brand" />
              <p className="text-xl font-black sm:text-2xl">100%</p>
              <p className="text-xs text-on-surface-variant sm:text-sm">{t('landing:stats.openSource')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="grid gap-6 pb-4 md:grid-cols-2">
        <Link
          to={`/${lang}/help`}
          className="glass-card glass-card-hover group p-8"
        >
          <BookOpen className="mb-4 h-8 w-8 text-brand" />
          <h2 className="text-2xl font-black">{t('landing:sections.help.title')}</h2>
          <p className="mt-2 text-on-surface-variant">
            {t('landing:sections.help.description')}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">
            {t('landing:ctaHelp')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
        <Link
          to={`/${lang}/developers`}
          className="glass-card glass-card-hover group p-8"
        >
          <Code2 className="mb-4 h-8 w-8 text-shop-accent" />
          <h2 className="text-2xl font-black">{t('landing:sections.developers.title')}</h2>
          <p className="mt-2 text-on-surface-variant">
            {t('landing:sections.developers.description')}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-shop-accent">
            {t('landing:ctaDevelopers')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      {/* Popular topics */}
      <section className="py-12">
        <h2 className="text-3xl font-black">{t('landing:popular')}</h2>
        <p className="mt-2 text-on-surface-variant">{t('landing:popularSubtitle')}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {helpArticles.map((a) => (
            <Link
              key={a.id}
              to={`/${lang}/help/${a.slug}`}
              className="glass-card glass-card-hover p-5"
            >
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-on-surface-muted">
                {helpNs.t(`groups.${a.group}`, { ns: 'help' })}
              </p>
              <h3 className="mt-2 font-bold leading-snug">{a.title}</h3>
              {a.description && (
                <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">
                  {a.description}
                </p>
              )}
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {devArticles.map((a) => (
            <Link
              key={a.id}
              to={`/${lang}/developers/${a.slug}`}
              className="glass-card glass-card-hover p-5"
            >
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-on-surface-muted">
                {devNs.t(`groups.${a.group}`, { ns: 'developers' })}
              </p>
              <h3 className="mt-2 font-bold leading-snug">{a.title}</h3>
              {a.description && (
                <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">
                  {a.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="pb-20">
        <div className="glass-card p-10 text-center">
          <h2 className="text-2xl font-black md:text-3xl">
            {t('landing:mission.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-on-surface-variant">
            {t('landing:mission.text')}
          </p>
        </div>
      </section>
    </div>
  )
}
