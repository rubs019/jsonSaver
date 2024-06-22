'use client'

import Link from "next/link";
import React, { useEffect, useState } from "react";
import JsonManager, { JsonOutput } from "@/services/JsonManager";
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
export default function Home() {
  const [currentJson, setCurrentJson] = useState<JsonFile | null>(null);
  const [currentStatus, setCurrentStatus] = useState<'view' | 'new'>('new')
  const [data, setData] = useState<JsonOutput | null>(null)
  const jsonManager = new JsonManager()

  useEffect(() => {
    refresh()
  }, []);

  function updateJson(item: JsonFile): any {
    if (!item) {
      console.log('No item to display')
      return
    }
    setCurrentStatus('view')
    setCurrentJson(item);
  }

  const onAddJson = (data: JsonFile) => {
    console.log('onAddJson', data);
    jsonManager.save(data)
    refresh()
  }

  const onDeleteJson = (id: string) => {
    jsonManager.delete(id)
    refresh()
  }

  const refresh = () => {
    console.log('refresh')
    const items = jsonManager.getAll()
    if (items) {
      setData(items)
    }
  }
  return (
      <main>
        <nav className={`py-2 border-b border-gray-200 p-3 flex items-center gap-12 justify-between w-full`}>
          <Link href={'/'} className={`text-black`}>JSON SAVER</Link>
          <div>
            <Button type={'button'} onClick={() => setCurrentStatus('new')}>
              Create a new JSON
            </Button>
          </div>
        </nav>

        <div className={`flex h-full`}>
          <ResizablePanelGroup
              direction="horizontal"
              className="w-full rounded-lg border"
          >
            <ResizablePanel defaultSize={33} minSize={20} maxSize={100} >
              <Sidebar
                  values={data}
                  updateCurrentStatus={(status) => setCurrentStatus(status)}
                  onEditJson={(item) => updateJson(item)}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={66}>
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
