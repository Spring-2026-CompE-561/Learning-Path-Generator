"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// week starts on monday so that the weekend sits at the end
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// shape of one session shown in the calendar
type ScheduledPath = {
  id: number;
  topic: string;
  task: string;
  weekNumber: number;
  totalWeeks: number;
  completed?: boolean;
};

// fake data for now, swap with the api response later
// keys are day names so we can look up by day at render time
const placeholderSchedule: Record<string, ScheduledPath[]> = {
  Monday: [
    {
      id: 1,
      topic: "React Fundamentals",
      task: "Watch hooks deep dive video",
      weekNumber: 2,
      totalWeeks: 8,
      completed: true,
    },
    {
      id: 2,
      topic: "Intro to SQL",
      task: "Practice SELECT and WHERE clauses",
      weekNumber: 3,
      totalWeeks: 6,
    },
  ],
  Tuesday: [
    {
      id: 3,
      topic: "Python for Data Science",
      task: "Read pandas DataFrame intro",
      weekNumber: 1,
      totalWeeks: 10,
    },
  ],
  Wednesday: [
    {
      id: 1,
      topic: "React Fundamentals",
      task: "Build a counter with useState",
      weekNumber: 2,
      totalWeeks: 8,
    },
    {
      id: 4,
      topic: "System Design Basics",
      task: "Read about load balancing",
      weekNumber: 4,
      totalWeeks: 12,
      completed: true,
    },
  ],
  Thursday: [
    {
      id: 2,
      topic: "Intro to SQL",
      task: "JOIN exercises on practice DB",
      weekNumber: 3,
      totalWeeks: 6,
    },
  ],
  Friday: [
    {
      id: 3,
      topic: "Python for Data Science",
      task: "Notebook walkthrough on matplotlib",
      weekNumber: 1,
      totalWeeks: 10,
    },
    {
      id: 4,
      topic: "System Design Basics",
      task: "Sketch a URL shortener design",
      weekNumber: 4,
      totalWeeks: 12,
    },
  ],
  Saturday: [
    {
      id: 1,
      topic: "React Fundamentals",
      task: "Mini project: todo app",
      weekNumber: 2,
      totalWeeks: 8,
    },
  ],
  Sunday: [],
};

// each entry pairs the card styling with a matching progress bar fill
// each path gets one entry, picked at random on mount
const colorPalette = [
  { card: "border-l-emerald-500 bg-emerald-50/70", fill: "bg-emerald-500" },
  { card: "border-l-sky-500 bg-sky-50/70", fill: "bg-sky-500" },
  { card: "border-l-violet-500 bg-violet-50/70", fill: "bg-violet-500" },
  { card: "border-l-amber-500 bg-amber-50/70", fill: "bg-amber-500" },
  { card: "border-l-rose-500 bg-rose-50/70", fill: "bg-rose-500" },
  { card: "border-l-teal-500 bg-teal-50/70", fill: "bg-teal-500" },
];

// shown for the brief moment before the shuffle effect runs
const fallbackColor = {
  card: "border-l-gray-300 bg-white",
  fill: "bg-gray-400",
};

// rotating subtitle, one is picked on every fresh mount
const subtitlePhrases = [
  "Your week at a glance.",
  "Here's what's on deck.",
  "Plan, learn, repeat.",
  "Your roadmap for the week.",
  "Time to level up.",
  "What's brewing this week.",
  "Stay sharp, here's the lineup.",
  "Knowledge incoming.",
  "Let's get after it.",
  "One step closer this week.",
];

