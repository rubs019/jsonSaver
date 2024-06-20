import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {JsonViewer, JsonViewerProps} from "@textea/json-viewer";
import React from "react";
import {JsonInputWithDate} from "@/services/JsonManager";

export type JsonPreviewsItemProps = {
  data: JsonInputWithDate
}
export default function JsonPreviewsItems(props: JsonPreviewsItemProps): JSX.Element {

  const viewerConfig: Omit<JsonViewerProps, 'value'> = {
    editable: false,
    enableClipboard: false,
    maxDisplayLength: 1,
    displayDataTypes: false,
    displaySize: false,
    enableAdd: false,
    enableDelete: false
  }

  const showLastUpdate = () => {
    console.log("showLastUpdate", props.data.lastUpdated);

    return new Date(props.data.lastUpdated)
  }
  const displayLastUpdate = () => {
    return <span className={`self-end text-xs`}>Last updated : {showLastUpdate().toISOString()}</span>
  }
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
          {props.data.lastUpdated && displayLastUpdate()}
        </div>
    </div>
  </>)
}