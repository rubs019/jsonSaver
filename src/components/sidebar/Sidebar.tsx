'use client'

import JsonPreviewsContainer from '../json-previews/jsonPreviewsContainer'
import { JsonInputWithDate, JsonOutput } from '@/services/JsonManager'
import { EditStatus, JsonFile } from '@/types/json'

export interface SidebarProps {
  onEditJson: (item: JsonInputWithDate) => void
  values: JsonOutput
  mode: EditStatus
  onLoadMore: () => void
  shouldDisplayLoadMore: boolean
  compareSelections: [JsonFile | null, JsonFile | null]
  onToggleCompare: (item: JsonFile) => void
}

export default function Sidebar({
  values,
  mode,
  onLoadMore,
  shouldDisplayLoadMore,
  onEditJson,
  compareSelections,
  onToggleCompare,
}: SidebarProps) {
  return (
    <div className="h-full w-full flex flex-col border-r border-r-gray-200">
      <JsonPreviewsContainer
        shouldDisplayLoadMore={shouldDisplayLoadMore}
        onLoadMore={onLoadMore}
        mode={mode}
        values={values}
        onEditJson={onEditJson}
        compareSelections={compareSelections}
        onToggleCompare={onToggleCompare}
      />
    </div>
  )
}