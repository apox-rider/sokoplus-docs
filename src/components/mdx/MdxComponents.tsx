import { Children, isValidElement, type ReactNode } from 'react'
import { useState } from 'react'
import { AlertTriangle, Info, Lightbulb, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type CalloutType = 'note' | 'tip' | 'warning' | 'danger'

const calloutStyles: Record<
  CalloutType,
  { icon: typeof Info; wrapper: string; label: string }
> = {
  note: {
    icon: Info,
    wrapper: 'border-info/40 bg-info/10 text-on-surface',
    label: 'Note',
  },
  tip: {
    icon: Lightbulb,
    wrapper: 'border-success/40 bg-success/10 text-on-surface',
    label: 'Tip',
  },
  warning: {
    icon: AlertTriangle,
    wrapper: 'border-warning/50 bg-warning/10 text-on-surface',
    label: 'Warning',
  },
  danger: {
    icon: AlertTriangle,
    wrapper: 'border-error/50 bg-error/10 text-on-surface',
    label: 'Danger',
  },
}

export function Callout({
  type = 'note',
  children,
}: {
  type?: CalloutType
  children: ReactNode
}) {
  const { icon: Icon, wrapper, label } = calloutStyles[type]
  return (
    <div
      className={cn(
        'my-4 flex gap-3 rounded-xl border-l-4 px-4 py-3 text-sm leading-relaxed',
        wrapper,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-on-surface-variant" />
      <div className="min-w-0">
        <p className="mb-1 font-bold uppercase tracking-wide text-[0.7rem]">{label}</p>
        <div className="space-y-1.5">{children}</div>
      </div>
    </div>
  )
}

export function Badge({
  color = 'neutral',
  children,
}: {
  color?: 'neutral' | 'success' | 'warning' | 'error' | 'brand'
  children: ReactNode
}) {
  const styles = {
    neutral: 'bg-surface-container text-on-surface-variant',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    error: 'bg-error/15 text-error',
    brand: 'bg-brand-soft text-brand',
  }[color]
  return (
    <span
      className={cn(
        'inline-block rounded-md px-2 py-0.5 text-xs font-bold',
        styles,
      )}
    >
      {children}
    </span>
  )
}

export function Tabs({ children }: { children: ReactNode }) {
  type TabElement = React.ReactElement<{ label?: string; children?: ReactNode }>
  const tabs = Children.toArray(children).filter(isValidElement) as TabElement[]
  const [active, setActive] = useState(0)
  const activeTab = tabs[active]
  return (
    <div className="my-4">
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto border-b border-line pb-px no-scrollbar"
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              'shrink-0 rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors',
              i === active
                ? 'border-b-2 border-brand text-brand'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="pt-3">{activeTab?.props.children}</div>
    </div>
  )
}

export function Tab({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-line bg-surface-dim px-1.5 py-0.5 font-mono text-xs text-on-surface">
      {children}
    </kbd>
  )
}

export function CodeBlock({ children, title }: { children: ReactNode; title?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="my-4">
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-line bg-surface-dim px-4 py-1.5">
        {title ? (
          <span className="font-mono text-xs text-on-surface-variant">{title}</span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => {
            const text = typeof children === 'string' ? children : ''
            void navigator.clipboard.writeText(text).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {children}
    </div>
  )
}
