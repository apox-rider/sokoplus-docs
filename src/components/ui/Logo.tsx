import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="/sm1.png"
        width={130}
        height={130}
        alt="SokoPlus logo"
        className="object-contain"
      />
    </div>
  )
}
