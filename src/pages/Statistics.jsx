import { useMemo } from 'react'
import { StatCard } from '@/components/shared/StatCard'
import { ChartCard } from '@/components/charts/ChartCard'

const GRID = 'rgba(128,128,128,0.08)'
const TICK = 'rgba(128,128,128,0.6)'

export function Statistics({ standings }) {
  const sorted   = useMemo(() => [...standings].sort((a, b) => b.gf - a.gf), [standings])
  const bestDef  = useMemo(() => [...standings].sort((a, b) => a.ga - b.ga)[0], [standings])
  const mostW    = useMemo(() => [...standings].sort((a, b) => b.wins - a.wins)[0], [standings])
  const bestGD   = useMemo(() => [...standings].sort((a, b) => (b.gf - b.ga) - (a.gf - a.ga))[0], [standings])

  const allGoalsConfig = useMemo(() => ({
    type: 'bar',
    data: {
      labels: sorted.map(t => t.name),
      datasets: [{
        data: sorted.map(t => t.gf),
        backgroundColor: sorted.map((_, i) => `rgba(201,168,76,${0.75 - i * 0.032})`),
        borderRadius: 3,
      }],
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
  }), [sorted])

  const attDefConfig = useMemo(() => ({
    type: 'bar',
    data: {
      labels: standings.slice(0, 10).map(t => t.abbr),
      datasets: [
        { label: 'Scored',   data: standings.slice(0, 10).map(t => t.gf), backgroundColor: 'rgba(34,221,136,0.65)',  borderRadius: 3 },
        { label: 'Conceded', data: standings.slice(0, 10).map(t => t.ga), backgroundColor: 'rgba(238,85,51,0.5)',    borderRadius: 3 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
      },
    },
  }), [standings])

  const ppgConfig = useMemo(() => ({
    type: 'line',
    data: {
      labels: standings.map(t => t.abbr),
      datasets: [{
        data: standings.map(t => +(t.pts / t.played).toFixed(2)),
        borderColor: 'rgba(201,168,76,0.7)',
        backgroundColor: 'rgba(201,168,76,0.06)',
        fill: true, tension: 0.4, pointRadius: 3,
        pointBackgroundColor: 'rgba(201,168,76,0.9)', pointBorderWidth: 0,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 500 },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 9 }, maxRotation: 45 } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } }, min: 0, max: 3.2 },
      },
    },
  }), [standings])

  return (
    <div className="p-8 animate-fade-in space-y-7">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Most Goals Scored" value={sorted[0].name} sub={`${sorted[0].gf} goals this season`} />
        <StatCard label="Best Defense"      value={bestDef.name}    sub={`${bestDef.ga} goals conceded`} />
        <StatCard label="Most Wins"         value={mostW.wins}       sub={mostW.name} />
        <StatCard label="Best Goal Diff."   value={`+${bestGD.gf - bestGD.ga}`} sub={bestGD.name} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard
          title="Goals Scored — All Teams"
          description="Ranked highest to lowest"
          config={allGoalsConfig}
          height={standings.length * 36 + 60}
        />
        <div className="space-y-4">
          <ChartCard
            title="Attack vs Defense — Top 10"
            description="Goals scored vs conceded"
            config={attDefConfig}
            height={210}
          />
          <ChartCard
            title="Points per Game"
            description="All teams · season average"
            config={ppgConfig}
            height={175}
          />
        </div>
      </div>
    </div>
  )
}
