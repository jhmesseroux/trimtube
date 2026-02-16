import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

const CLIPS_DIR = path.join(process.cwd(), "public", "clips")
const CLIP_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

export interface ClipMetadata {
  id: string
  videoId: string
  title: string
  startTime: number
  endTime: number
  format: string
  quality: string
  createdAt: number
  filePath: string
  status: "pending" | "processing" | "completed" | "error"
  error?: string
}

/**
 * Ensure the clips directory exists
 */
export function ensureClipsDir(): void {
  if (!fs.existsSync(CLIPS_DIR)) {
    fs.mkdirSync(CLIPS_DIR, { recursive: true })
  }
}

/**
 * Generate a unique clip ID
 */
export function createClipId(): string {
  return uuidv4()
}

/**
 * Get the file path for a clip
 */
export function getClipPath(clipId: string, extension: string): string {
  ensureClipsDir()
  return path.join(CLIPS_DIR, `${clipId}${extension}`)
}

/**
 * Get the download URL for a clip
 */
export function getClipDownloadUrl(clipId: string): string {
  return `/api/download/${clipId}`
}

/**
 * Save clip metadata
 */
export function saveClipMetadata(metadata: ClipMetadata): void {
  ensureClipsDir()
  const metadataPath = path.join(CLIPS_DIR, `${metadata.id}.json`)
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))
}

/**
 * Get clip metadata
 */
export function getClipMetadata(clipId: string): ClipMetadata | null {
  const metadataPath = path.join(CLIPS_DIR, `${clipId}.json`)
  if (!fs.existsSync(metadataPath)) {
    return null
  }
  try {
    const data = fs.readFileSync(metadataPath, "utf-8")
    return JSON.parse(data) as ClipMetadata
  } catch {
    return null
  }
}

/**
 * Update clip status
 */
export function updateClipStatus(
  clipId: string,
  status: ClipMetadata["status"],
  error?: string
): void {
  const metadata = getClipMetadata(clipId)
  if (metadata) {
    metadata.status = status
    if (error) {
      metadata.error = error
    }
    saveClipMetadata(metadata)
  }
}

/**
 * Delete a clip and its metadata
 */
export function deleteClip(clipId: string): void {
  const metadata = getClipMetadata(clipId)
  if (metadata?.filePath && fs.existsSync(metadata.filePath)) {
    fs.unlinkSync(metadata.filePath)
  }
  const metadataPath = path.join(CLIPS_DIR, `${clipId}.json`)
  if (fs.existsSync(metadataPath)) {
    fs.unlinkSync(metadataPath)
  }
}

/**
 * Clean up clips older than 24 hours
 */
export function cleanupOldClips(): number {
  ensureClipsDir()

  let deletedCount = 0
  const now = Date.now()
  const files = fs.readdirSync(CLIPS_DIR)

  for (const file of files) {
    if (file.endsWith(".json")) {
      const clipId = file.replace(".json", "")
      const metadata = getClipMetadata(clipId)

      if (metadata && now - metadata.createdAt > CLIP_EXPIRY_MS) {
        deleteClip(clipId)
        deletedCount++
      }
    }
  }

  return deletedCount
}

/**
 * Get all clips (for admin purposes)
 */
export function getAllClips(): ClipMetadata[] {
  ensureClipsDir()

  const clips: ClipMetadata[] = []
  const files = fs.readdirSync(CLIPS_DIR)

  for (const file of files) {
    if (file.endsWith(".json")) {
      const clipId = file.replace(".json", "")
      const metadata = getClipMetadata(clipId)
      if (metadata) {
        clips.push(metadata)
      }
    }
  }

  return clips.sort((a, b) => b.createdAt - a.createdAt)
}

/**
 * Get temporary file path for downloading video
 */
export function getTempFilePath(clipId: string): string {
  ensureClipsDir()
  return path.join(CLIPS_DIR, `${clipId}_temp.mp4`)
}
