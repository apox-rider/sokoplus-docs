import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Code2,
  Globe2,
  MapPin,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { getArticles } from '@/lib/content'
import { getSectionIcon } from '@/lib/sectionIcons'
import { usePageMeta } from '@/lib/seo'
import { isLang, DEFAULT_LANG, type Lang } from '@/i18n'
import type { Article, Section } from '@/lib/content'

function TopicCard({
  article,
  section,
  lang,
}: {
  article: Article
  section: Section
  lang: Lang
}) {
  const { t } = useTranslation(section === 'help' ? 'help' : 'developers')
  const Icon: LucideIcon = getSectionIcon(section, article.group)
  return (
    <Link
      to={`/${lang}/${section}/${article.slug}`}
      className="glass-card glass-card-hover group flex flex-col gap-3 p-5"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-on-surface-muted">
        {t(`groups.${article.group}`)}
      </span>
      <span className="font-bold leading-snug">{article.title}</span>
      {article.description && (
        <span className="line-clamp-2 text-sm text-on-surface-variant">{article.description}</span>
      )}
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
        {t('readMore', { ns: 'common' })}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

export function HomePage() {
  const { lang: langParam } = useParams()
  const lang: Lang = isLang(langParam) ? langParam : DEFAULT_LANG
  const { t } = useTranslation(['landing', 'common', 'nav'])

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
  const devArticles = getArticles({ section: 'developers', lang }).slice(0, 4)

  return (
    <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-14 md:pb-24 md:pt-24">
        <div className="hero-grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-1/2 top-[-4rem] h-80 w-80 -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
          <div className="absolute bottom-0 left-8 h-56 w-56 rounded-full bg-shop-accent/15 blur-3xl" />
          <div className="absolute -right-10 top-24 h-64 w-64 rounded-full bg-btn/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            {t('landing:badge')}
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {t('landing:title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
            {t('landing:subtitle')}
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              to={`/${lang}/help`}
              className="btn-brand px-7 py-3 text-base focus-visible:ring-2 focus-visible:ring-btn/40 focus-visible:outline-none"
            >
              {t('landing:ctaHelp')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={`/${lang}/developers`}
              className="btn-outline px-7 py-3 text-base focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
            >
              <Code2 className="h-4 w-4" />
              {t('landing:ctaDevelopers')}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="glass-card px-2 py-4 sm:px-4 sm:py-5">
              <MapPin className="mx-auto mb-2 h-5 w-5 text-brand" />
              <p className="text-xl font-black sm:text-2xl">31</p>
              <p className="text-xs text-on-surface-variant sm:text-sm">
                {t('landing:stats.regions')}
              </p>
            </div>
            <div className="glass-card px-2 py-4 sm:px-4 sm:py-5">
              <Globe2 className="mx-auto mb-2 h-5 w-5 text-brand" />
              <p className="text-xl font-black sm:text-2xl">2</p>
              <p className="text-xs text-on-surface-variant sm:text-sm">
                {t('landing:stats.languages')}
              </p>
            </div>
            <div className="glass-card px-2 py-4 sm:px-4 sm:py-5">
              <BadgeCheck className="mx-auto mb-2 h-5 w-5 text-brand" />
              <p className="text-xl font-black sm:text-2xl">28+</p>
              <p className="text-xs text-on-surface-variant sm:text-sm">
                {t('landing:stats.guides')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="grid gap-6 pb-4 md:grid-cols-2">
        <Link
          to={`/${lang}/help`}
          className="glass-card glass-card-hover group relative overflow-hidden p-8"
        >
          <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand/10 blur-2xl transition-opacity group-hover:opacity-100" />
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
          className="glass-card glass-card-hover group relative overflow-hidden p-8"
        >
          <span className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-shop-accent/10 blur-2xl" />
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {helpArticles.map((a) => (
            <TopicCard key={a.id} article={a} section="help" lang={lang} />
          ))}
          {devArticles.map((a) => (
            <TopicCard key={a.id} article={a} section="developers" lang={lang} />
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="pb-20">
        <div className="glass-card relative overflow-hidden p-10 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
          </div>
          <h2 className="relative text-2xl font-black md:text-3xl">{t('landing:mission.title')}</h2>
          <p className="relative mx-auto mt-4 max-w-3xl leading-relaxed text-on-surface-variant">
            {t('landing:mission.text')}
          </p>
        </div>
      </section>
    </div>
  )
}