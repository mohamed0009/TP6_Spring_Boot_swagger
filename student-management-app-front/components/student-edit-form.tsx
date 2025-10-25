"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface StudentEditFormProps {
  student: Student
  onSuccess: () => void
  onCancel: () => void
}

export function StudentEditForm({ student, onSuccess, onCancel }: StudentEditFormProps) {
  const [formData, setFormData] = useState(student)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: Student) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)
      const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080").replace(/\/+$/,'')
      const response = await fetch(`${API_BASE}/api/students/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update student")
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Name</label>
          <Input type="text" name="name" value={formData.name} onChange={handleChange} disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
          <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Address</label>
          <Input type="text" name="address" value={formData.address} onChange={handleChange} disabled={loading} />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
