import { NextRequest, NextResponse } from "next/server"
import ytdl from "@distube/ytdl-core"
import fs from "fs"
import { parseYouTubeUrl } from "@/lib/youtube"
import { trimVideo, checkFfmpeg, getFileExtension, type OutputFormat } from "@/lib/ffmpeg"
import {
  createClipId,
  getClipPath,
  getTempFilePath,
  saveClipMetadata,
  updateClipStatus,
  getClipDownloadUrl,
  cleanupOldClips,
} from "@/lib/clip-store"

export async function POST(request: NextRequest) {
  try {
    // Clean up old clips periodically
    cleanupOldClips()

    const body = await request.json()
    const { videoUrl, startTime, endTime, format = "mp4", quality = "highest" } = body

    // Validate input
    if (!videoUrl) {
      return NextResponse.json({ error: "videoUrl is required" }, { status: 400 })
    }

    if (typeof startTime !== "number" || typeof endTime !== "number") {
      return NextResponse.json(
        { error: "startTime and endTime must be numbers" },
        { status: 400 }
      )
    }

    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "startTime must be less than endTime" },
        { status: 400 }
      )
    }

    if (endTime - startTime > 600) {
      return NextResponse.json(
        { error: "Clip duration cannot exceed 10 minutes" },
        { status: 400 }
      )
    }

    const videoId = parseYouTubeUrl(videoUrl)
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    // Check FFmpeg
    const ffmpegAvailable = await checkFfmpeg()
    if (!ffmpegAvailable) {
      return NextResponse.json(
        { error: "FFmpeg is not installed on the server" },
        { status: 500 }
      )
    }

    // Create clip ID and paths
    const clipId = createClipId()
    const extension = getFileExtension(format as OutputFormat)
    const tempPath = getTempFilePath(clipId)
    const outputPath = getClipPath(clipId, extension)

    // Get video info for metadata
    let videoTitle = "YouTube Video"
    try {
      const info = await ytdl.getInfo(videoId)
      videoTitle = info.videoDetails.title
    } catch {
      // Continue with default title
    }

    // Save initial metadata
    saveClipMetadata({
      id: clipId,
      videoId,
      title: videoTitle,
      startTime,
      endTime,
      format,
      quality,
      createdAt: Date.now(),
      filePath: outputPath,
      status: "processing",
    })

    // Download video
    try {
      updateClipStatus(clipId, "processing")

      // Determine quality filter
      const qualityFilter = getQualityFilter(quality, format as OutputFormat)

      await new Promise<void>((resolve, reject) => {
        const stream = ytdl(videoId, qualityFilter)
        const fileStream = fs.createWriteStream(tempPath)

        stream.pipe(fileStream)
        stream.on("error", reject)
        fileStream.on("finish", resolve)
        fileStream.on("error", reject)
      })

      // Trim the video
      await trimVideo({
        inputPath: tempPath,
        outputPath,
        startTime,
        endTime,
        format: format as OutputFormat,
      })

      // Clean up temp file
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }

      updateClipStatus(clipId, "completed")

      return NextResponse.json({
        clipId,
        status: "completed",
        downloadUrl: getClipDownloadUrl(clipId),
      })
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath)
      }

      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      updateClipStatus(clipId, "error", errorMessage)

      return NextResponse.json(
        { error: `Failed to process video: ${errorMessage}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Create clip error:", error)
    return NextResponse.json(
      { error: "Failed to create clip" },
      { status: 500 }
    )
  }
}

function getQualityFilter(quality: string, format: OutputFormat): ytdl.downloadOptions {
  const isAudioOnly = format === "mp3" || format === "m4a"

  if (isAudioOnly) {
    return { filter: "audioonly", quality: "highestaudio" }
  }

  switch (quality) {
    case "360p":
      return { filter: "videoandaudio", quality: "lowest" }
    case "720p":
      return { filter: "videoandaudio", quality: "highest" }
    case "1080p":
    case "4k":
      return { filter: "videoandaudio", quality: "highestvideo" }
    default:
      return { filter: "videoandaudio", quality: "highest" }
  }
}
