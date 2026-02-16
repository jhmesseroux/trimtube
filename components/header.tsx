"use client"

import { Scissors } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 glass" />
      <div className="relative container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg-vibrant glow">
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl gradient-text">ClipTrim</span>
        </a>
        <nav className="flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
