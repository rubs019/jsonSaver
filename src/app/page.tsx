'use client'

import Sidebar from "@/components/sidebar/Sidebar";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import JsonPreviewsFullPage from "@/components/json-previews/jsonPreviewsFullPage";
import JsonFile from "@/shared/types/JsonFile";
import LocalstorageRepository from "@/services/localstorage.repository";
import JsonCreate from "@/components/json-create/jsonCreate";
import JsonManager, {JsonOutput} from "@/services/JsonManager";

export default function Home() {
  const [currentJson, setCurrentJson] = React.useState<JsonFile[]>([]);
  const localStorageRepository = new LocalstorageRepository();
  const [currentStatus, setCurrentStatus] = useState<'view' | 'edit'>('edit')
  const [data, setData] = React.useState<JsonOutput | null>(null)
  const jsonManager = new JsonManager()

  useEffect(() => {
    console.log('status updated', currentStatus)
  }, [currentStatus])

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

    save(item)
  }

  function save(item: JsonFile): any {
    const result = localStorageRepository.getAll()

    console.log('localStorageRepository', result)

    localStorageRepository.save(item.id.toString(), item.data)

    const result2 = localStorageRepository.getAll()

    console.log('localStorageRepository', result2)
  }

  const onAddJson = (id: string) => {
    console.log('onAddJson', id)
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
          <Sidebar values={data} updateCurrentStatus={(status) => setCurrentStatus(status)} onEditJson={(item) => updateJson(item)} />

          <div className={`w-full h-full`}>
            <div className={`bg-green-300 w-full p-4`}>
              <h1 className={`text-white text-center text-4xl`}>JSON Viewer</h1>
            </div>
            <div className={'h-full'}>
              {currentStatus === 'view' &&
                <div className={`w-full h-full bg-white overflow-scroll max-h-full`}>
                  {currentJson.length > 0
                    ?
                      <div className={`flex`}>
                        {currentJson.map((item, i) => (
                            <div key={i} className={`w-full`}><JsonPreviewsFullPage {...item} /></div>
                        ))}
                      </div>
                    :
                      <div className={`h-full flex items-center justify-center text-2xl text-black`}>
                        <p>No JSON to display</p>
                      </div>
                  }
                </div>
              }

              {currentStatus === 'edit' && <div className={'w-full h-full'}><JsonCreate data={currentJson[0]?.data} onAdd={onAddJson}/></div>}
            </div>
          </div>
        </div>
      </main>
  );
}
