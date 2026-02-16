"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Download, Scissors, X, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoPreview } from "@/components/video-preview"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { FormatSelector, type OutputFormat } from "@/components/format-selector"
import { QualitySelector, type VideoQuality } from "@/components/quality-selector"
import { ClipProgress, type ClipStatus } from "@/components/clip-progress"
import type { VideoInfo } from "@/lib/youtube-client"

interface VideoEditorProps {
  videoInfo: VideoInfo
  videoUrl: string
  onClose: () => void
}

export function VideoEditor({ videoInfo, videoUrl, onClose }: VideoEditorProps) {
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(
    Math.min(videoInfo.duration || 60, 60)
  )
  const [format, setFormat] = useState<OutputFormat>("mp4")
  const [quality, setQuality] = useState<VideoQuality>("720p")
  const [status, setStatus] = useState<ClipStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")

  const isAudioOnly = format === "mp3" || format === "m4a"
  const clipDuration = endTime - startTime
  const isValidDuration = clipDuration > 0 && clipDuration <= 600

  const resetClipState = () => {
    if (status === "completed" || status === "error") {
      setStatus("idle")
      setDownloadUrl("")
      setError("")
      setProgress(0)
    }
  }

  const handleFormatChange = (newFormat: OutputFormat) => {
    setFormat(newFormat)
    resetClipState()
  }

  const handleQualityChange = (newQuality: VideoQuality) => {
    setQuality(newQuality)
    resetClipState()
  }

  const handleStartTimeChange = (time: number) => {
    setStartTime(time)
    resetClipState()
  }

  const handleEndTimeChange = (time: number) => {
    setEndTime(time)
    resetClipState()
  }

  const handlePreview = () => {
    const youtubeUrl = `https://www.youtube.com/embed/${videoInfo.id}?start=${startTime}&end=${endTime}&autoplay=1`
    window.open(youtubeUrl, "_blank")
  }

  const handleCreateClip = async () => {
    if (!isValidDuration) return

    setStatus("processing")
    setProgress(0)
    setError("")
    setDownloadUrl("")

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 15, 90))
    }, 500)

    try {
      const response = await fetch("/api/create-clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          startTime,
          endTime,
          format,
          quality,
        }),
      })

      clearInterval(progressInterval)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create clip")
      }

      setProgress(100)
      setDownloadUrl(data.downloadUrl)
      setStatus("completed")
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "Failed to create clip")
      setStatus("error")
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg-vibrant">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Edit Your Clip</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Video Preview */}
          <VideoPreview
            title={videoInfo.title}
            thumbnail={videoInfo.thumbnail}
            duration={videoInfo.duration}
            author={videoInfo.author}
          />

          {/* Time Range Selector */}
          {videoInfo.duration > 0 && (
            <TimeRangeSelector
              duration={videoInfo.duration}
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
            />
          )}

          {/* Format and Quality */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormatSelector format={format} onFormatChange={handleFormatChange} />
            <QualitySelector
              quality={quality}
              onQualityChange={handleQualityChange}
              disabled={isAudioOnly}
            />
          </div>

          {/* Progress */}
          <ClipProgress status={status} progress={progress} error={error} />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={status === "processing"}
              className="rounded-xl h-12 px-6 glass border-white/20 hover:bg-white/10"
            >
              <Play className="mr-2 h-5 w-5" />
              Preview
            </Button>

            {status === "completed" && downloadUrl ? (
              <Button
                onClick={handleDownload}
                className="rounded-xl h-12 px-8 gradient-bg-vibrant hover:opacity-90 glow text-white border-0"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Clip
              </Button>
            ) : (
              <Button
                onClick={handleCreateClip}
                disabled={!isValidDuration || status === "processing"}
                className="rounded-xl h-12 px-8 gradient-bg-vibrant hover:opacity-90 glow text-white border-0 disabled:opacity-50"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Create Clip
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
