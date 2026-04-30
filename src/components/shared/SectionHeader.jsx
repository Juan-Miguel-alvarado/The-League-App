export function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium">{title}</span>
      {action && (
        <button
          onClick={onAction}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {action} →
        </button>
      )}
    </div>
  )
}
