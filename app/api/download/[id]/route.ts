import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getClipMetadata } from "@/lib/clip-store"
import { getMimeType, type OutputFormat } from "@/lib/ffmpeg"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: clipId } = await params

  if (!clipId) {
    return NextResponse.json({ error: "Clip ID is required" }, { status: 400 })
  }

  const metadata = getClipMetadata(clipId)

  if (!metadata) {
    return NextResponse.json({ error: "Clip not found" }, { status: 404 })
  }

  if (metadata.status !== "completed") {
    return NextResponse.json(
      { error: `Clip is ${metadata.status}`, status: metadata.status },
      { status: 400 }
    )
  }

  const filePath = metadata.filePath

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Clip file not found" }, { status: 404 })
  }

  try {
    const fileBuffer = fs.readFileSync(filePath)
    const mimeType = getMimeType(metadata.format as OutputFormat)

    // Sanitize filename for Content-Disposition
    const sanitizedTitle = metadata.title
      .replace(/[^a-zA-Z0-9\s\-_.]/g, "")
      .substring(0, 100)
    const filename = `${sanitizedTitle}_clip.${metadata.format}`

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to download clip" }, { status: 500 })
  }
}
