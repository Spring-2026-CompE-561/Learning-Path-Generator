import React from "react";
import { Meteors } from "./ui/meteors";

export function MeteorsDemo() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900">

      {/* background layer */}
      <div className="absolute inset-0">
        <Meteors number={40} />
      </div>

      {/* glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl opacity-40" />

      {/* content layer */}
      <div className="relative z-50 flex min-h-screen items-center justify-center">
        <div className="max-w-xl rounded-2xl bg-gray-900/80 p-8 backdrop-blur-md">

          <h1 className="mb-4 text-xl font-bold text-white">
            Meteors because they&apos;re cool
          </h1>

          <p className="text-slate-400">
            I don&apos;t know what to write so I&apos;ll just paste something cool here.
          </p>

        </div>
      </div>

    </div>
  );
}