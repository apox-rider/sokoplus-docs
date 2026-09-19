import { useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, Copy } from 'lucide-react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
      }}
      aria-label="Copy code"
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({ children }: { children?: ReactNode }) {
  const text =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
        ? children.filter((c): c is string => typeof c === 'string').join('')
        : ''
  return (
    <div className="mdx-codeblock my-4">
      <div className="flex items-center justify-end rounded-t-lg border border-b-0 border-line bg-surface-dim px-2 py-1">
        <CopyButton text={text} />
      </div>
      <pre>{children}</pre>
    </div>
  )
}

export function MarkdownArticle({ content }: { content: string }) {
  return (
    <div className="doc-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="doc-prose-link"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="doc-table-wrap">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
