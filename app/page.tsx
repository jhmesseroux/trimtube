"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HeroSection } from "@/components/hero-section"
import { UrlInputForm } from "@/components/url-input-form"
import { VideoEditor } from "@/components/video-editor"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturesSection } from "@/components/features-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { FAQSection } from "@/components/faq-section"
import { useVideoInfo } from "@/hooks/use-video-info"

export default function Home() {
  const [currentUrl, setCurrentUrl] = useState("")
  const { videoInfo, isLoading, error, fetchVideoInfo, reset } = useVideoInfo()

  const handleUrlSubmit = async (url: string) => {
    setCurrentUrl(url)
    await fetchVideoInfo(url)
  }

  const handleEditorClose = () => {
    reset()
    setCurrentUrl("")
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section with URL Input */}
      <HeroSection>
        <UrlInputForm onSubmit={handleUrlSubmit} isLoading={isLoading} />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </HeroSection>

      {/* Video Editor - Shows when video is loaded */}
      <AnimatePresence mode="wait">
        {videoInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="container mx-auto px-4 pb-16"
          >
            <VideoEditor
              videoInfo={videoInfo}
              videoUrl={currentUrl}
              onClose={handleEditorClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing Page Sections */}
      <HowItWorks />
      <FeaturesSection />
      <UseCasesSection />
      <FAQSection />
    </div>
  )
}
