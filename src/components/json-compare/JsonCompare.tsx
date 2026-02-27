'use client'

import { JsonFile } from '@/types/json'
import DiffViewer from './DiffViewer'

interface JsonCompareProps {
  jsonA: JsonFile | null
  jsonB: JsonFile | null
}

export default function JsonCompare({ jsonA, jsonB }: JsonCompareProps) {
  const selectedCount = [jsonA, jsonB].filter(Boolean).length

  if (jsonA === null || jsonB === null) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg">Sélectionnez 2 JSONs dans la sidebar pour comparer</p>
          <p className="text-sm mt-1">({selectedCount}/2 sélectionnés)</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 mb-2 text-sm font-medium">
        <div className="flex-1 px-2 py-1 bg-gray-100 rounded text-gray-700">
          A — {jsonA.title}
        </div>
        <div className="flex-1 px-2 py-1 bg-gray-100 rounded text-gray-700">
          B — {jsonB.title}
        </div>
      </div>
      <div className="flex-1">
        <DiffViewer original={jsonA.data} modified={jsonB.data} />
      </div>
    </div>
  )
}
