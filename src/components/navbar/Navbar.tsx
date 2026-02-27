'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { EditStatus } from '@/types/json'

interface NavbarProps {
  onCreateNew: () => void
  onEnterCompare: () => void
  onExitCompare: () => void
  mode: EditStatus
}

export default function Navbar({ onCreateNew, onEnterCompare, onExitCompare, mode }: NavbarProps) {
  return (
    <nav className="h-14 py-2 border-b border-gray-200 p-3 flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Image src="/jason.png" alt="JSON Saver logo" width={24} height={24} />
        <Link href="/" className="text-black font-medium">
          JSON SAVER
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {mode === EditStatus.compare ? (
          <Button type="button" variant="outline" onClick={onExitCompare}>
            Exit compare
          </Button>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={onEnterCompare}>
              Compare
            </Button>
            <Button type="button" onClick={onCreateNew}>
              Create a new JSON
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}