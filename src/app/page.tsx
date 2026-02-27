'use client'

import { useEffect, useRef, useState } from 'react'
import JsonManager, { JsonInputWithDate, StorageError } from '@/services/JsonManager'
import Sidebar from '@/components/sidebar/Sidebar'
import JsonCreate from '@/components/json-create/jsonCreate'
import JsonCompare from '@/components/json-compare/JsonCompare'
import Navbar from '@/components/navbar/Navbar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { usePagination } from '@/hooks/usePagination'
import { EditStatus, JsonFile } from '@/types/json'
import { toggleCompareSelection } from '@/utils/compareSelection'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useToast } from '@/components/ui/use-toast'

export default function Home() {
  const jsonManagerRef = useRef(new JsonManager())
  const jsonManager = jsonManagerRef.current

  const { data, hasMore, loadMore, refresh, addItem } = usePagination(jsonManager)
  const [currentJson, setCurrentJson] = useState<JsonFile | null>(null)
  const [currentStatus, setCurrentStatus] = useState<EditStatus>(EditStatus.new)
  const [compareSelections, setCompareSelections] = useState<[JsonFile | null, JsonFile | null]>([null, null])
  const { toast } = useToast()

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleSelectJson = (jsonFile: JsonInputWithDate): void => {
    setCurrentStatus(EditStatus.view)
    setCurrentJson(jsonFile)
  }

  const handleAddJson = (jsonFile: JsonFile): void => {
    try {
      jsonManager.save(jsonFile)
    } catch (e) {
      if (e instanceof StorageError) {
        toast({ title: 'Save failed', description: e.message, variant: 'destructive' })
        return
      }
      throw e
    }

    const isAlreadyDisplayed = data.some((json) => json.id === jsonFile.id)
    if (isAlreadyDisplayed) {
      refresh()
    } else {
      addItem()
    }

    setCurrentStatus(EditStatus.view)
  }

  const handleDeleteJson = (jsonFileId: string): void => {
    jsonManager.delete(jsonFileId)
    setCurrentJson(null)
    setCurrentStatus(EditStatus.new)
    refresh()
  }

  const handleCreateNew = (): void => {
    setCurrentJson(null)
    setCurrentStatus(EditStatus.new)
  }

  const handleEnterCompare = (): void => {
    setCompareSelections([null, null])
    setCurrentStatus(EditStatus.compare)
  }

  const handleExitCompare = (): void => {
    setCompareSelections([null, null])
    setCurrentStatus(EditStatus.new)
  }

  const handleToggleCompareSelection = (json: JsonFile): void => {
    setCompareSelections((prev) => toggleCompareSelection(prev, json))
  }

  return (
    <main className="flex flex-col h-screen">
      <Navbar
        onCreateNew={handleCreateNew}
        onEnterCompare={handleEnterCompare}
        onExitCompare={handleExitCompare}
        mode={currentStatus}
      />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg border">
          <ResizablePanel defaultSize={33} minSize={20} maxSize={50}>
            <Sidebar
              values={data}
              onEditJson={handleSelectJson}
              mode={currentStatus}
              onLoadMore={loadMore}
              shouldDisplayLoadMore={hasMore}
              compareSelections={compareSelections}
              onToggleCompare={handleToggleCompareSelection}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={67} minSize={50}>
            <div className="h-full p-3">
              <ErrorBoundary>
                {currentStatus === EditStatus.compare ? (
                  <JsonCompare jsonA={compareSelections[0]} jsonB={compareSelections[1]} />
                ) : (
                  <JsonCreate
                    mode={currentStatus}
                    data={currentJson}
                    onAdd={handleAddJson}
                    onDelete={handleDeleteJson}
                  />
                )}
              </ErrorBoundary>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  )
}
