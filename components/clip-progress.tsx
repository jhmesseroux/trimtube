"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle2, XCircle, Sparkles } from "lucide-react"

export type ClipStatus = "idle" | "processing" | "completed" | "error"

interface ClipProgressProps {
  status: ClipStatus
  progress?: number
  error?: string
}

export function ClipProgress({ status, progress = 0, error }: ClipProgressProps) {
  if (status === "idle") return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {status === "processing" && (
        <div className="rounded-2xl glass p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg-vibrant">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
            <div>
              <p className="font-semibold">Creating your clip...</p>
              <p className="text-sm text-muted-foreground">
                This may take a minute depending on clip length
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-right text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      )}

      {status === "completed" && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              Clip ready for download!
            </p>
            <p className="text-sm text-muted-foreground">
              Click the download button to save your clip
            </p>
          </div>
          <Sparkles className="ml-auto h-5 w-5 text-emerald-500" />
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-500">
              <XCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-red-600 dark:text-red-400">
                Failed to create clip
              </p>
              {error && (
                <p className="text-sm text-muted-foreground">{error}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
