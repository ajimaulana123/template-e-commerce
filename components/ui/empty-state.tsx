import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { EnhancedButton } from './enhanced-button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'outline'
  }
  children?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Icon className="h-12 w-12 text-gray-400" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      
      {description && (
        <p className="text-sm text-gray-600 max-w-sm mb-6">{description}</p>
      )}
      
      {action && (
        <EnhancedButton
          variant={action.variant || 'primary'}
          onClick={action.onClick}
        >
          {action.label}
        </EnhancedButton>
      )}
      
      {children}
    </div>
  )
}
