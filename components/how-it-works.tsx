"use client"

import { motion } from "framer-motion"
import { Link2, Scissors, Settings, Download } from "lucide-react"

const steps = [
  {
    icon: Link2,
    title: "Paste URL",
    description: "Copy any YouTube video URL and paste it into ClipTrim",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Scissors,
    title: "Select Range",
    description: "Use the slider or input the exact start and end times",
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    icon: Settings,
    title: "Choose Format",
    description: "Select your preferred format and quality settings",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Download,
    title: "Download",
    description: "Click create and download your trimmed clip instantly",
    gradient: "from-emerald-500 to-teal-600",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Trimming YouTube videos has never been easier. Just four simple steps
            to get your perfect clip.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="group relative h-full">
                {/* Card */}
                <div className="glass-card h-full rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
