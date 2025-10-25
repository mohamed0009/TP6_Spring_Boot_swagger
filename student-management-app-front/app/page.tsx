"use client"

import { useState } from "react"
import { StudentList } from "@/components/student-list"
import { StudentForm } from "@/components/student-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleStudentAdded = () => {
    setShowForm(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Student Management</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
              {showForm ? "Cancel" : "+ Add Student"}
            </Button>
          </div>
          <p className="text-muted-foreground">Manage and organize your student database</p>
        </div>

        {/* Form Section */}
        {showForm && (
          <Card className="mb-8 p-6 border border-border">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Add New Student</h2>
            <StudentForm onSuccess={handleStudentAdded} />
          </Card>
        )}

        {/* Students List */}
        <StudentList key={refreshTrigger} />
      </div>
    </main>
  )
}
