import * as React from 'react'

import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'
import { IconGitHub } from '@/components/ui/icons'
import Image from 'next/image'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <Image src="/patcher.png" width={32} height={32} alt="LLM Patcher" />
        <span className="ml-4 font-bold text-lg">LLM Patcher</span>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <a
          target="_blank"
          href="https://github.com/theluk/llm-patcher"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="hidden ml-2 md:flex">GitHub</span>
        </a>
      </div>
    </header>
  )
}
