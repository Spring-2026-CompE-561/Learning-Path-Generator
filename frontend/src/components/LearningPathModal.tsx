"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { createLearningPath } from "@/lib/api";

interface LearningPathModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const PROFICIENCY_OPTIONS = ["beginner", "intermediate", "advanced"];
const LEARNING_TYPE_OPTIONS = ["video", "audio", "article", "problems", "course"];

export default function LearningPathModal({ onClose, onCreated }: LearningPathModalProps) {
  const { token } = useAuth();
  const [topic, setTopic] = useState("");
  const [proficiency, setProficiency] = useState("beginner");
  const [learningTypes, setLearningTypes] = useState<string[]>([]);
  const [weeks, setWeeks] = useState(4);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleLearningType(type: string) {
    setLearningTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);

    try {
      await createLearningPath(token, {
        topic,
        proficency: proficiency,
        learning_type: learningTypes.length > 0 ? learningTypes : undefined,
        weeks,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create learning path");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--modal-overlay)" }}>
      <div className="bg-card-bg rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: "var(--primary)" }}>
          Create Learning Path
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="lp-topic" className="block text-sm font-medium mb-1">
              Topic
            </label>
            <input
              id="lp-topic"
              type="text"
              required
              maxLength={30}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-card-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Python, Machine Learning, Guitar"
            />
          </div>

          <div>
            <label htmlFor="lp-proficiency" className="block text-sm font-medium mb-1">
              Proficiency Level
            </label>
            <select
              id="lp-proficiency"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full border border-card-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              {PROFICIENCY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Learning Types
            </label>
            <div className="flex flex-wrap gap-2">
              {LEARNING_TYPE_OPTIONS.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleLearningType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    learningTypes.includes(type)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-card-border hover:border-primary"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="lp-weeks" className="block text-sm font-medium mb-1">
              Duration (weeks)
            </label>
            <input
              id="lp-weeks"
              type="number"
              required
              min={1}
              max={52}
              value={weeks}
              onChange={(e) => setWeeks(parseInt(e.target.value) || 1)}
              className="w-full border border-card-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-error text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-semibold py-2.5 rounded hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Learning Path"}
          </button>
        </form>
      </div>
    </div>
  );
}
