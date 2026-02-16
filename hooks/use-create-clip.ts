"use client"

import { useState, useCallback } from "react"
import type { OutputFormat } from "@/components/format-selector"
import type { VideoQuality } from "@/components/quality-selector"

interface CreateClipOptions {
  videoUrl: string
  startTime: number
  endTime: number
  format: OutputFormat
  quality: VideoQuality
}

interface CreateClipResult {
  clipId: string
  status: "completed" | "error"
  downloadUrl: string
}

interface UseCreateClipResult {
  isProcessing: boolean
  progress: number
  error: string | null
  downloadUrl: string | null
  createClip: (options: CreateClipOptions) => Promise<CreateClipResult | null>
  reset: () => void
}

export function useCreateClip(): UseCreateClipResult {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const createClip = useCallback(
    async (options: CreateClipOptions): Promise<CreateClipResult | null> => {
      setIsProcessing(true)
      setProgress(0)
      setError(null)
      setDownloadUrl(null)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 10, 90))
      }, 500)

      try {
        const response = await fetch("/api/create-clip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(options),
        })

        clearInterval(progressInterval)

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create clip")
        }

        setProgress(100)
        setDownloadUrl(data.downloadUrl)

        return {
          clipId: data.clipId,
          status: "completed",
          downloadUrl: data.downloadUrl,
        }
      } catch (err) {
        clearInterval(progressInterval)
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  const reset = useCallback(() => {
    setIsProcessing(false)
    setProgress(0)
    setError(null)
    setDownloadUrl(null)
  }, [])

  return {
    isProcessing,
    progress,
    error,
    downloadUrl,
    createClip,
    reset,
  }
}
