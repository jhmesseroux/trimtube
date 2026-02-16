"use client"

import { motion } from "framer-motion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

export type VideoQuality = "360p" | "720p" | "1080p" | "4k"

interface QualitySelectorProps {
  quality: VideoQuality
  onQualityChange: (quality: VideoQuality) => void
  disabled?: boolean
}

const qualities: { value: VideoQuality; label: string; badge?: string }[] = [
  { value: "360p", label: "360p SD" },
  { value: "720p", label: "720p HD" },
  { value: "1080p", label: "1080p Full HD", badge: "Popular" },
  { value: "4k", label: "4K Ultra HD", badge: "Best" },
]

export function QualitySelector({
  quality,
  onQualityChange,
  disabled,
}: QualitySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <Label className="text-base font-semibold">Quality</Label>
      <Select
        value={quality}
        onValueChange={(v) => onQualityChange(v as VideoQuality)}
        disabled={disabled}
      >
        <SelectTrigger className="h-14 rounded-2xl glass border-white/20 text-base">
          <SelectValue placeholder="Select quality" />
        </SelectTrigger>
        <SelectContent className="rounded-xl glass-strong border-white/20">
          {qualities.map(({ value, label, badge }) => (
            <SelectItem
              key={value}
              value={value}
              className="rounded-lg py-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{label}</span>
                {badge && (
                  <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3" />
                    {badge}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {disabled && (
        <p className="text-sm text-muted-foreground">
          Quality selection is disabled for audio-only formats
        </p>
      )}
    </motion.div>
  )
}
