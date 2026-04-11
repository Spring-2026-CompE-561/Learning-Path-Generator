"use client";

import { LearningPath } from "@/lib/api";

interface LearningPathCardProps {
  path: LearningPath;
}

export default function LearningPathCard({ path }: LearningPathCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Card color bar */}
      <div className="h-24 bg-primary flex items-center justify-center">
        <span className="text-white text-3xl font-bold opacity-30">
          {path.topic.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Card content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{path.topic}</h3>
        <p className="text-sm text-gray-500 mb-1">
          Level: {path.proficency ? path.proficency.charAt(0).toUpperCase() + path.proficency.slice(1) : "Not set"}
        </p>
        <p className="text-sm text-gray-500">
          Duration: {path.weeks} {path.weeks === 1 ? "week" : "weeks"}
        </p>
        {path.learning_type && path.learning_type.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {path.learning_type.map((type) => (
              <span
                key={type}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
