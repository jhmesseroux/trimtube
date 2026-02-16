"use client"

import { useState, useCallback } from "react"
import type { VideoInfo } from "@/lib/youtube-client"

interface UseVideoInfoResult {
  videoInfo: VideoInfo | null
  isLoading: boolean
  error: string | null
  fetchVideoInfo: (url: string) => Promise<void>
  reset: () => void
}

export function useVideoInfo(): UseVideoInfoResult {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVideoInfo = useCallback(async (url: string) => {
    setIsLoading(true)
    setError(null)
    setVideoInfo(null)

    try {
      const response = await fetch(
        `/api/video-info?url=${encodeURIComponent(url)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch video information")
      }

      setVideoInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setVideoInfo(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    videoInfo,
    isLoading,
    error,
    fetchVideoInfo,
    reset,
  }
}
