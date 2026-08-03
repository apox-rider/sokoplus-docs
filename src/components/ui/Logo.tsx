import { cn } from '@/lib/cn'

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="/sm1.png"
        width={130}
        height={130}
        alt="SokoPlus logo"
        className="object-contain"
      />
      {/* {withText && (
        <span className="text-lg font-black tracking-tight text-shop-accent">
          .docs
        </span>
      )} */}
    </div>
  )
}
