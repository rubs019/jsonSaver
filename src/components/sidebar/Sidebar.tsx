'use client'

import JsonPreviewsContainer from '../json-previews/jsonPreviewsContainer'
import { JsonInputWithDate, JsonOutput } from '@/services/JsonManager'
import { EditStatus } from '@/types/json'

export interface SidebarProps {
  onEditJson: (item: JsonInputWithDate) => void
  values: JsonOutput
  mode: EditStatus
  onLoadMore: () => void
  shouldDisplayLoadMore: boolean
}

export default function Sidebar({
  values,
  mode,
  onLoadMore,
  shouldDisplayLoadMore,
  onEditJson,
}: SidebarProps) {
  return (
    <div className="h-full w-full flex flex-col border-r border-r-gray-200">
      <JsonPreviewsContainer
        shouldDisplayLoadMore={shouldDisplayLoadMore}
        onLoadMore={onLoadMore}
        mode={mode}
        values={values}
        onEditJson={onEditJson}
      />
    </div>
  )
}