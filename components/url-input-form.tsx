"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isValidYouTubeUrl } from "@/lib/youtube-client"

interface UrlInputFormProps {
  onSubmit: (url: string) => void
  isLoading?: boolean
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    if (!isValidYouTubeUrl(url.trim())) {
      setError("Please enter a valid YouTube URL")
      return
    }

    onSubmit(url.trim())
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="glass-card rounded-2xl p-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Paste YouTube URL here..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError("")
              }}
              className="h-14 rounded-xl border-0 bg-transparent pl-12 text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14 rounded-xl px-8 gradient-bg-vibrant hover:opacity-90 transition-opacity glow text-white border-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Get Video
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
    </motion.form>
  )
}
