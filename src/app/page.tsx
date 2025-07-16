'use client'

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import JsonManager, { JsonInputWithDate, JsonOutput } from "@/services/JsonManager";
import Sidebar from "@/components/sidebar/Sidebar";
import JsonCreate from "@/components/json-create/jsonCreate";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import { ResizablePanel } from "@/components/ui/resizable";

export interface JsonFile {
  id: string
  title: string
  data: unknown
}
export const enum EditStatusV2 {
  view = 'view',
  new = 'new'
}

export interface PaginationParams {
  offset: number
}
export interface RefreshParameters {
  start?: number,
  end: number
}

export default function Home() {
  const [currentJson, setCurrentJson] = useState<JsonFile | null>(null);
  const [currentStatus, setCurrentStatus] = useState<EditStatusV2>(EditStatusV2.new)
  const [data, setData] = useState<JsonOutput>([])
  const jsonManager = new JsonManager()
  const maxItem = useRef<number | null>(null)
  const currentPagination = useRef<[number, number]>([0, 2])
  const [shouldDisplayMore, setShouldDisplayMore] = useState<boolean>(true)

  useEffect(() => {
    if (!maxItem.current) refresh({ start: currentPagination.current[0], end: currentPagination.current[1]})
  }, []);

  /**
   * Use to update a json
   * 
   * @param jsonFile contains parameters required for display a JSON
   */
  function updateJson(jsonFile: JsonFile): any {
    if (!jsonFile) {
      console.log('No item to display')
      return
    }
    setCurrentStatus(EditStatusV2.view)
    setCurrentJson(jsonFile);
  }

  /**
   * Use to save a new json, create a pagination and refresh the current page
   * 
   * @param jsonFile contains parameters required for display a JSON
   */
  const onAddJson = (jsonFile: JsonFile) => {
    jsonManager.save(jsonFile)
    
    // Use to display the newest jsonFile
    const isAlreadyDisplay = !!data.find(json => json.id === jsonFile.id)
    if (!isAlreadyDisplay) currentPagination.current[1] = currentPagination.current[1] + 1
    
    setCurrentStatus(EditStatusV2.view)
    refresh({ end: currentPagination.current[1]})
  }

  /**
   * Use to remove a jsonFile
   * @param jsonFileID
   */
  const onDeleteJson = (jsonFileID: string) => {
    jsonManager.delete(jsonFileID)
    refresh({
      end: currentPagination.current[1]
    })
  }

  /**
   * Use to refresh every jsonFile
   * @param start
   * @param end
   */
  const refresh = ({start, end}: RefreshParameters) => {
    const result = jsonManager.getAllPaginated(start || 0, end)
    
    if (!result) { return }
    
    if (maxItem.current && maxItem.current <= end) {
      setShouldDisplayMore(false)
    }
    if (!maxItem.current && result.maxItem) {
      maxItem.current = result.maxItem
    }
    if (result.data) {
      setData(result.data)
    }
  }

  /**
   * Use to load next json
   */
  const loadMoreJson = ({ offset }: PaginationParams) => {
    currentPagination.current[1] = currentPagination.current[1] + offset
    refresh({ end : currentPagination.current[1]})
  }
  return (
      <main>
        <nav className={`h-14 py-2 border-b border-gray-200 p-3 flex items-center gap-12 justify-between w-full`}>
          <div className={`flex`}>
            <img src="jason.png" alt="" width='24'/>
            <Link href={'/'} className={`text-black`}>JSON SAVER</Link>
          </div>
          <div>
            <Button type={'button'} onClick={() => setCurrentStatus(EditStatusV2.new)}>
            Create a new JSON
            </Button>
          </div>
        </nav>

        <div className={`flex h-screen`}>
          <ResizablePanelGroup
              direction="horizontal"
              className="w-full rounded-lg border"
          >
            <ResizablePanel defaultSize={33} minSize={20} maxSize={100} >
              <Sidebar
                  values={data}
                  updateCurrentStatus={(status) => setCurrentStatus(status)}
                  onEditJson={(item) => updateJson(item)}
                  mode={currentStatus}
                  onLoadMore={() => loadMoreJson({ offset: 2})}
                  shouldDisplayLoadMore={shouldDisplayMore}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={66} defaultSize={80}>
              <div className={`w-full h-full`}>
                <div className={`bg-gray-500 w-full p-2`}>
                  <h1 className={`text-white text-center text-2xl`}>JSON Saver</h1>
                </div>
                <div className={'p-3 h-full'}>
                  <JsonCreate mode={currentStatus} data={currentJson} onAdd={onAddJson} onDelete={onDeleteJson}/>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>
  );
}
