"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { StudentRow } from "./student-row"
import { Pagination } from "./pagination"
import { AlertCircle, Loader2 } from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface PageResponse {
  _embedded?: {
    students: Student[]
  }
  page?: {
    size: number
    totalElements: number
    totalPages: number
    number: number
  }
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchStudents()
  }, [currentPage, pageSize, refreshTrigger])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080").replace(/\/+$/,'')
      const response = await fetch(`${API_BASE}/api/students?page=${currentPage}&size=${pageSize}`, {
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`)
      }

      const data: PageResponse = await response.json()
      const studentList = data._embedded?.students || []
      setStudents(studentList)
      setTotalPages(data.page?.totalPages || 0)
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
      const response = await fetch(`${API_BASE}/api/students/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete student")
      }

  setRefreshTrigger((prev: number) => prev + 1)
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

  return (
    <div className="space-y-4">
      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Address</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No students found. Add one to get started!
                  </td>
                </tr>
              ) : (
                students.map((student, idx) =>
                  React.createElement(StudentRow as React.JSXElementConstructor<any>, {
                    key: student.id ?? idx,
                    student,
                    onDelete: handleDelete,
                    onRefresh: () => setRefreshTrigger((prev: number) => prev + 1),
                  })
                )
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}
