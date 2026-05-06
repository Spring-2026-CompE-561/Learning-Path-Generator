"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { LearningPathDialog } from "@/components/useLearningPathDialog"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const router = useRouter()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [paths, setPaths] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)

  const fetchPaths = async () => {
    const token = localStorage.getItem("access_token")

    if (!token) return




    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/learning-paths/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch learning paths")
      setPaths(await res.json())
    } catch (err) {
      console.error("Error fetching paths:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, pathId: number) => {
    e.stopPropagation()
    if (!confirm("Delete this learning path? This cannot be undone.")) return

    const token = localStorage.getItem("access_token")
    if (!token) return

    setDeletingId(pathId)
    try {
      const res = await fetch(`http://127.0.0.1:8000/learning-paths/${pathId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to delete")
      setPaths((prev) => prev.filter((p) => p.id !== pathId))
    } catch (err) {
      console.error("Error deleting path:", err)
    } finally {
      setDeletingId(null)
    }
  }

  React.useEffect(() => {
    fetchPaths()
  }, [])

  return (
    <div className="relative min-h-screen w-full p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {loading && <p className="mt-4">Loading...</p>}

      <div className="mt-6 grid gap-4 max-w-3xl bg-background">
        {paths.map((path) => (
          <div
            key={path.id}
            onClick={() => router.push(`/learning-path/${path.id}`)}
            className="p-4 border rounded-xl shadow hover:shadow-md transition cursor-pointer"
          >

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold truncate">
                  {path.topic || "Untitled Topic"}
                </h2>
                <p className="text-sm text-secondary">
                  Proficiency: {path.proficency || "N/A"}
                </p>
                <p className="text-sm text-secondary">
                  Weeks: {path.weeks ?? "N/A"}
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={(e) => handleDelete(e, path.id)}
                disabled={deletingId === path.id}
                aria-label="Delete learning path"
              >
                <Trash2 />
              </Button>
            </div>

          </div>
        ))}
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <LearningPathDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) fetchPaths()
          }}
        />
      </div>
    </div>
  )
}
