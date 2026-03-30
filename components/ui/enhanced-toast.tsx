import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface EnhancedToastOptions {
  title: string
  description?: string
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useEnhancedToast() {
  const { toast } = useToast()

  const showToast = ({
    title,
    description,
    type = 'info',
    duration = 3000,
    action,
  }: EnhancedToastOptions) => {
    const icons = {
      success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      error: <XCircle className="h-5 w-5 text-red-600" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      info: <Info className="h-5 w-5 text-blue-600" />,
    }

    const bgColors = {
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200',
    }

    toast({
      duration,
      className: `${bgColors[type]} border-2`,
      description: (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{title}</p>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2 underline"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      ),
    })
  }

  return {
    success: (title: string, description?: string, action?: EnhancedToastOptions['action']) =>
      showToast({ title, description, type: 'success', action }),
    error: (title: string, description?: string) =>
      showToast({ title, description, type: 'error' }),
    warning: (title: string, description?: string) =>
      showToast({ title, description, type: 'warning' }),
    info: (title: string, description?: string) =>
      showToast({ title, description, type: 'info' }),
  }
}
