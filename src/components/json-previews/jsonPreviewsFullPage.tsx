import {JsonViewer, JsonViewerProps} from "@textea/json-viewer";
import React from "react";
import JsonFile from "@/shared/types/JsonFile";

export type JsonPreviewsFullPageProps = JsonFile
export default function JsonPreviewsFullPage(props: JsonPreviewsFullPageProps) {

  const viewerConfig: Omit<JsonViewerProps, 'value'> = {
    editable: true,
    enableClipboard: false,
    displayDataTypes: true,
    displaySize: true,
    maxDisplayLength: 10,
  }
  return (<div className={`m-3`}>
    <h2 className={`mb-6 text-2xl text-black`}>{props.title}</h2>
    <div>
      <JsonViewer {...viewerConfig} value={props.data} />
    </div>
  </div>)
}
