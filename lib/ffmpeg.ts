import ffmpeg from "fluent-ffmpeg"
import path from "path"
import { promisify } from "util"
import { exec } from "child_process"

const execAsync = promisify(exec)

export type OutputFormat = "mp4" | "webm" | "mp3" | "m4a"

export interface TrimOptions {
  inputPath: string
  outputPath: string
  startTime: number
  endTime: number
  format?: OutputFormat
}

/**
 * Check if FFmpeg is installed
 */
export async function checkFfmpeg(): Promise<boolean> {
  try {
    await execAsync("ffmpeg -version")
    return true
  } catch {
    return false
  }
}

/**
 * Get the duration of a video file
 */
export function getVideoDuration(inputPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err)
        return
      }
      resolve(metadata.format.duration || 0)
    })
  })
}

/**
 * Trim video/audio file
 */
export function trimVideo({
  inputPath,
  outputPath,
  startTime,
  endTime,
  format = "mp4",
}: TrimOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const duration = endTime - startTime

    let command = ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(outputPath)

    // Format-specific settings
    switch (format) {
      case "mp4":
        command = command
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions(["-movflags", "+faststart"])
        break
      case "webm":
        command = command.videoCodec("libvpx-vp9").audioCodec("libopus")
        break
      case "mp3":
        command = command.noVideo().audioCodec("libmp3lame").audioBitrate("192k")
        break
      case "m4a":
        command = command.noVideo().audioCodec("aac").audioBitrate("192k")
        break
    }

    command
      .on("start", (commandLine) => {
        console.log("FFmpeg started:", commandLine)
      })
      .on("progress", (progress) => {
        console.log(`Processing: ${progress.percent?.toFixed(1)}%`)
      })
      .on("end", () => {
        console.log("Processing finished")
        resolve()
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err)
        reject(err)
      })
      .run()
  })
}

/**
 * Get output file extension based on format
 */
export function getFileExtension(format: OutputFormat): string {
  return `.${format}`
}

/**
 * Get MIME type based on format
 */
export function getMimeType(format: OutputFormat): string {
  const mimeTypes: Record<OutputFormat, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
  }
  return mimeTypes[format]
}
