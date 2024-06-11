'use client'

import Link from "next/link";
import React, { useEffect, useState } from "react";
import JsonManager, { JsonOutput } from "./services/JsonManager";
import Button from "./components/ui/button/Button";
import Sidebar from "./components/sidebar/Sidebar";
import JsonCreate from "./components/json-create/jsonCreate";

export interface JsonFile {
  id: number
  title: string
  data: unknown
}
export default function Home() {
  const [currentJson, setCurrentJson] = useState<JsonFile[]>([]);
  const [currentStatus, setCurrentStatus] = useState<'view' | 'edit'>('edit')
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
    setCurrentJson((val) => [item]);
  }

  const onAddJson = (id: string) => {
    refresh()
  }

  const onDeleteJson = (id: string) => {
    jsonManager.delete(id)
    refresh()
  }

  const refresh = () => {
    const items = jsonManager.getAll()
    if (items) {
      setData(items)
    }
  }
  return (
      <main>
        <nav className={`py-2 border-b border-gray-200 pr-12 flex items-center gap-12 justify-end w-full bg-white`}>
          <Link href={'/'} className={`text-black`}>Home</Link>
          <div className={'w-64'}>
            <Button type={'primary'} onClick={() => setCurrentStatus('edit')}>
              Create a new json
            </Button>
          </div>
        </nav>

        <div className={`flex h-full`}>
          <Sidebar values={data} updateCurrentStatus={(status) => setCurrentStatus(status)}
                   onEditJson={(item) => updateJson(item)}/>

          <div className={`w-full h-full`}>
            <div className={`bg-gray-500 w-full p-4`}>
              <h1 className={`text-white text-center text-4xl`}>JSON Saver</h1>
            </div>
            <div className={'h-full p-3'}>
              {currentStatus === 'view' &&
                  <div className={`w-full h-full bg-white overflow-scroll max-h-full`}>
                    {currentJson.length > 0
                        ?
                        <div className={`flex h-full`}>
                          {currentJson.map((item, i) => (
                              <div key={i} className={'w-full h-full'}>
                                <JsonCreate data={item} onAdd={onAddJson} onDelete={onDeleteJson}/>
                              </div>
                          ))}
                        </div>
                        :
                        <div className={`h-full flex items-center justify-center text-2xl text-black`}>
                          <p>No JSON to display</p>
                        </div>
                    }
                  </div>
              }

              {currentStatus === 'edit' && <div className={'w-full h-full'}><JsonCreate onAdd={onAddJson}/></div>}
            </div>
          </div>
        </div>
      </main>
  );
}
