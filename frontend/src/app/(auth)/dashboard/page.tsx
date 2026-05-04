"use client"

import * as React from "react"
import { LearningPathDialog } from "@/components/useLearningPathDialog"

export default function Dashboard() {
  // tracks if learning path dialog is opened or closed
  const [dialogOpen, setDialogOpen] = React.useState(false)

  return (
    <div className="relative min-h-screen w-full p-8">
      {/* content later goes here */}
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* button in the bottom rifht for now */}
      <div className="fixed bottom-8 right-8 z-50">
        <LearningPathDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </div>
  )
}