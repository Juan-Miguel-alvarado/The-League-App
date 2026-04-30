import { TeamBadge } from '@/components/shared/TeamBadge'
import { FormDots } from '@/components/shared/FormDots'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function Teams({ standings, onNavigate }) {
  return (
    <div className="p-8 animate-fade-in">
      <div className="grid grid-cols-4 gap-3">
        {standings.map(t => (
          <Card
            key={t.rank}
            className="p-5 cursor-pointer hover:border-border/80 hover:-translate-y-0.5 transition-all text-center"
            onClick={() => onNavigate('team', t.name)}
          >
            <p className="text-[10px] font-mono text-muted-foreground mb-2">#{t.rank}</p>
            <div className="flex justify-center mb-3">
              <TeamBadge team={t} size="md" />
            </div>
            <p className="text-sm font-medium leading-tight mb-1">{t.name}</p>
            <p className="text-[11px] text-muted-foreground mb-2">{t.pts} pts · {t.wins}W {t.draws}D {t.losses}L</p>
            <div className="flex justify-center">
              <FormDots form={t.form} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
