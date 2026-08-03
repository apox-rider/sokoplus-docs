import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const CONTENT_DIR = fileURLToPath(new URL('../src/content/', import.meta.url))
const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url))

const LANGS = ['en', 'sw']

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (extname(entry.name) === '.mdx') out.push(full)
  }
  return out
}

function toPlainText(mdx) {
  return mdx
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/[`\n]/g, ' '))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function docsStaticPlugin() {
  return {
    name: 'sokoplus-docs-static',
    closeBundle() {
      const files = walk(CONTENT_DIR)
      const index = { en: [], sw: [] }

      for (const file of files) {
        const rel = relative(CONTENT_DIR, file)
        const [lang, section, slug] = rel.split('/')
        if (!LANGS.includes(lang)) continue
        const source = readFileSync(file, 'utf8')
        const { data, content } = matter(source)
        index[lang].push({
          id: `${lang}-${section}-${slug}`,
          lang,
          section,
          slug: slug.replace(/\.mdx$/, ''),
          title: data.title || slug,
          description: data.description || '',
          group: data.group || '',
          order: typeof data.order === 'number' ? data.order : 999,
          text: toPlainText(content),
        })
      }

      mkdirSync(PUBLIC_DIR, { recursive: true })
      for (const lang of LANGS) {
        writeFileSync(join(PUBLIC_DIR, `search-index.${lang}.json`), JSON.stringify(index[lang]))
      }

      const baseUrl = 'https://docs.sokopluss.co.tz'
      const urls = ['', '/en', '/sw']
      for (const lang of LANGS) {
        for (const item of index[lang]) {
          urls.push(`/${lang}/${item.section}/${item.slug}`)
        }
      }
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
        .map(
          (u) =>
            `  <url><loc>${baseUrl}${u}</loc><changefreq>weekly</changefreq><priority>${u === '' || u === '/en' ? '1.0' : '0.7'}</priority></url>`,
        )
        .join('\n')}\n</urlset>\n`
      writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemap)
    },
  }
}
