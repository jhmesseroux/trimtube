"use client"

import { motion } from "framer-motion"

const useCases = [
  { text: "Create Social Media Clips", color: "from-violet-500 to-purple-600" },
  { text: "Extract Music Segments", color: "from-fuchsia-500 to-pink-600" },
  { text: "Save Podcast Highlights", color: "from-cyan-500 to-blue-600" },
  { text: "Capture Tutorial Moments", color: "from-emerald-500 to-teal-600" },
  { text: "Make Reaction Clips", color: "from-amber-500 to-orange-600" },
  { text: "Share Sports Highlights", color: "from-rose-500 to-red-600" },
  { text: "Save Comedy Bits", color: "from-indigo-500 to-violet-600" },
  { text: "Create Study Notes", color: "from-sky-500 to-cyan-600" },
  { text: "Extract Interview Segments", color: "from-pink-500 to-fuchsia-600" },
  { text: "Make Compilation Videos", color: "from-lime-500 to-green-600" },
  { text: "Save News Clips", color: "from-blue-500 to-indigo-600" },
  { text: "Create Memes", color: "from-orange-500 to-amber-600" },
]

export function UseCasesSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Perfect <span className="gradient-text">For</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Whether you&apos;re a content creator, student, or just want to save
            your favorite moments, ClipTrim has you covered.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.text}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div
                className={`cursor-default rounded-full bg-gradient-to-r ${useCase.color} px-6 py-3 text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl`}
              >
                {useCase.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
