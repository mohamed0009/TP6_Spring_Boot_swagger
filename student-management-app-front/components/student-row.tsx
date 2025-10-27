"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { StudentEditForm } from "./student-edit-form"
import { Edit2, Trash2 } from "lucide-react"

interface Student {
  id: number
  nom: string
  prenom: string
  dateNaissance: string
}

interface StudentRowProps {
  student: Student
  onDelete: (id: number) => void
  onRefresh: () => void
}

export const StudentRow: React.FC<StudentRowProps> = ({ student, onDelete, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <tr className="border-b border-border bg-muted/30">
        <td colSpan={5} className="px-6 py-4">
          <StudentEditForm
            student={student}
            onSuccess={() => {
              setIsEditing(false)
              onRefresh()
            }}
            onCancel={() => setIsEditing(false)}
          />
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-foreground">{student.nom}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{student.prenom}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(student.dateNaissance).toLocaleDateString()}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(student.id)}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  )
}
