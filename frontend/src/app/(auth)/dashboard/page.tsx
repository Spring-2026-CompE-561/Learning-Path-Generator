"use client"

import * as React from "react"
import { LearningPathDialog } from "@/components/useLearningPathDialog"

export default function Dashboard() {
  // controls dialog open/close
  const [dialogOpen, setDialogOpen] = React.useState(false)

  // learning paths state
  const [paths, setPaths] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  // fetch learning paths from backend
  const fetchPaths = async () => {
    const token = localStorage.getItem("access_token")

    // basic guard (for preventing unnecessary request)
    if (!token) {
      console.warn("No token found")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/learning-paths/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch learning paths")
      }

      const data = await res.json()
      setPaths(data)
    } catch (err) {
      console.error("Error fetching paths:", err)
    } finally {
      setLoading(false)
    }
  }

  // load data on page mount
  React.useEffect(() => {
    fetchPaths()
  }, [])

  return (
    <div className="relative min-h-screen w-full p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Loading state */}
      {loading && <p className="mt-4">Loading...</p>}

      {/* Learning Path Cards */}
      <div className="mt-6 grid gap-4 max-w-3xl">
        {paths.map((path, i) => (
          <div
            key={i}
            className="p-4 border rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">
              {path.topic || "Untitled Topic"}
            </h2>

            <p className="text-sm text-gray-500">
              Proficiency: {path.proficency || "N/A"}
            </p>

           

            <p className="text-sm text-gray-500">
              Weeks: {path.weeks ?? "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* Floating button / dialog (teammate code) */}
      <div className="fixed bottom-8 right-8 z-50">
        <LearningPathDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)

            // when dialog closes → refresh data
            if (!open) {
              fetchPaths()
            }
          }}
        />
      </div>
    </div>
  )
}