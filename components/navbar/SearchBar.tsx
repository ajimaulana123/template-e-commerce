import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SearchDropdown from '../SearchDropdown'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface SearchBarProps {
  className?: string
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchDropdownOpen(false)
    }
  }

  // Auto-navigate when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim() && searchDropdownOpen) {
      router.push(`/products?search=${encodeURIComponent(debouncedSearchQuery.trim())}`)
    }
  }, [debouncedSearchQuery, router, searchDropdownOpen])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearchDropdownOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Cari produk halal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchDropdownOpen(true)}
            className="w-full pl-10 pr-24 bg-gray-50 border-gray-300 text-sm focus:border-green-500 focus:ring-green-500 rounded-lg h-10"
          />
          <Button 
            type="submit"
            size="sm" 
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white h-7 rounded-md px-3"
          >
            <Search className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline text-xs">Cari</span>
          </Button>
        </div>
      </form>
      
      <SearchDropdown 
        isOpen={searchDropdownOpen}
        searchQuery={searchQuery}
        onClose={() => setSearchDropdownOpen(false)}
        onSearchChange={handleSearchChange}
      />
    </div>
  )
}
