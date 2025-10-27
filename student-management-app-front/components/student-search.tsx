"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface StudentSearchProps {
  onSearch: (searchTerm: string) => void
}

export function StudentSearch({ onSearch }: StudentSearchProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchTerm = formData.get('search') as string
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        name="search"
        placeholder="Search by name..."
        className="max-w-sm"
      />
      <Button type="submit" variant="outline">
                        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  )
}