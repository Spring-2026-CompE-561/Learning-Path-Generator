"use client";

import { useState } from "react";

// simple type for what we display in the UI
type LearningPath = {
  topic?: string;
};

export default function Home() {
  // stores all fetched/created learning paths
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);

  // controls loading state for fetch button
  const [isLoading, setIsLoading] = useState(false);

  // Form
  // these track user input for creating a new learning path
  const [topic, setTopic] = useState("");
  const [proficiency, setProficiency] = useState("beginner");
  const [learningType, setLearningType] = useState<string[]>(["video"]);
  const [weeks, setWeeks] = useState(1);

  // backend base URL (falls back to localhost if env not set)
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  // helper to grab auth token from browser storage
  const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
  };

  // Get req
  // fetch all learning paths for the logged-in user
  const loadPaths = async (): Promise<void> => {
    const token = getAuthToken();

    // basic guard so we don’t send requests without auth
    if (!token) {
      alert("You are not logged in");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/learning-paths/`, {
        headers: {
          Authorization: `Bearer ${token}`, // attach JWT
          "Content-Type": "application/json",
        },
      });

      // simple error handling (could be improved later)
      if (!response.ok) {
        throw new Error("Request failed");
      }

      // update state with fetched data
      const result: LearningPath[] = await response.json();
      setLearningPaths(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Post req
  // creates a new learning path using form data
  const createLearningPath = async (): Promise<void> => {
    const token = getAuthToken();

    if (!token) {
      alert("You are not logged in");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/learning-paths/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          proficiency,
          learning_type: learningType, // backend expects this format
          weeks,
        }),
      });

      // show status code in error for debugging
      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      const newPath = await response.json();

      // update UI immediately instead of refetching everything
      setLearningPaths((prev) => [...prev, newPath]);

      // reset form fields after successful submission
      setTopic("");
      setProficiency("beginner");
      setLearningType(["video"]);
      setWeeks(1);
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full py-20 gap-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* CREATE FORM  */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        {/* topic input */}
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic"
          className="border px-3 py-2 rounded"
        />

        {/* difficulty level */}
        <select
          value={proficiency}
          onChange={(e) => setProficiency(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* content type selection (only one for now) */}
        <select
          onChange={(e) => setLearningType([e.target.value])}
          className="border px-3 py-2 rounded"
        >
          <option value="video">Video</option>
          <option value="article">Article</option>
          <option value="course">Course</option>
        </select>

        {/* number of weeks */}
        <input
          type="number"
          value={weeks}
          onChange={(e) => setWeeks(Number(e.target.value))}
          min={1}
          className="border px-3 py-2 rounded"
        />

        {/* submit button */}
        <button
          onClick={createLearningPath}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Learning Path
        </button>
      </div>

      {/* LOAD BUTTON  */}
      <button
        onClick={loadPaths}
        className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800"
      >
        Load My Learning Paths
      </button>

      {/* simple loading indicator */}
      {isLoading && <span>Loading...</span>}

      {/*  RESULTS LIST */}
      <section className="w-full max-w-xl space-y-4">
        {learningPaths.map((item, i) => (
          <article
            key={i}
            className="p-4 border rounded-lg shadow transition hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold">
              Learning Path #{i + 1}
            </h2>

            {/* fallback in case topic is missing */}
            <p className="text-sm text-gray-600">
              {item.topic ?? "No topic provided"}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}