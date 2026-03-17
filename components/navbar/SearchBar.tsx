import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SearchDropdown from '../SearchDropdown'

interface SearchBarProps {
  className?: string
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value.trim())}`)
      setSearchDropdownOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch}>
        <Input
          type="text"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchDropdownOpen(true)}
          className="w-full pr-10 bg-gray-50 border-gray-300 text-sm"
        />
        <Button 
          type="submit"
          size="sm" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 p-1"
        >
          <Search className="w-4 h-4" />
        </Button>
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