// fisher yates, used so each path gets a unique color when there are six or fewer paths
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Schedule() {
  const router = useRouter();

  // name of the current weekday, used to highlight the matching column
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // every distinct path id that appears anywhere in the schedule
  // sorted so the color assignment stays stable across days
  const uniquePathIds = React.useMemo(
    () =>
      Array.from(
        new Set(
          Object.values(placeholderSchedule).flatMap((items) =>
            items.map((i) => i.id)
          )
        )
      ).sort((a, b) => a - b),
    []
  );

  // path id to color mapping, filled in by the effect below
  const [colorMap, setColorMap] = React.useState<
    Record<number, (typeof colorPalette)[number]>
  >({});

  // start with the first phrase so server and client render the same html
  // the effect swaps in a random pick right after hydration
  const [subtitle, setSubtitle] = React.useState(subtitlePhrases[0]);

  // runs once after mount, sets up colors and the rotating subtitle
  React.useEffect(() => {
    const shuffled = shuffle(colorPalette);
    const map: Record<number, (typeof colorPalette)[number]> = {};
    uniquePathIds.forEach((id, idx) => {
      // modulo so we recycle colors when there are more paths than palette entries
      map[id] = shuffled[idx % shuffled.length];
    });
    setColorMap(map);

    setSubtitle(
      subtitlePhrases[Math.floor(Math.random() * subtitlePhrases.length)]
    );
  }, [uniquePathIds]);

  // tiny helper so the JSX below stays readable
  const colorFor = (id: number) => colorMap[id] ?? fallbackColor;

  return (
    <div className="relative min-h-screen w-full p-8">
      {/* page heading, matches dashboard typography */}
      <h1 className="text-2xl font-bold">Schedule</h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

      {/* one column per day at desktop, collapses to two then one on smaller screens */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day, idx) => {
          const items = placeholderSchedule[day] ?? [];
          const isToday = day === today;
          const isLast = idx === days.length - 1;

          return (
            <div
              key={day}
              className={cn(
                "flex flex-col gap-3 px-3 py-3",
                // vertical divider between columns at desktop, skipped on the last one
                !isLast && "lg:border-r lg:border-border",
                // soft tint on the column that represents today
                isToday && "bg-primary/5 rounded-xl"
              )}
            >
              {/* day name with the small today pill when this column is the current day */}
              <div className="flex items-baseline gap-2">
                <h2
                  className={cn(
                    "text-lg font-semibold",
                    isToday && "text-primary"
                  )}
                >
                  {day}
                </h2>
                {isToday && (
                  <span className="text-xs font-medium text-primary">
                    Today
                  </span>
                )}
              </div>

              {items.length === 0 ? (
                // shown when no sessions are scheduled for the day
                <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center">
                  <p className="text-sm text-gray-400">Rest day</p>
                </div>
              ) : (
                items.map((path) => {
                  // same path id resolves to the same color across every day
                  const color = colorFor(path.id);
                  // clamp to 100 so an off by one in real data does not break the bar
                  const pct = Math.min(
                    100,
                    Math.round((path.weekNumber / path.totalWeeks) * 100)
                  );

                  return (
                    // clicking a card jumps to the learning path detail page
                    <div
                      key={`${day}-${path.id}`}
                      onClick={() => router.push(`/learning-path/${path.id}`)}
                      className={cn(
                        "p-4 border border-l-4 rounded-xl shadow hover:shadow-md transition cursor-pointer",
                        color.card,
                        // faded look when the session is already done
                        path.completed && "opacity-60"
                      )}
                    >
                      {/* topic title with a check icon when the session is complete */}
                      <div className="flex items-start gap-1.5">
                        <h3
                          className="text-base font-semibold text-gray-900 truncate flex-1"
                          title={path.topic}
                        >
                          {path.topic}
                        </h3>
                        {path.completed && (
                          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                        )}
                      </div>

                      {/* what to study today, struck through when it has been done */}
                      <p
                        className={cn(
                          "mt-1 text-sm text-gray-600",
                          path.completed && "line-through"
                        )}
                      >
                        {path.task}
                      </p>

                      {/* week label and progress bar */}
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">
                          Week {path.weekNumber} of {path.totalWeeks}
                        </p>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          {/* fill width tracks how far along the user is in the path */}
                          <div
                            className={cn("h-full rounded-full", color.fill)}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
