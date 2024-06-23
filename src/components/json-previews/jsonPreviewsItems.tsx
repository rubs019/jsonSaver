import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {JsonViewer, JsonViewerProps} from "@textea/json-viewer";
import React, { useEffect, useState } from "react";
import {JsonInputWithDate} from "@/services/JsonManager";
import dayjs from 'dayjs'

export type JsonPreviewsItemProps = {
  data: JsonInputWithDate
}
export default function JsonPreviewsItems(props: JsonPreviewsItemProps): JSX.Element {

  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const viewerConfig: Omit<JsonViewerProps, 'value'> = {
    editable: false,
    enableClipboard: false,
    maxDisplayLength: 1,
    displayDataTypes: false,
    displaySize: false,
    enableAdd: false,
    enableDelete: false
  }
  
  useEffect(() => {
    const date = dayjs(props.data.lastUpdated).format("YYYY-MM-DD HH:mm:ss")
    setLastUpdated(date)
  }, [props.data.lastUpdated])
  
  return (<>
    <div className={`flex flex-row justify-between mb-2`}>
    <div className={`flex flex-col`}>
        <span>{props.data.title.length > 24
            ? props.data.title.slice(0, 24) + '...'
            : props.data.title}
        </span>
        <div className={`overflow-scroll`}>
          <JsonViewer {...viewerConfig} value={props.data.data}/>
        </div>
      </div>
      <div className={`flex flex-col items-end justify-between gap-4`}>
        <div className={`flex gap-1 cursor-pointer`}>
          <FontAwesomeIcon icon={faPenToSquare}/>
            Edit
          </div>
        {lastUpdated && <span className={`self-end text-xs`}>Last updated : {lastUpdated}</span>}
      </div>
    </div>
  </>)
}
