import { useMemo } from 'react'
import { StatCard } from '@/components/shared/StatCard'
import { FormDots } from '@/components/shared/FormDots'
import { TeamBadge } from '@/components/shared/TeamBadge'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { ChartCard } from '@/components/charts/ChartCard'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export function Dashboard({ standings, scorers, matches, onNavigate }) {
  const top = standings[0]
  const totalGoals = standings.reduce((s, t) => s + t.gf, 0)
  const avgGoals = (totalGoals / standings.length).toFixed(1)
  const gap = top.pts - (standings[1]?.pts || 0)

  const ptsChartConfig = useMemo(() => ({
    type: 'doughnut',
    data: {
      labels: ['Top 4', 'Mid-high', 'Mid table', 'Relegation'],
      datasets: [{
        data: [
          standings.slice(0, 4).reduce((s, t) => s + t.pts, 0),
          standings.slice(4, 7).reduce((s, t) => s + t.pts, 0),
          standings.slice(7, 17).reduce((s, t) => s + t.pts, 0),
          standings.slice(17).reduce((s, t) => s + t.pts, 0),
        ],
        backgroundColor: ['rgba(201,168,76,0.85)', 'rgba(201,168,76,0.4)', 'rgba(201,168,76,0.12)', 'rgba(238,85,51,0.4)'],
        borderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 500 }, plugins: { legend: { display: false } }, cutout: '65%' },
  }), [standings])

  const wdlChartConfig = useMemo(() => {
    const GRID = 'rgba(128,128,128,0.08)'
    const TICK = 'rgba(128,128,128,0.6)'
    return {
      type: 'bar',
      data: {
        labels: standings.slice(0, 5).map(t => t.abbr),
        datasets: [
          { label: 'Wins',   data: standings.slice(0, 5).map(t => t.wins),   backgroundColor: 'rgba(34,221,136,0.7)',  borderRadius: 3 },
          { label: 'Draws',  data: standings.slice(0, 5).map(t => t.draws),  backgroundColor: 'rgba(128,128,128,0.3)', borderRadius: 3 },
          { label: 'Losses', data: standings.slice(0, 5).map(t => t.losses), backgroundColor: 'rgba(238,85,51,0.5)',   borderRadius: 3 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
        plugins: { legend: { display: false } },
        scales: {
          x: { stacked: true, grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
          y: { stacked: true, grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        },
      },
    }
  }, [standings])

  const gdChartConfig = useMemo(() => {
    const GRID = 'rgba(128,128,128,0.08)'
    const TICK = 'rgba(128,128,128,0.6)'
    return {
      type: 'bar',
      data: {
        labels: standings.map(t => t.abbr),
        datasets: [{
          data: standings.map(t => t.gf - t.ga),
          backgroundColor: standings.map(t => (t.gf - t.ga) >= 0 ? 'rgba(34,221,136,0.6)' : 'rgba(238,85,51,0.5)'),
          borderRadius: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 9 }, maxRotation: 45 } },
          y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        },
      },
    }
  }, [standings])

  return (
    <div className="p-8 animate-fade-in space-y-7">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="League Leader" value={top.name} sub={`${top.pts} pts`} subHighlight={`+${gap} vs 2nd`} />
        <StatCard label="Total Goals" value={totalGoals} sub="Scored this season" />
        <StatCard label="Avg Goals / Team" value={avgGoals} sub="Per team this season" />
        <StatCard
          label="Top Scorer"
          value={scorers[0]?.name.split(' ').pop() || '—'}
          sub={`${scorers[0]?.goals || 0} goals · ${scorers[0]?.team || ''}`}
        />
      </div>

      {/* Two-col: standings + scorers/matches */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionHeader title="Standings — Top 8" action="View all" onAction={() => onNavigate('table')} />
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Team', 'P', 'W', 'D', 'L', 'Pts', 'Form'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standings.slice(0, 8).map(t => (
                  <tr
                    key={t.rank}
                    className="border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => onNavigate('team', t.name)}
                  >
                    <td className="px-4 py-2.5">
                      <span className={cn('font-mono text-xs', t.rank <= 4 ? 'text-gold font-medium' : 'text-muted-foreground')}>{t.rank}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <TeamBadge team={t} size="sm" />
                        <span className="font-medium text-xs">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{t.played}</td>
                    <td className="px-4 py-2.5 text-xs">{t.wins}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{t.draws}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{t.losses}</td>
                    <td className="px-4 py-2.5"><span className="font-semibold font-mono text-xs">{t.pts}</span></td>
                    <td className="px-4 py-2.5"><FormDots form={t.form} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-4">
          <div>
            <SectionHeader title="Top Scorers" action="View all" onAction={() => onNavigate('scorers')} />
            <Card className="p-5">
              <div className="space-y-2">
                {scorers.slice(0, 8).map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-muted-foreground truncate">{s.name.split(' ').pop()}</span>
                    <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground rounded-full transition-all duration-700"
                        style={{ width: `${Math.round(s.goals / scorers[0].goals * 100)}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs text-muted-foreground font-mono">{s.goals}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <SectionHeader title="Recent Results" />
            <Card className="overflow-hidden">
              {matches.slice(0, 5).map(m => (
                <div key={m.id} className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-0 text-xs gap-2">
                  <span className="text-muted-foreground flex-1 text-right truncate">{m.homeTeam}</span>
                  <span className="font-mono font-semibold bg-accent px-2.5 py-1 rounded flex-shrink-0">{m.homeScore}–{m.awayScore}</span>
                  <span className="text-muted-foreground flex-1 truncate">{m.awayTeam}</span>
                  <span className="text-muted-foreground/60 flex-shrink-0 text-[11px]">{fmtDate(m.date)}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      {/* Three charts */}
      <div className="grid grid-cols-3 gap-4">
        <ChartCard title="Points Distribution" description="By table zone" config={ptsChartConfig} height={190} />
        <ChartCard title="W / D / L — Top 5" description="Stacked results" config={wdlChartConfig} height={190} />
        <ChartCard title="Goal Difference" description="All 20 teams" config={gdChartConfig} height={190} />
      </div>
    </div>
  )
}
