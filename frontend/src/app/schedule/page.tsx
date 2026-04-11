"use client";

import { useAuth } from "@/components/AuthProvider";

export default function SchedulePage() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        <p>Please log in to view your schedule.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-6 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Schedule</h1>
      <div className="bg-card-bg border border-card-border rounded-lg p-6 text-center text-gray-400">
        <p>Schedule view coming soon.</p>
      </div>
    </div>
  );
}
