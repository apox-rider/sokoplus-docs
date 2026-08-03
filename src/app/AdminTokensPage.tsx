import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Copy, ExternalLink, Loader2, Plus, RefreshCw, Ticket, X } from 'lucide-react'
import { docsApi, type TokenRecord } from '@/lib/docsApi'
import { RequireDocs } from '@/components/ui/AuthGate'
import { usePageMeta } from '@/lib/seo'
import { isLang, DEFAULT_LANG, type Lang } from '@/i18n'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-success/15 text-success',
  used: 'bg-surface-container text-on-surface-variant',
  revoked: 'bg-error/15 text-error',
  expired: 'bg-warning/15 text-warning',
}

export function AdminTokensPage() {
  const { lang: langParam } = useParams<{ lang?: string }>()
  const lang: Lang = isLang(langParam) ? langParam : DEFAULT_LANG
  const { t } = useTranslation('auth')

  const [tokens, setTokens] = useState<TokenRecord[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [ttl, setTtl] = useState(60)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const [issued, setIssued] = useState<{ token: string; email: string; id: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)

  usePageMeta({
    title: `${t('adminTitle')} | SokoPlus Docs`,
    description: t('adminDescription'),
    lang,
    canonicalPath: `/${lang}/admin/tokens`,
  })

  const refresh = useCallback(async () => {
    try {
      const res = await docsApi.listTokens()
      setTokens(res.tokens)
    } catch {
      setTokens([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      const res = await docsApi.createToken(name.trim(), email.trim(), ttl)
      setIssued({ token: res.token, email: res.email, id: res.id })
      setName('')
      setEmail('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('createFailed'))
    } finally {
      setCreating(false)
    }
  }

  async function onRevoke(id: string) {
    setRevoking(id)
    try {
      await docsApi.revokeToken(id)
      await refresh()
    } catch {
      // keep list as-is on failure
    } finally {
      setRevoking(null)
    }
  }

  async function copyLink() {
    if (!issued) return
    const url = `${window.location.origin}/${lang}/redeem?token=${encodeURIComponent(issued.token)}&email=${encodeURIComponent(issued.email)}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function openLink() {
    if (!issued) return
    const url = `${window.location.origin}/${lang}/redeem?token=${encodeURIComponent(issued.token)}&email=${encodeURIComponent(issued.email)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">{t('adminTitle')}</h1>
        <p className="mt-2 text-base text-on-surface-variant">{t('adminSubtitle')}</p>
      </header>

      {issued && (
        <div className="glass-card mb-8 border-brand/40 p-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-success/15 text-success">
              <Ticket className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-black">{t('tokenReady')}</h2>
              <p className="text-sm text-on-surface-variant">{t('tokenReadyHint')}</p>
            </div>
            <button
              type="button"
              onClick={() => setIssued(null)}
              aria-label="Close"
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-on-surface-variant hover:bg-surface-container"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <code className="mt-4 block break-all rounded-lg bg-surface-dim p-4 font-mono text-sm">
            {issued.token}
          </code>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-hover"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? t('copied') : t('copyShareLink')}
            </button>
            <button
              type="button"
              onClick={openLink}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              <ExternalLink className="h-4 w-4" />
              {t('openRedeemLink')}
            </button>
          </div>
        </div>
      )}

      <div className="glass-card mb-8 p-6">
        <h2 className="mb-4 font-black">{t('createToken')}</h2>
        <form onSubmit={onCreate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="token-name" className="mb-1 block text-sm font-semibold">
                {t('fullName')}
              </label>
              <input
                id="token-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface-dim px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
            <div>
              <label htmlFor="token-email" className="mb-1 block text-sm font-semibold">
                {t('email')}
              </label>
              <input
                id="token-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface-dim px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label htmlFor="token-ttl" className="mb-1 block text-sm font-semibold">
              {t('expiryLabel')} — {ttl} {t('minutes')}
            </label>
            <input
              id="token-ttl"
              type="range"
              min={5}
              max={60}
              step={5}
              value={ttl}
              onChange={(e) => setTtl(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm font-semibold text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {creating ? t('generating') : t('generateToken')}
          </button>
        </form>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-black">{t('issuedTokens')}</h2>
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              void refresh()
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t('refresh')}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : tokens.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-on-surface-variant">{t('noTokens')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-dim text-left">
                  <th className="px-6 py-2.5 font-bold text-on-surface-variant">{t('tableName')}</th>
                  <th className="px-4 py-2.5 font-bold text-on-surface-variant">{t('tableEmail')}</th>
                  <th className="px-4 py-2.5 font-bold text-on-surface-variant">{t('tableStatus')}</th>
                  <th className="px-4 py-2.5 font-bold text-on-surface-variant">{t('tableExpires')}</th>
                  <th className="px-4 py-2.5 text-right font-bold text-on-surface-variant">{t('tableAction')}</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((tk) => (
                  <tr key={tk.id} className="border-b border-line last:border-0">
                    <td className="px-6 py-3">
                      <p className="font-semibold">{tk.name}</p>
                      <p className="text-xs text-on-surface-muted">{tk.tokenPreview}</p>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{tk.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${
                          STATUS_STYLES[tk.status] ?? 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {tk.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {new Date(tk.expiresAt).toLocaleString(lang)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {tk.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => void onRevoke(tk.id)}
                          disabled={revoking === tk.id}
                          className="rounded-lg border border-error/40 px-2.5 py-1.5 text-xs font-bold text-error transition-colors hover:bg-error/10 disabled:opacity-60"
                        >
                          {revoking === tk.id ? t('revoking') : t('revoke')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export function AdminTokensPageGate() {
  return (
    <RequireDocs superAdmin>
      <AdminTokensPage />
    </RequireDocs>
  )
}
