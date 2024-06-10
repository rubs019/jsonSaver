import JsonFile from "@/app/shared/types/JsonFile";
import {JsonViewer, JsonViewerProps} from "@textea/json-viewer";
import React from "react";

export type JsonPreviewsFullPageProps = JsonFile
export default function JsonPreviewsFullPage(props: JsonPreviewsFullPageProps) {

  const viewerConfig: Omit<JsonViewerProps, 'value'> = {
    editable: false,
    enableClipboard: true,
    displayDataTypes: false,
    displaySize: false,
    maxDisplayLength: 5,
  }
  return (
      <div className={`m-3`}>
        <div className={`mb-6 flex items-center gap-24 text-black`}>
          <h2 className={`text-xl`}>{props.title}</h2>
        </div>
        <div>
          <JsonViewer {...viewerConfig} value={props.data}/>
        </div>
      </div>
  )
}
