"use client"

import { motion } from "framer-motion"
import { Zap, Shield, Smartphone, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Our optimized processing ensures your clips are ready in seconds, not minutes.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your clips are automatically deleted after 24 hours. No data is stored permanently.",
    gradient: "from-emerald-400 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description:
      "Fully responsive design works perfectly on desktop, tablet, and mobile devices.",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    icon: Clock,
    title: "No Registration",
    description:
      "Start trimming immediately. No account creation or sign-up required.",
    gradient: "from-pink-400 to-rose-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 gradient-bg-subtle" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Why Choose <span className="gradient-text">ClipTrim</span>?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Built with simplicity and performance in mind, ClipTrim offers
            everything you need to create perfect video clips.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group glass-card h-full rounded-3xl p-8 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
                <div className="flex gap-6">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
