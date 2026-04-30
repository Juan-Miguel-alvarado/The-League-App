import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { TeamBadge } from '@/components/shared/TeamBadge'
import { ChartCard } from '@/components/charts/ChartCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function gdStr(gf, ga) { const d = gf - ga; return (d > 0 ? '+' : '') + d }

export function TeamDetail({ team, standings, scorers, onNavigate }) {
  const t = team || standings[0]
  const gd = t.gf - t.ga
  const winPct = Math.round(t.wins / t.played * 100)
  const teamScorers = scorers.filter(s => s.team === t.name)
  const formData = t.form || ['D', 'D', 'D', 'D', 'D']

  const radarConfig = useMemo(() => {
    const GRID = 'rgba(128,128,128,0.12)'
    const TICK = 'rgba(128,128,128,0.6)'
    const maxGF   = Math.max(...standings.map(x => x.gf))
    const minGA   = Math.min(...standings.map(x => x.ga))
    const maxW    = Math.max(...standings.map(x => x.wins))
    const maxPts  = Math.max(...standings.map(x => x.pts))
    const fPts    = formData.reduce((s, r) => s + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0)

    return {
      type: 'radar',
      data: {
        labels: ['Attack', 'Defense', 'Wins', 'Points', 'Form'],
        datasets: [{
          data: [
            Math.round(t.gf / maxGF * 100),
            Math.round(Math.max(0, (80 - t.ga) / (80 - minGA) * 100)),
            Math.round(t.wins / maxW * 100),
            Math.round(t.pts / maxPts * 100),
            Math.round(fPts / 15 * 100),
          ],
          borderColor: 'rgba(201,168,76,0.7)',
          backgroundColor: 'rgba(201,168,76,0.08)',
          pointBackgroundColor: '#c9a84c', pointRadius: 3, borderWidth: 1.5,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
        plugins: { legend: { display: false } },
        scales: { r: { grid: { color: GRID }, ticks: { display: false }, angleLines: { color: GRID }, pointLabels: { color: TICK, font: { size: 10 } }, suggestedMin: 0, suggestedMax: 100 } },
      },
    }
  }, [t, standings, formData])

  return (
    <div className="p-8 animate-fade-in space-y-6">
      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground -ml-2" onClick={() => onNavigate('teams')}>
        <ArrowLeft size={14} /> All Teams
      </Button>

      {/* Hero */}
      <Card className="p-7 flex items-center gap-6 flex-wrap">
        <TeamBadge team={t} size="lg" />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold tracking-tight">{t.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">LaLiga 2025/26 · Rank #{t.rank}</p>
        </div>
        <div className="flex gap-7 flex-wrap">
          {[['Points', t.pts], ['Wins', t.wins], ['GD', gdStr(t.gf, t.ga)], ['Win Rate', `${winPct}%`]].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="text-xl font-semibold font-mono tracking-tight">{val}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Matches Played" value={t.played} sub={`${t.wins}W · ${t.draws}D · ${t.losses}L`} />
        <StatCard label="Goals Scored"   value={t.gf}      sub={`${(t.gf / t.played).toFixed(2)} per match`} />
        <StatCard label="Goals Conceded" value={t.ga}      sub={`${(t.ga / t.played).toFixed(2)} per match`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Performance Radar" description="Normalized vs league maximum" config={radarConfig} height={240} />

        <Card className="p-5 space-y-4">
          <div>
            <p className="text-xs font-medium mb-0.5">Form — Last 5 Matches</p>
            <p className="text-[11px] text-muted-foreground mb-4">W = 3pts · D = 1pt · L = 0pts</p>
            <div className="flex gap-2">
              {formData.map((r, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 rounded-lg p-4 text-center border',
                    r === 'W' ? 'bg-league-green/8 border-league-green/25' : r === 'L' ? 'bg-league-red/8 border-league-red/25' : 'bg-accent border-border'
                  )}
                >
                  <p className={cn('text-xl font-semibold', r === 'W' ? 'text-league-green' : r === 'L' ? 'text-league-red' : 'text-muted-foreground')}>{r}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{r === 'W' ? 'Win' : r === 'L' ? 'Loss' : 'Draw'}</p>
                </div>
              ))}
            </div>
          </div>

          {teamScorers.length > 0 ? (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3">Squad Scorers</p>
              {teamScorers.map(s => (
                <div key={s.name} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                  <span className="text-base">⚽</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">{s.matches} apps · {s.assists} ast · {s.position}</p>
                  </div>
                  <span className="font-semibold font-mono">{s.goals}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-3">No top scorers registered</p>
          )}
        </Card>
      </div>
    </div>
  )
}
