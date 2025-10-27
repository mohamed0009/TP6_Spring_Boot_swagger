"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface StudentSearchProps {
  onSearch: (searchTerm: string) => void
}

export function StudentSearch({ onSearch }: StudentSearchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value
    onSearch(searchTerm)
  }

  return (
    <div className="relative max-w-sm">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        onChange={handleChange}
        placeholder="Search by name..."
        className="pl-9"
      />
    </div>
  )
}