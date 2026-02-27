'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { EditStatus } from '@/types/json'
import { Diff, Plus, X } from 'lucide-react'

interface NavbarProps {
  onCreateNew: () => void
  onEnterCompare: () => void
  onExitCompare: () => void
  mode: EditStatus
}

export default function Navbar({ onCreateNew, onEnterCompare, onExitCompare, mode }: NavbarProps) {
  const isCompare = mode === EditStatus.compare

  return (
    <nav className="h-14 px-4 border-b border-zinc-200 bg-white flex items-center justify-between w-full shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-700 flex items-center justify-center shadow-sm">
          <Image src="/jason.png" alt="JSON Saver logo" width={18} height={18} className="brightness-0 invert" />
        </div>
        <Link href="/" className="font-display font-bold text-zinc-900 tracking-tight text-[15px] select-none">
          JSON SAVER
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {isCompare ? (
          <Button
            type="button"
            variant="outline"
            onClick={onExitCompare}
            className="border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-800 gap-1.5 font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Exit Compare
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onEnterCompare}
              className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 gap-1.5 font-medium"
            >
              <Diff className="w-3.5 h-3.5" />
              Compare
            </Button>
            <Button
              type="button"
              onClick={onCreateNew}
              className="bg-zinc-900 hover:bg-zinc-700 text-white gap-1.5 font-medium shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New JSON
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
