import { useMemo } from 'react'
import { ChartCard } from '@/components/charts/ChartCard'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const GRID = 'rgba(128,128,128,0.08)'
const TICK = 'rgba(128,128,128,0.6)'

export function Scorers({ scorers, onNavigate }) {
  const chartConfig = useMemo(() => ({
    type: 'bar',
    data: {
      labels: scorers.map(s => s.name.split(' ').pop()),
      datasets: [
        { label: 'Goals',   data: scorers.map(s => s.goals),   backgroundColor: 'rgba(201,168,76,0.8)',   borderRadius: 3 },
        { label: 'Assists', data: scorers.map(s => s.assists), backgroundColor: 'rgba(128,128,128,0.35)', borderRadius: 3 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
      },
    },
  }), [scorers])

  return (
    <div className="p-8 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionHeader title="Goal Scorers" />
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Player', 'Team', 'Pos', 'Goals', 'Ast', 'MP', 'G/G'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scorers.map((s, i) => (
                  <tr
                    key={s.name}
                    className="border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => onNavigate('player', i)}
                  >
                    <td className="px-4 py-2.5">
                      <span className={cn('font-mono text-xs', i < 3 ? 'text-gold font-medium' : 'text-muted-foreground')}>{i + 1}</span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-xs">{s.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{s.team}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-[11px]">{s.position}</td>
                    <td className="px-4 py-2.5"><span className="font-semibold font-mono text-xs">{s.goals}</span></td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{s.assists}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{s.matches}</td>
                    <td className="px-4 py-2.5 text-xs">{s.matches > 0 ? (s.goals / s.matches).toFixed(2) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div>
          <SectionHeader title="Goals & Assists" />
          <ChartCard
            config={chartConfig}
            height={Math.max(280, scorers.length * 28 + 60)}
          />
        </div>
      </div>
    </div>
  )
}
