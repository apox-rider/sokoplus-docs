import { docsApi, type ArticleMeta } from '@/lib/docsApi'

// Slugs served from the backend (database) instead of the static bundle.
// They are never part of the public build — see prisma/seedDocsContent.js.
export const RESTRICTED_SLUGS: ReadonlySet<string> = new Set([
  'api-admin',
  'deployment',
  'environment-variables',
  'roles-permissions',
])

export function isRestricted(slug: string | undefined): boolean {
  return Boolean(slug && RESTRICTED_SLUGS.has(slug))
}

const cache = new Map<string, ArticleMeta[]>()

export async function getRestrictedArticles(lang: string): Promise<ArticleMeta[]> {
  const hit = cache.get(lang)
  if (hit) return hit
  const { articles } = await docsApi.listArticles()
  const filtered = articles.filter((a) => a.lang === lang).sort((a, b) => a.sortOrder - b.sortOrder)
  cache.set(lang, filtered)
  return filtered
}

export function clearRestrictedCache() {
  cache.clear()
}
