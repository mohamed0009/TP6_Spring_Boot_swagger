"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Pagination } from "./pagination"
import { AlertCircle, Loader2 } from "lucide-react"
import { StudentSearch } from "./student-search"
import { StudentEditForm } from "./student-edit-form"

interface Student {
  id: number
  nom: string
  prenom: string
  dateNaissance: string
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [currentPage, pageSize, refreshTrigger])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080").replace(/\/+$/,'')
      const response = await fetch(`${API_BASE}/api/all`, {
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }

      const data = await response.json()
      const students = Array.isArray(data) ? data : []
      
      // Filter students based on search term
      const filteredStudents = searchTerm
        ? students.filter(student => 
            student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.prenom.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : students
      
      setStudents(filteredStudents)
      setTotalPages(Math.ceil(students.length / pageSize))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    try {
      const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080").replace(/\/+$/,'')
      const response = await fetch(`${API_BASE}/api/delete/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete student")
      }

      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete student")
    }
  }

  if (loading) {
    return (
      <Card className="p-8 border border-border flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-muted-foreground">Loading students...</span>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 border border-destructive bg-destructive/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-destructive">Error Loading Students</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure the backend API is running at http://localhost:8080
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
  }

  return (
    <div className="space-y-4">
      <StudentSearch onSearch={handleSearch} />
      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Prénom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date de Naissance</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No students found. Add one to get started!
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => (
                  <tr key={student.id ?? idx} className="border-b border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{student.nom || '(No name)'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.prenom || '(No surname)'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {student.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString() : '(No date)'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}

      {editingStudent && (
        <StudentEditForm
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSuccess={() => {
            setEditingStudent(null)
            setRefreshTrigger(prev => prev + 1)
          }}
        />
      )}
    </div>
  )
}