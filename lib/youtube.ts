import ytdl from "@distube/ytdl-core"

export interface VideoInfo {
  id: string
  title: string
  thumbnail: string
  duration: number
  author: string
  qualities: VideoQuality[]
}

export interface VideoQuality {
  itag: number
  quality: string
  format: string
  hasAudio: boolean
  hasVideo: boolean
}

/**
 * Parse YouTube URL and extract video ID
 */
export function parseYouTubeUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

/**
 * Validate YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return parseYouTubeUrl(url) !== null
}

/**
 * Get video info using noembed (no API key needed)
 */
export async function getVideoInfoFromNoembed(
  videoId: string
): Promise<{ title: string; thumbnail: string; author: string } | null> {
  try {
    const response = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    )
    const data = await response.json()

    if (data.error) {
      return null
    }

    return {
      title: data.title || "Unknown Title",
      thumbnail:
        data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      author: data.author_name || "Unknown Author",
    }
  } catch {
    return null
  }
}

/**
 * Get full video info including available formats using ytdl-core
 */
export async function getVideoInfo(videoId: string): Promise<VideoInfo | null> {
  try {
    const info = await ytdl.getInfo(videoId)

    const qualities: VideoQuality[] = info.formats
      .filter((f) => f.hasVideo || f.hasAudio)
      .map((f) => ({
        itag: f.itag,
        quality: f.qualityLabel || f.audioBitrate?.toString() || "unknown",
        format: f.container || "mp4",
        hasAudio: f.hasAudio,
        hasVideo: f.hasVideo,
      }))
      .filter(
        (q, i, arr) =>
          arr.findIndex((x) => x.quality === q.quality && x.format === q.format) === i
      )

    const durationSeconds = parseInt(info.videoDetails.lengthSeconds, 10)

    return {
      id: videoId,
      title: info.videoDetails.title,
      thumbnail:
        info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: durationSeconds,
      author: info.videoDetails.author.name,
      qualities,
    }
  } catch (error) {
    console.error("Error fetching video info:", error)

    // Fallback to noembed
    const noembedInfo = await getVideoInfoFromNoembed(videoId)
    if (noembedInfo) {
      return {
        id: videoId,
        title: noembedInfo.title,
        thumbnail: noembedInfo.thumbnail,
        duration: 0,
        author: noembedInfo.author,
        qualities: [],
      }
    }

    return null
  }
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 */
export function parseTimeToSeconds(time: string): number {
  const parts = time.split(":").map(Number)

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }

  return parseInt(time, 10) || 0
}
