import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import bigJson from '../../data/big-json-sample.json'
import bigJson2 from '../../data/big-json-sample-2.json'
import regularJson from '../../data/regular-json-sample.json'
import {JsonViewer, JsonViewerProps} from "@textea/json-viewer";
import JsonFile from "@/shared/types/JsonFile";

export interface JsonPreviewsProps {
  onEditJson: (item: JsonFile) => string
}
export default function jsonPreviews (props: JsonPreviewsProps) {
  const mockData: Array<JsonFile> = [{
    title: 'Big JSON',
    data: bigJson
  }, {
    title: 'BIG JSON 2',
    data: bigJson2
  },
    {
      title: 'REGULAR JSON',
      data: regularJson
    }]
  const viewerConfig: Omit<JsonViewerProps, 'value'> = {
    editable: false,
    enableClipboard: false,
    maxDisplayLength: 1,
    displayDataTypes: false,
    displaySize: false
  }
  return (
      <div className={`bg-white text-gray-600 rounded p-4`}>
        <p className={`text-2xl mb-4`}>Récents</p>
        {mockData.map((item, i) => (
                <div key={i} className={`flex flex-col w-full mb-6`}>
                  <div className={`flex flex-row justify-between mb-2`}>
                    <span>{item.title + ' - ' + i}</span>
                    <div className={`flex gap-4`}>
                      <div className={`flex gap-1 items-center cursor-pointer`} onClick={() => { props.onEditJson(item) }}>
                        <FontAwesomeIcon icon={faPenToSquare}/>
                        Edit
                      </div>
                      <div className={`flex gap-1 items-center cursor-pointer`}>
                        <FontAwesomeIcon icon={faXmark} color='red'/>
                        Delete
                      </div>
                    </div>
                  </div>
                  <div className={`max-h-40 overflow-scroll`}>
                    <JsonViewer {...viewerConfig} value={item.data} />
                  </div>
                </div>
            )
        )}

      </div>
  )
}
