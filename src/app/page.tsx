'use client'

import Sidebar from "@/components/sidebar/Sidebar";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React from "react";
import JsonPreviewsFullPage from "@/components/json-previews/jsonPreviewsFullPage";
import JsonFile from "@/shared/types/JsonFile";

export default function Home() {
  const [currentJson, setCurrentJson] = React.useState<JsonFile | null>(null);
  function updateJson(item: JsonFile): any {
    console.log('clicked - updatsjson', item)
    if (!item) {
      console.log('No item to display')
      return
    }
    setCurrentJson(item);
  }
  return (
      <main>
        <nav className={`py-2 border-b border-gray-200 pr-12 flex items-center gap-12 justify-end w-full bg-white`}>
          <Link href={'/'} className={`text-black`}>Home</Link>
          <div className={'w-64'}>
            <Button type={'primary'}>
              Create a new json
            </Button>
          </div>
        </nav>

        <div className={`flex h-full`}>
          <Sidebar onEditJson2={(item) => updateJson(item)} />

          <div className={`w-full`}>
            <div className={`bg-green-300 w-full p-4`}>
              <h1 className={`text-white text-center text-4xl`}>JSON Viewer</h1>
            </div>
            <div className={`w-full h-full bg-white overflow-scroll max-h-full`}>
              {currentJson
                  ? <JsonPreviewsFullPage {...currentJson} />
                  : <div className={`h-full flex items-center justify-center text-2xl text-black`}>
                    <p>No JSON to display</p>
                  </div>
              }
            </div>
          </div>
        </div>
      </main>
  );
}
