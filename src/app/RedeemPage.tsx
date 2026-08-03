import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { KeyRound, Loader2, Mail, Ticket, User } from 'lucide-react'
import { docsApi } from '@/lib/docsApi'
import { setSession } from '@/lib/docsAuth'
import { clearRestrictedCache } from '@/lib/restricted'
import { usePageMeta } from '@/lib/seo'
import { isLang, DEFAULT_LANG, type Lang } from '@/i18n'

export function RedeemPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const [searchParams] = useSearchParams()
  const lang: Lang = isLang(langParam) ? langParam : DEFAULT_LANG
  const next = searchParams.get('next') || `/${lang}/developers`

  const [name, setName] = useState('')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  usePageMeta({
    title: `${t('redeemTitle')} | SokoPlus Docs`,
    description: t('redeemDescription'),
    lang,
    canonicalPath: `/${lang}/redeem`,
  })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await docsApi.redeem(name.trim(), email.trim(), token.trim())
      setSession({
        token: res.token,
        role: 'admin',
        name: res.name,
        email: res.email,
      })
      clearRestrictedCache()
      navigate(next, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('redeemFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="glass-card p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Ticket className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black tracking-tight">{t('redeemTitle')}</h1>
            <p className="text-sm text-on-surface-variant">{t('redeemSubtitle')}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="redeem-name" className="mb-1 block text-sm font-semibold">
              {t('fullName')}
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-muted" />
              <input
                id="redeem-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface-dim py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label htmlFor="redeem-email" className="mb-1 block text-sm font-semibold">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-muted" />
              <input
                id="redeem-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface-dim py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label htmlFor="redeem-token" className="mb-1 block text-sm font-semibold">
              {t('token')}
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-muted" />
              <input
                id="redeem-token"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="••••••••••••••••••••••••••••"
                className="w-full rounded-lg border border-line bg-surface-dim py-2.5 pl-9 pr-3 font-mono text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm font-semibold text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ticket className="h-4 w-4" />}
            {busy ? t('redeeming') : t('redeem')}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        {t('superadminPrompt')}{' '}
        <Link
          to={`/login?lang=${lang}&next=${encodeURIComponent(next)}`}
          className="font-semibold text-brand underline underline-offset-2"
        >
          {t('loginInstead')}
        </Link>
      </p>
    </div>
  )
}
