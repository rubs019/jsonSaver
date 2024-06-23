'use client'
import React, {useEffect} from "react";
import JsonPreviewsContainer from '../json-previews/jsonPreviewsContainer';
import { JsonOutput } from "@/services/JsonManager";
import { EditStatusV2, JsonFile } from "@/app/page";

export type SidebarProps = {
  onEditJson: (item: JsonFile) => string
  updateCurrentStatus: (status: EditStatusV2) => void
  values: JsonOutput | null
  mode: EditStatusV2
  onLoadMore: () => void
  shouldDisplayLoadMore: boolean
}
export default function Sidebar(props: SidebarProps) {
  return (
      <>
        <div className={`h-full w-full flex flex-col border-r border-r-gray-200`}>
          <JsonPreviewsContainer 
              shouldDisplayLoadMore={props.shouldDisplayLoadMore} 
              onLoadMore={props.onLoadMore} 
              mode={props.mode} 
              values={props.values} 
              onEditJson={(item) => props.onEditJson(item)}/>
        </div>
      </>
  )
}
