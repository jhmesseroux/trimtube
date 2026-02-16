import { Scissors, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg-vibrant">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold gradient-text">ClipTrim</span>
              <p className="text-sm text-muted-foreground">
                YouTube Video Trimmer
              </p>
            </div>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-pink-500 fill-pink-500" /> for creators everywhere
          </p>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ClipTrim. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
