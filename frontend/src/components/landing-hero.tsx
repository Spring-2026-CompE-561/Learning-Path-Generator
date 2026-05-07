"use client"

import * as React from "react"
import { Sparkles, ArrowRight, Play } from "lucide-react"
import { Meteors } from "@/components/ui/meteors"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// pre-canned outline used in the sample plan section below the hero
type WeekPlan = { week: number; title: string; bullets: string[] }
type Outline = { topic: string; weeks: WeekPlan[] }

const sampleOutline: Outline = {
  topic: "Sample: Python for data analysis",
  weeks: [
    { week: 1, title: "Setup & syntax", bullets: ["Install Python + Jupyter", "Lists, dicts, comprehensions"] },
    { week: 2, title: "NumPy & pandas", bullets: ["DataFrames, indexing, joins", "Cleaning a real dataset"] },
    { week: 3, title: "Visualization", bullets: ["matplotlib + seaborn basics", "Build a one-page report"] },
  ],
}

// types `text` one char at a time
function useTypedText(text: string, speed = 22, run: boolean) {
  const [typed, setTyped] = React.useState("")
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (!run) return
    setTyped("")
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, run])

  return { typed, done }
}

// renders the typing for one week, advances through the outline
function ResultCard({ outline }: { outline: Outline }) {
  const [activeIdx, setActiveIdx] = React.useState(0)
  const current = outline.weeks[activeIdx]

  const titleText = current ? `Week ${current.week}: ${current.title}` : ""
  const { typed: typedTitle, done: titleDone } = useTypedText(titleText, 22, !!current)

  const [bulletsShown, setBulletsShown] = React.useState(0)

  React.useEffect(() => {
    setBulletsShown(0)
  }, [activeIdx, outline])

  React.useEffect(() => {
    if (!titleDone || !current) return
    if (bulletsShown >= current.bullets.length) {
      const id = setTimeout(() => setActiveIdx((i) => i + 1), 600)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => setBulletsShown((n) => n + 1), 350)
    return () => clearTimeout(id)
  }, [titleDone, bulletsShown, current])

  React.useEffect(() => {
    setActiveIdx(0)
    setBulletsShown(0)
  }, [outline])

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs uppercase tracking-wider text-slate-400">{outline.topic}</div>
      {outline.weeks.map((w, idx) => {
        if (idx > activeIdx) return null
        const isActive = idx === activeIdx
        const isPast = idx < activeIdx
        const titleDisplay = isActive ? typedTitle : `Week ${w.week}: ${w.title}`
        const cursor = isActive && !titleDone ? "▍" : ""
        const bulletCount = isActive ? bulletsShown : w.bullets.length

        return (
          <div
            key={`${outline.topic}-${w.week}`}
            className={cn(
              "rounded-lg border border-white/10 bg-white/5 p-4 transition-opacity",
              isPast && "opacity-70"
            )}
          >
            <div className="font-semibold text-white">
              {titleDisplay}
              <span className="text-sky-300">{cursor}</span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              {w.bullets.slice(0, bulletCount).map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-sky-400">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export function LandingHero() {
  const sampleRef = React.useRef<HTMLDivElement>(null)

  // primary CTA → tells the Header to open the signup dialog via custom event
  // (Header listens for "open-signup" in a useEffect)
  function handleGenerate() {
    window.dispatchEvent(new Event("open-signup"))
  }

  // secondary CTA → scrolls to the sample plan section below
  function handleSeeSample() {
    sampleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      {/* HERO — full-width dark backdrop with meteors behind centered content */}
      <section className="relative w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Meteors number={30} />
        </div>
        {/* soft blue/teal glow under the content for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-teal-500/10" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
          {/* pill badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span>AI-curated learning paths</span>
          </div>

          {/* headline split white + golden, mirroring the mockup */}
          <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl">
            Your goal. Your progress.<br />
            <span className="text-yellow-300">Powered by AI.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Tell us what you want to learn and we&apos;ll build a personalized
            week-by-week plan with curated resources for every stage.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGenerate}
              className={cn(
                "rounded-full bg-yellow-300 px-6 text-base font-semibold text-gray-900",
                "hover:bg-yellow-200 hover:text-gray-900",
                "shadow-[0_0_24px_rgba(247,203,45,0.4)] transition-shadow",
                "hover:shadow-[0_0_36px_rgba(247,203,45,0.65)]"
              )}
            >
              Generate my path
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleSeeSample}
              className="rounded-full border-white/20 bg-white/5 px-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Play className="mr-2 h-4 w-4 fill-white" />
              See a sample plan
            </Button>
          </div>
        </div>
      </section>

      {/* SAMPLE PLAN SECTION — scroll target for the secondary CTA */}
      <section ref={sampleRef} className="relative w-full bg-gray-900 px-6 py-20">
        {/* subtle gradient so the sample reads as a distinct section */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Sample plan, generating in real time
            </span>
          </div>
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            What a path looks like
          </h2>
          <p className="mb-10 text-center text-slate-400">
            A peek at the kind of week-by-week breakdown you&apos;ll get.
          </p>

          <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-6 backdrop-blur-md">
            <ResultCard outline={sampleOutline} />
          </div>
        </div>
      </section>
    </>
  )
}
