import { cn } from '@/lib/utils'

export function FormDots({ form = [] }) {
  return (
    <div className="flex gap-1">
      {form.map((r, i) => (
        <span
          key={i}
          className={cn('w-2 h-2 rounded-full', {
            'bg-league-green': r === 'W',
            'bg-muted-foreground': r === 'D',
            'bg-league-red': r === 'L',
          })}
        />
      ))}
    </div>
  )
}
