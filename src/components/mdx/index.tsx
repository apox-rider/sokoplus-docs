import { useRef, useState, type AnchorHTMLAttributes, type ComponentProps } from 'react'
import { Check, Copy } from 'lucide-react'
import { Badge, Callout, CodeBlock, Kbd, Tab, Tabs } from './MdxComponents'

function Pre({ children }: ComponentProps<'pre'>) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const copy = () => {
    const text = ref.current?.innerText ?? ''
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-on-surface-variant opacity-0 shadow-sm transition-opacity hover:text-on-surface focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  )
}

function A({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http') ?? false
  return (
    <a
      href={href}
      {...props}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

function Table({ children, ...props }: ComponentProps<'table'>) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-line">
      <table {...props} className="m-0 min-w-full">
        {children}
      </table>
    </div>
  )
}

export const mdxComponents = {
  a: A,
  pre: Pre,
  table: Table,
  Callout,
  Badge,
  Tabs,
  Tab,
  Kbd,
  CodeBlock,
}
