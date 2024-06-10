import React, {useEffect} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import bigJson from '../../data/big-json-sample.json'
import bigJson2 from '../../data/big-json-sample-2.json'
import regularJson from '../../data/regular-json-sample.json'
import {JsonViewer, JsonViewerProps} from "@textea/json-viewer";
import JsonFile from "@/app/shared/types/JsonFile";
import { JsonOutput } from "@/app/services/JsonManager";

export interface JsonPreviewsProps {
  onEditJson: (item: JsonFile) => string
  values: JsonOutput | null
}

export default function JsonPreviews(props: JsonPreviewsProps) {
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

  useEffect(() => {
  }, [props.values]);

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
      <>
        <div className={'bg-gray-200'}>
          <p className={`text-2xl m-4 text-black`}>Récents</p>
        </div>
        <div className={`bg-white text-gray-600 rounded p-4 h-2/3 overflow-scroll`}>
          <div className={'h-full'}>
            {props.values && Object.entries(props.values).map(([key, item], i) => (
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
                        <span>{item.title.slice(0, 24)}...</span>
                        <div className={`flex gap-4`}>
                          <div className={`flex gap-1 items-center cursor-pointer`}>
                            <FontAwesomeIcon icon={faPenToSquare}/>
                            Edit
                          </div>
                        </div>
                      </div>
                      <div className={`overflow-scroll`}>
                        <JsonViewer {...viewerConfig} value={item.data}/>
                      </div>
                    </div>
                )
            )}
          </div>
        </div>
      </>
  )
}
