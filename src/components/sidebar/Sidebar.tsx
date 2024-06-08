'use client'
import React from "react";
import Button from "@/components/ui/button/Button";
import JsonPreviews from '../json-previews/jsonPreviews';
import JsonFile from "@/shared/types/JsonFile";

export type SidebarProps = {
  onEditJson: (item: JsonFile) => string
  updateCurrentStatus: (status: 'view' | 'edit') => void
}
export default function Sidebar(props: SidebarProps) {
  const updateCurrentStatus = () => {
    return props.updateCurrentStatus('edit');
  }
  return (
      <>
        <div className={`h-full w-full max-w-lg bg-gray-100 flex flex-col p-16 border-r border-r-gray-200`}>
          <div className={'mb-3 w-full'}>
            <Button type={'primary'} onClick={updateCurrentStatus}>
              Create a new json
            </Button>
          </div>
          <JsonPreviews onEditJson={(item) => props.onEditJson(item)} />
        </div>
      </>
  )
}
