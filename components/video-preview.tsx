"use client"

import { motion } from "framer-motion"
import { Clock, User, Play } from "lucide-react"
import { formatDuration } from "@/lib/youtube-client"

interface VideoPreviewProps {
  title: string
  thumbnail: string
  duration: number
  author: string
}

export function VideoPreview({
  title,
  thumbnail,
  duration,
  author,
}: VideoPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-5 md:flex-row"
    >
      <div className="group relative aspect-video w-full overflow-hidden rounded-2xl md:w-72 shadow-lg">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Play className="h-6 w-6 text-white fill-white" />
          </div>
        </div>

        {duration > 0 && (
          <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 backdrop-blur-sm px-2.5 py-1 text-sm font-semibold text-white">
            {formatDuration(duration)}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="line-clamp-2 text-xl font-bold leading-tight mb-3">{title}</h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
            <User className="h-4 w-4" />
            {author}
          </span>
          {duration > 0 && (
            <span className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
              <Clock className="h-4 w-4" />
              {formatDuration(duration)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
