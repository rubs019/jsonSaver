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
export default function JsonPreviews (props: JsonPreviewsProps) {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const mockData: Array<JsonFile> = [{
    id: 0,
    title: 'Big JSON',
    data: bigJson
  }, {
    id: 1,
    title: 'BIG JSON 2',
    data: bigJson2
  },
    {
      id: 2,
      title: 'REGULAR JSON',
      data: regularJson
    }]
  const viewerConfig: Omit<JsonViewerProps, 'value'> = {
    editable: false,
    enableClipboard: false,
    maxDisplayLength: 1,
    displayDataTypes: false,
    displaySize: false,
    enableAdd: false,
    enableDelete: false
  }
  return (
      <div className={`bg-white text-gray-600 rounded p-4`}>
        <p className={`text-2xl mb-4`}>Récents</p>
        {mockData.map((item, i) => (
                <div key={i}
                     className={`flex flex-col w-full mb-6 
                     hover:bg-blue-200 hover:text-white
                     ${selectedId === i ? `bg-blue-300 text-white` : ``} 
                     cursor-pointer p-2 rounded`}
                     onClick={() => {
                       props.onEditJson(item)
                       setSelectedId(item.id)
                     }}
                >
                  <div className={`flex flex-row justify-between mb-2`}>
                    <span>{item.title}</span>
                    <div className={`flex gap-4`}>
                      <div className={`flex gap-1 items-center cursor-pointer`}>
                        <FontAwesomeIcon icon={faPenToSquare}/>
                        Edit
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
