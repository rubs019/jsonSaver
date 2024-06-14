'use client'
import React, {useEffect} from "react";
import JsonPreviewsContainer from '../json-previews/jsonPreviewsContainer';
import { JsonOutput } from "@/services/JsonManager";
import {JsonFile} from "@/app/page";

export type SidebarProps = {
  onEditJson: (item: JsonFile) => string
  updateCurrentStatus: (status: 'view' | 'new') => void
  values: JsonOutput | null
}
export default function Sidebar(props: SidebarProps) {
  return (
      <>
        <div className={`h-full w-full max-w-lg bg-gray-100 flex flex-col border-r border-r-gray-200`}>
          <JsonPreviewsContainer values={props.values} onEditJson={(item) => props.onEditJson(item)}/>
        </div>
      </>
  )
}
