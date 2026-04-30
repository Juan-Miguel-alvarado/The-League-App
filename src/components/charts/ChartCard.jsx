import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ChartCard({ title, description, config, height = 200, className }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !config) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(canvasRef.current, config)
    return () => { chartRef.current?.destroy() }
  }, [config])

  return (
    <Card className={cn('p-5', className)}>
      <CardContent className="p-0">
        {title && <p className="text-xs font-medium mb-0.5">{title}</p>}
        {description && <p className="text-[11px] text-muted-foreground mb-4">{description}</p>}
        <div style={{ position: 'relative', height }}>
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}
