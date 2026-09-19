import {
  BookOpen,
  CircleHelp,
  CreditCard,
  Globe2,
  KeyRound,
  LayoutGrid,
  Rocket,
  Server,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { Section } from '@/lib/content'

const HELP_ICONS: Record<string, LucideIcon> = {
  'getting-started': Rocket,
  buyers: ShoppingBag,
  vendors: Store,
  'service-providers': Wrench,
  delivery: Truck,
  payments: CreditCard,
  'trust-safety': ShieldCheck,
  faq: CircleHelp,
}

const DEV_ICONS: Record<string, LucideIcon> = {
  overview: BookOpen,
  authentication: KeyRound,
  api: LayoutGrid,
  payments: CreditCard,
  platform: Globe2,
  deployment: Server,
}

export function getSectionIcon(section: Section, group: string): LucideIcon {
  return (section === 'help' ? HELP_ICONS[group] : DEV_ICONS[group]) ?? BookOpen
}