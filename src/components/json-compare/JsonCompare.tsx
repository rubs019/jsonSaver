'use client'

import { JsonFile } from '@/types/json'
import DiffViewer from './DiffViewer'
import { GitCompare } from 'lucide-react'

interface JsonCompareProps {
  jsonA: JsonFile | null
  jsonB: JsonFile | null
}

export default function JsonCompare({ jsonA, jsonB }: JsonCompareProps) {
  const selectedCount = [jsonA, jsonB].filter(Boolean).length

  if (jsonA === null || jsonB === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <GitCompare className="w-9 h-9 text-zinc-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center text-sm font-bold text-violet-700">
            {selectedCount}
          </div>
        </div>
        <div>
          <p className="font-display font-semibold text-zinc-700 text-xl tracking-tight">
            Select 2 JSONs to compare
          </p>
          <p className="text-sm text-zinc-400 mt-1.5">{selectedCount}/2 selected in sidebar</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">A</span>
            <span>Original</span>
          </div>
          <span className="text-zinc-300">vs</span>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[10px]">B</span>
            <span>Modified</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
          <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0">A</span>
          <span className="font-medium text-emerald-800 truncate">{jsonA.title}</span>
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg text-sm">
          <span className="w-5 h-5 rounded bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[10px] shrink-0">B</span>
          <span className="font-medium text-violet-800 truncate">{jsonB.title}</span>
        </div>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden border border-zinc-200">
        <DiffViewer original={jsonA.data} modified={jsonB.data} />
      </div>
    </div>
  )
}
