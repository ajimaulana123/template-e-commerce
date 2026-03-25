import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  hasMore: boolean
  onPrevPage: () => void
  onNextPage: () => void
  onGoToPage: (page: number) => void
  loading?: boolean
}

export function PaginationControls({
  currentPage,
  totalPages,
  hasMore,
  onPrevPage,
  onNextPage,
  onGoToPage,
  loading = false
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevPage}
        disabled={currentPage === 1 || loading}
        className="gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </Button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onGoToPage(page)}
              disabled={loading}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2 py-1 text-gray-400">
              {page}
            </span>
          )
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onNextPage}
        disabled={!hasMore || loading}
        className="gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
