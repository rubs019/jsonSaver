'use client'
import React from "react";
import Button from "@/components/ui/button/Button";
import JsonPreviews from '../json-previews/jsonPreviews';
import JsonFile from "@/shared/types/JsonFile";

export type SidebarProps = {
  onEditJson2: (item: JsonFile) => string
}
export default function Sidebar(props: SidebarProps) {
  return (
      <>
        <div className={`h-full w-full max-w-lg bg-gray-100 flex flex-col p-16 border-r border-r-gray-200`}>
          <div className={'mb-3 w-full'}>
            <Button type={'primary'}>
              Create a new json
            </Button>
          </div>
          <JsonPreviews onEditJson={(item) => {
            console.log('clicked - Sidebar', item)
            return props.onEditJson2(item)
          }} />
        </div>
      </>
  )
}
