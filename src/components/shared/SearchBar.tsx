'use client'

import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { debounce } from '@/lib/api/utils'
import Input from '@/components/ui/Input'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
  debounceDelay?: number
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  className,
  debounceDelay = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value)
    }, debounceDelay),
    [onSearch]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        icon={<Search className="w-4 h-4 text-gray-400" />}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  )
}