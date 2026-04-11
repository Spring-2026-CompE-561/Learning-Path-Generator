"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getLearningPaths, LearningPath } from "@/lib/api";
import LearningPathCard from "@/components/LearningPathCard";
import LearningPathModal from "@/components/LearningPathModal";

export default function Dashboard() {
  const { token, isLoggedIn } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  async function fetchPaths() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getLearningPaths(token);
      setPaths(data);
    } catch {
      // token may be expired
      setPaths([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchPaths();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--primary)" }}>
          Welcome to Learning Path Generator
        </h1>
        <p className="text-gray-500 max-w-md mb-6">
          Create personalized learning schedules powered by AI. Log in or sign up to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-accent text-white font-semibold px-4 py-2 rounded hover:bg-accent-light transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          New Learning Path
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-12">Loading...</p>
      ) : paths.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No learning paths yet</p>
          <p className="text-sm">Click &quot;New Learning Path&quot; to create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paths.map((path) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
      )}

      {showCreate && (
        <LearningPathModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchPaths}
        />
      )}
    </div>
  );
}
