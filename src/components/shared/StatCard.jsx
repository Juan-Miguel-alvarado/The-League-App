import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({ label, value, sub, subHighlight, className }) {
  return (
    <Card className={cn('p-5', className)}>
      <CardContent className="p-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">{label}</p>
        <p className="text-3xl font-semibold tracking-tight leading-none">{value}</p>
        {sub && (
          <p className="text-xs text-muted-foreground mt-1.5">
            {sub}
            {subHighlight && <em className="not-italic text-league-green ml-1">{subHighlight}</em>}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
