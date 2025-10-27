"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface StudentFormProps {
  onSuccess: () => void
}

export function StudentForm({ onSuccess }: StudentFormProps) {
  interface FormDataType {
    nom: string
    prenom: string
    dateNaissance: string
  }

  const [formData, setFormData] = useState<FormDataType>({
    nom: "",
    prenom: "",
    dateNaissance: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormDataType) => ({ ...prev, [name]: value } as FormDataType))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.nom || !formData.prenom || !formData.dateNaissance) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080").replace(/\/+$/,'')
      const response = await fetch(`${API_BASE}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create student")
      }

      setFormData({ nom: "", prenom: "", dateNaissance: "" })
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
          <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
          <Input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Doe"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
          <Input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="John"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date de Naissance</label>
          <Input
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
            disabled={loading}
          />
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
          {loading ? "Creating..." : "Create Student"}
        </Button>
      </div>
    </form>
  )
}
