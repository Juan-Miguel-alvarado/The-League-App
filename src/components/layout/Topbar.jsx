import { useRef, useState, useEffect } from 'react'
import { Search, Sun, Moon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PAGE_TITLES = {
  home: 'Dashboard', table: 'Standings', teams: 'Teams',
  scorers: 'Top Scorers', stats: 'Statistics',
  team: 'Team Detail', player: 'Player Detail',
}

export function Topbar({ currentPage, standings, scorers, theme, onThemeToggle, onNavigate }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const index = [
    ...(standings || []).map(t => ({ type: 'team', name: t.name, sub: `LaLiga · #${t.rank}`, key: t.name })),
    ...(scorers || []).map((s, i) => ({ type: 'player', name: s.name, sub: `${s.team} · ${s.goals} goals`, key: i })),
  ]

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    const hits = index.filter(r => r.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    setResults(hits)
    setOpen(hits.length > 0)
  }, [query, standings, scorers])

  useEffect(() => {
    function onClick(e) { if (!wrapRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function select(item) {
    if (item.type === 'team') onNavigate('team', item.key)
    else onNavigate('player', item.key)
    setQuery('')
    setOpen(false)
  }

  return (
    <header className="flex items-center gap-4 px-8 py-4 border-b border-border bg-background/90 backdrop-blur-md flex-shrink-0 z-10">
      <h2 className="text-base font-medium flex-1">{PAGE_TITLES[currentPage] || currentPage}</h2>

      <div ref={wrapRef} className="relative">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9 w-60 text-sm h-9"
            placeholder="Search teams, players..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query && setOpen(results.length > 0)}
          />
        </div>

        {open && (
          <div className="absolute top-[calc(100%+6px)] right-0 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                onClick={() => select(r)}
              >
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">{r.sub}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground ml-3 flex-shrink-0">{r.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Button variant="ghost" size="icon" onClick={onThemeToggle} className="flex-shrink-0">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </header>
  )
}
