'use client'

import { useEffect, useRef, useState } from 'react'
import JsonManager, { JsonInputWithDate } from '@/services/JsonManager'
import Sidebar from '@/components/sidebar/Sidebar'
import JsonCreate from '@/components/json-create/jsonCreate'
import Navbar from '@/components/navbar/Navbar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { usePagination } from '@/hooks/usePagination'
import { EditStatus, JsonFile } from '@/types/json'

export default function Home() {
  const jsonManagerRef = useRef(new JsonManager())
  const jsonManager = jsonManagerRef.current

  const { data, hasMore, loadMore, refresh, addItem } = usePagination(jsonManager)
  const [currentJson, setCurrentJson] = useState<JsonFile | null>(null)
  const [currentStatus, setCurrentStatus] = useState<EditStatus>(EditStatus.new)

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleSelectJson = (jsonFile: JsonInputWithDate): void => {
    setCurrentStatus(EditStatus.view)
    setCurrentJson(jsonFile)
  }

  const handleAddJson = (jsonFile: JsonFile): void => {
    jsonManager.save(jsonFile)

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

  return (
    <main className="flex flex-col h-screen">
      <Navbar onCreateNew={handleCreateNew} />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg border">
          <ResizablePanel defaultSize={33} minSize={20} maxSize={50}>
            <Sidebar
              values={data}
              updateCurrentStatus={setCurrentStatus}
              onEditJson={handleSelectJson}
              mode={currentStatus}
              onLoadMore={loadMore}
              shouldDisplayLoadMore={hasMore}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={67} minSize={50}>
            <div className="h-full p-3">
              <JsonCreate
                mode={currentStatus}
                data={currentJson}
                onAdd={handleAddJson}
                onDelete={handleDeleteJson}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  )
}