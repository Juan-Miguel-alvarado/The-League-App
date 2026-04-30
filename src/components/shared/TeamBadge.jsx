import { useState } from 'react'
import { cn } from '@/lib/utils'

export function TeamBadge({ team, size = 'sm' }) {
  const [imgError, setImgError] = useState(false)
  const sizeMap = { sm: 'w-6 h-6 text-[9px]', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-lg' }

  if (team.crest && !imgError) {
    return (
      <img
        src={team.crest}
        alt={team.abbr}
        className={cn(size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-11 h-11' : 'w-16 h-16', 'object-contain flex-shrink-0')}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div className={cn('rounded-full bg-accent border border-border flex items-center justify-center flex-shrink-0 font-semibold', sizeMap[size])}>
      {team.abbr}
    </div>
  )
}
