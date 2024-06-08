import { JsonViewer, JsonViewerProps} from "@textea/json-viewer";
import React from "react";
import JsonFile from "@/shared/types/JsonFile";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";

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
        <div className={`mb-6 flex items-center space-between gap-24 text-black`}>
          <h2 className={`text-2xl`}>{props.title}</h2>
          <span>Close <FontAwesomeIcon size={`lg`} color={`black`} icon={faXmark}/></span>
        </div>
        <div>
          <JsonViewer {...viewerConfig} value={props.data} />
        </div>
      </div>
  )
}
