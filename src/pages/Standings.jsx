import { FormDots } from '@/components/shared/FormDots'
import { TeamBadge } from '@/components/shared/TeamBadge'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function getZone(rank) {
  if (rank <= 4) return 'top'
  if (rank >= 18) return 'rel'
  return 'mid'
}

function gdStr(gf, ga) {
  const d = gf - ga
  return (d > 0 ? '+' : '') + d
}

export function Standings({ standings, onNavigate }) {
  return (
    <div className="p-8 animate-fade-in space-y-4">
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts', 'Form', 'Zone'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map(t => {
              const zone = getZone(t.rank)
              const gd = t.gf - t.ga
              return (
                <tr
                  key={t.rank}
                  className={cn(
                    'border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer transition-colors',
                    t.rank === 5  && 'border-t-gold/30',
                    t.rank === 18 && 'border-t-league-red/30',
                  )}
                  onClick={() => onNavigate('team', t.name)}
                >
                  <td className="px-4 py-2.5">
                    <span className={cn('font-mono text-xs', {
                      'text-gold font-medium': zone === 'top',
                      'text-league-red': zone === 'rel',
                      'text-muted-foreground': zone === 'mid',
                    })}>{t.rank}</span>
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
                  <td className="px-4 py-2.5 text-xs">{t.gf}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{t.ga}</td>
                  <td className={cn('px-4 py-2.5 text-xs font-mono', gd > 0 ? 'text-league-green' : gd < 0 ? 'text-league-red' : 'text-muted-foreground')}>
                    {gdStr(t.gf, t.ga)}
                  </td>
                  <td className="px-4 py-2.5"><span className="font-semibold font-mono text-xs">{t.pts}</span></td>
                  <td className="px-4 py-2.5"><FormDots form={t.form} /></td>
                  <td className="px-4 py-2.5">
                    {zone === 'top' && <Badge variant="ucl">UCL</Badge>}
                    {zone === 'rel' && <Badge variant="rel">REL</Badge>}
                    {zone === 'mid' && <Badge variant="mid">MID</Badge>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      <div className="flex gap-5 text-[11px] text-muted-foreground px-1">
        <span className="flex items-center gap-1.5"><Badge variant="ucl">UCL</Badge> Champions League (Top 4)</span>
        <span className="flex items-center gap-1.5"><Badge variant="rel">REL</Badge> Relegation Zone (Bottom 3)</span>
      </div>
    </div>
  )
}
