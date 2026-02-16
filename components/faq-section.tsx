"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is ClipTrim free to use?",
    answer:
      "Yes, ClipTrim is completely free to use. There are no hidden fees, subscriptions, or premium tiers. You can create unlimited clips without paying anything.",
  },
  {
    question: "What is the maximum clip duration?",
    answer:
      "You can create clips up to 10 minutes long. This limit helps ensure fast processing times and keeps the service running smoothly for everyone.",
  },
  {
    question: "What formats are supported?",
    answer:
      "ClipTrim supports MP4 and WebM for video clips, and MP3 and M4A for audio-only clips. MP4 is recommended for maximum compatibility across devices and platforms.",
  },
  {
    question: "How long are clips stored?",
    answer:
      "Clips are automatically deleted after 24 hours. Make sure to download your clip before it expires. We don't store any clips permanently.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No, ClipTrim works entirely in your browser. All processing happens on our servers, so you don't need to install anything on your device.",
  },
  {
    question: "Can I use ClipTrim on mobile?",
    answer:
      "Yes! ClipTrim is fully responsive and works great on smartphones and tablets. Simply visit the website from your mobile browser.",
  },
  {
    question: "Is there a registration required?",
    answer:
      "No registration is required. You can start trimming videos immediately without creating an account or providing any personal information.",
  },
  {
    question: "What if the video is unavailable or private?",
    answer:
      "ClipTrim can only access publicly available YouTube videos. Private videos, age-restricted content, or videos that are unavailable in your region cannot be processed.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
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
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers. Here are the most common
            questions about ClipTrim.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border-white/10"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5 text-base font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
