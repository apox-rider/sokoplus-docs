import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MDXProvider } from '@mdx-js/react'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { getArticle, getPrevNext } from '@/lib/content'
import { mdxComponents } from '@/components/mdx'
import { usePageMeta } from '@/lib/seo'
import { isLang, DEFAULT_LANG, type Lang } from '@/i18n'
import type { Section } from '@/lib/content'

export function ArticlePage({ section }: { section: Section }) {
  const { lang: langParam, slug } = useParams<{ lang?: string; slug: string }>()
  const lang: Lang = isLang(langParam) ? langParam : DEFAULT_LANG
  const { t } = useTranslation(['common', section === 'help' ? 'help' : 'developers'])

  const article = getArticle(section, lang, slug ?? '')
  const { prev, next } = getPrevNext(section, lang, slug ?? '')

  usePageMeta({
    title: article ? `${article.title} | SokoPlus Docs` : 'Not found | SokoPlus Docs',
    description: article?.description,
    lang,
    canonicalPath: `/${lang}/${section}/${slug}`,
    alternatePaths: [
      { lang: 'en', path: `/en/${section}/${slug}` },
      { lang: 'sw', path: `/sw/${section}/${slug}` },
    ],
  })

  if (!article) {
    return <Navigate to={`/${lang}/${section}`} replace />
  }

  const Article = article.Component

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8">
        <Link
          to={`/${lang}/${section}`}
          className="text-sm font-semibold text-on-surface-variant hover:text-brand"
        >
          ← {section === 'help' ? t('help:title') : t('developers:title')}
        </Link>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{article.title}</h1>
        {article.description && (
          <p className="mt-3 text-base text-on-surface-variant sm:text-lg">{article.description}</p>
        )}
        {article.updated && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-on-surface-muted">
            <Calendar className="h-4 w-4" />
            {t('common:updatedOn')} {article.updated}
          </p>
        )}
      </header>

      <MDXProvider components={mdxComponents}>
        <div className="doc-prose">
          <Article />
        </div>
      </MDXProvider>

      <nav className="mt-12 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/${lang}/${section}/${prev.slug}`}
            className="glass-card glass-card-hover flex items-center gap-3 p-4"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-on-surface-muted" />
            <span>
              <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-muted">
                {t('common:prev')}
              </span>
              <span className="mt-0.5 block font-bold">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/${lang}/${section}/${next.slug}`}
            className="glass-card glass-card-hover flex items-center justify-end gap-3 p-4 text-right"
          >
            <span>
              <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-muted">
                {t('common:next')}
              </span>
              <span className="mt-0.5 block font-bold">{next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-on-surface-muted" />
          </Link>
        )}
      </nav>
    </article>
  )
}
