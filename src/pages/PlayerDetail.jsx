import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { ChartCard } from '@/components/charts/ChartCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function PlayerDetail({ playerIdx, scorers, standings, onNavigate }) {
  const p = scorers[playerIdx] || scorers[0]
  const team = standings.find(t => t.name === p.team) || standings[0]
  const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const GRID = 'rgba(128,128,128,0.12)'
  const TICK = 'rgba(128,128,128,0.6)'

  const radarConfig = useMemo(() => {
    const maxGoals = Math.max(...scorers.map(x => x.goals))
    const maxAst   = Math.max(...scorers.map(x => x.assists))
    const avgGoals = scorers.reduce((s, x) => s + x.goals, 0) / scorers.length
    const avgAst   = scorers.reduce((s, x) => s + x.assists, 0) / scorers.length
    const maxRate  = Math.max(...scorers.map(x => x.matches > 0 ? x.goals / x.matches : 0))

    return {
      type: 'radar',
      data: {
        labels: ['Goals', 'Assists', 'Apps', 'G/Match', 'G+A'],
        datasets: [
          {
            label: p.name,
            data: [
              Math.round(p.goals / maxGoals * 100),
              Math.round(maxAst > 0 ? p.assists / maxAst * 100 : 0),
              Math.round(p.matches / 29 * 100),
              Math.round(maxRate > 0 ? (p.goals / p.matches) / maxRate * 100 : 0),
              Math.round((p.goals + p.assists) / (maxGoals + maxAst) * 100),
            ],
            borderColor: 'rgba(201,168,76,0.8)', backgroundColor: 'rgba(201,168,76,0.08)',
            pointBackgroundColor: '#c9a84c', pointRadius: 3, borderWidth: 1.5,
          },
          {
            label: 'Avg',
            data: [
              Math.round(avgGoals / maxGoals * 100),
              Math.round(maxAst > 0 ? avgAst / maxAst * 100 : 0),
              70,
              Math.round(maxRate > 0 ? (avgGoals / (scorers.reduce((s, x) => s + x.matches, 0) / scorers.length)) / maxRate * 100 : 0),
              Math.round((avgGoals + avgAst) / (maxGoals + maxAst) * 100),
            ],
            borderColor: 'rgba(128,128,128,0.35)', backgroundColor: 'rgba(128,128,128,0.04)',
            pointBackgroundColor: '#888', pointRadius: 2, borderWidth: 1, borderDash: [4, 3],
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
        plugins: { legend: { display: false } },
        scales: { r: { grid: { color: GRID }, ticks: { display: false }, angleLines: { color: GRID }, pointLabels: { color: TICK, font: { size: 10 } }, suggestedMin: 0, suggestedMax: 100 } },
      },
    }
  }, [p, scorers])

  const donutConfig = useMemo(() => ({
    type: 'doughnut',
    data: {
      labels: ['Goals', 'Assists', 'No contribution'],
      datasets: [{
        data: [p.goals, p.assists, Math.max(0, p.matches - p.goals - p.assists)],
        backgroundColor: ['rgba(201,168,76,0.9)', 'rgba(201,168,76,0.4)', 'rgba(128,128,128,0.1)'],
        borderWidth: 0, hoverOffset: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
      plugins: { legend: { display: true, position: 'bottom', labels: { color: TICK, font: { size: 11 }, boxWidth: 10, padding: 14 } } },
      cutout: '60%',
    },
  }), [p])

  return (
    <div className="p-8 animate-fade-in space-y-6">
      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground -ml-2" onClick={() => onNavigate('scorers')}>
        <ArrowLeft size={14} /> Top Scorers
      </Button>

      {/* Hero */}
      <Card className="p-7 flex items-center gap-6 flex-wrap">
        <div className="w-16 h-16 rounded-full bg-accent border border-border flex items-center justify-center text-lg font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold tracking-tight">{p.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {p.team} · {p.nationality} · {p.position}{p.age ? ` · Age ${p.age}` : ''}
          </p>
        </div>
        <div className="flex gap-7 flex-wrap">
          {[['Goals', p.goals], ['Assists', p.assists], ['Apps', p.matches], ['G/Match', p.matches > 0 ? (p.goals / p.matches).toFixed(2) : '—']].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="text-xl font-semibold font-mono tracking-tight">{val}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Goal Contributions" value={p.goals + p.assists} sub="Goals + Assists" />
        <StatCard label="Mins per Goal"  value={p.goals > 0 ? `${Math.round(p.matches * 90 / p.goals)}'` : '—'} sub="Avg per goal" />
        <StatCard label="Penalties"      value={p.penalties} sub="This season" />
        <StatCard label="Team Standing"  value={`#${team?.rank || '—'}`} sub={`${team?.pts || 0} pts · ${team?.name || ''}`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Performance Radar" description="Player vs field average (dashed)" config={radarConfig} height={260} />
        <ChartCard title="Contribution Breakdown" description="Goals · Assists · Matches without" config={donutConfig} height={260} />
      </div>
    </div>
  )
}
