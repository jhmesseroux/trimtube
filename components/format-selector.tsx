"use client"

import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Video, Music } from "lucide-react"

export type OutputFormat = "mp4" | "webm" | "mp3" | "m4a"

interface FormatSelectorProps {
  format: OutputFormat
  onFormatChange: (format: OutputFormat) => void
}

const formats: { value: OutputFormat; label: string; icon: typeof Video }[] = [
  { value: "mp4", label: "MP4", icon: Video },
  { value: "webm", label: "WebM", icon: Video },
  { value: "mp3", label: "MP3", icon: Music },
  { value: "m4a", label: "M4A", icon: Music },
]

export function FormatSelector({ format, onFormatChange }: FormatSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <Label className="text-base font-semibold">Output Format</Label>
      <Tabs value={format} onValueChange={(v) => onFormatChange(v as OutputFormat)}>
        <TabsList className="grid w-full grid-cols-4 h-14 p-1.5 rounded-2xl glass">
          {formats.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-2 rounded-xl data-[state=active]:gradient-bg-vibrant data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-sm text-muted-foreground">
        {format === "mp3" || format === "m4a"
          ? "Audio only - perfect for music or podcasts"
          : "Video with audio - great for clips and sharing"}
      </p>
    </motion.div>
  )
}
