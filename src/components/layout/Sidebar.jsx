import { LayoutDashboard, List, Globe, Star, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { section: 'Overview' },
  { id: 'home',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'table',   label: 'Standings',    Icon: List },
  { section: 'Data' },
  { id: 'teams',   label: 'Teams',        Icon: Globe },
  { id: 'scorers', label: 'Top Scorers',  Icon: Star },
  { id: 'stats',   label: 'Statistics',   Icon: BarChart2 },
]

export function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-[220px] min-w-[220px] h-screen flex flex-col border-r border-border bg-background">
      <div className="px-5 py-6 flex-shrink-0">
        <h1 className="text-lg font-semibold tracking-tight">LaLiga</h1>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5 block">
          2025/26 Season
        </span>
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <p key={i} className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-2 pt-4 pb-1.5 first:pt-2">
                {item.section}
              </p>
            )
          }
          const { id, label, Icon } = item
          const active = currentPage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-left mb-0.5',
                active
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon size={15} className={cn('flex-shrink-0', active ? 'opacity-100' : 'opacity-60')} />
              {label}
            </button>
          )
        })}
      </nav>

      <Separator />
      <div className="px-5 py-4 flex-shrink-0">
        <p className="text-xs font-medium text-muted-foreground">2025/26</p>
        <p className="text-[11px] text-muted-foreground/60">Live · football-data.org</p>
      </div>
    </aside>
  )
}
