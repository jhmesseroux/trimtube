import { NextRequest, NextResponse } from "next/server"
import { parseYouTubeUrl, getVideoInfo } from "@/lib/youtube"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  const videoId = parseYouTubeUrl(url)

  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
  }

  try {
    const videoInfo = await getVideoInfo(videoId)

    if (!videoInfo) {
      return NextResponse.json({ error: "Could not fetch video information" }, { status: 404 })
    }

    return NextResponse.json(videoInfo)
  } catch (error) {
    console.error("Error fetching video info:", error)
    return NextResponse.json(
      { error: "Failed to fetch video information" },
      { status: 500 }
    )
  }
}
