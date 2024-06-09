'use client'
import React, {useEffect} from "react";
import JsonPreviews from '../json-previews/jsonPreviews';
import JsonFile from "@/shared/types/JsonFile";
import {JsonOutput} from "@/services/JsonManager";

export type SidebarProps = {
  onEditJson: (item: JsonFile) => string
  updateCurrentStatus: (status: 'view' | 'edit') => void
  values: JsonOutput | null
}
export default function Sidebar(props: SidebarProps) {
  useEffect(() => {
    console.log('props.values Sidebar', props.values)
  }, [props.values]);
  return (
      <>
        <div className={`h-full w-full max-w-lg bg-gray-100 flex flex-col p-16 border-r border-r-gray-200`}>
          <div className={'mb-3 w-full'}>
          </div>
          <JsonPreviews values={props.values} onEditJson={(item) => props.onEditJson(item)}/>
        </div>
      </>
  )
}
