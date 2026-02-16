"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"
import { formatDuration, parseTimeToSeconds } from "@/lib/youtube-client"

interface TimeRangeSelectorProps {
  duration: number
  startTime: number
  endTime: number
  onStartTimeChange: (time: number) => void
  onEndTimeChange: (time: number) => void
}

export function TimeRangeSelector({
  duration,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: TimeRangeSelectorProps) {
  const [startInput, setStartInput] = useState(formatDuration(startTime))
  const [endInput, setEndInput] = useState(formatDuration(endTime))

  useEffect(() => {
    setStartInput(formatDuration(startTime))
  }, [startTime])

  useEffect(() => {
    setEndInput(formatDuration(endTime))
  }, [endTime])

  const handleSliderChange = (values: number[]) => {
    onStartTimeChange(values[0])
    onEndTimeChange(values[1])
  }

  const handleStartInputBlur = () => {
    const seconds = parseTimeToSeconds(startInput)
    const clampedValue = Math.min(Math.max(0, seconds), endTime - 1)
    onStartTimeChange(clampedValue)
    setStartInput(formatDuration(clampedValue))
  }

  const handleEndInputBlur = () => {
    const seconds = parseTimeToSeconds(endInput)
    const clampedValue = Math.min(Math.max(startTime + 1, seconds), duration)
    onEndTimeChange(clampedValue)
    setEndInput(formatDuration(clampedValue))
  }

  const clipDuration = endTime - startTime

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <Label className="text-base font-semibold">Clip Range</Label>

        {/* Slider */}
        <div className="px-1 py-2">
          <Slider
            value={[startTime, endTime]}
            min={0}
            max={duration}
            step={1}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>

        {/* Time labels */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatDuration(0)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Time inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time" className="text-sm font-medium">
            Start Time
          </Label>
          <Input
            id="start-time"
            value={startInput}
            onChange={(e) => setStartInput(e.target.value)}
            onBlur={handleStartInputBlur}
            onKeyDown={(e) => e.key === "Enter" && handleStartInputBlur()}
            placeholder="0:00"
            className="h-12 rounded-xl glass border-white/20 text-center text-lg font-semibold"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time" className="text-sm font-medium">
            End Time
          </Label>
          <Input
            id="end-time"
            value={endInput}
            onChange={(e) => setEndInput(e.target.value)}
            onBlur={handleEndInputBlur}
            onKeyDown={(e) => e.key === "Enter" && handleEndInputBlur()}
            placeholder={formatDuration(duration)}
            className="h-12 rounded-xl glass border-white/20 text-center text-lg font-semibold"
          />
        </div>
      </div>

      {/* Clip duration info */}
      <div className="flex items-center justify-center gap-3 rounded-2xl glass p-4">
        <Clock className="h-5 w-5 text-violet-500" />
        <p className="text-base">
          Clip duration:{" "}
          <span className="font-bold gradient-text">
            {formatDuration(clipDuration)}
          </span>
        </p>
        {clipDuration > 600 && (
          <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            Max 10 min
          </span>
        )}
      </div>
    </motion.div>
  )
}
