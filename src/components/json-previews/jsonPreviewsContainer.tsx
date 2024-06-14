import React, {useEffect, useRef, useState} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import bigJson from '@/data/big-json-sample.json'
import bigJson2 from '@/data/big-json-sample-2.json'
import regularJson from '@/data/regular-json-sample.json'
import {JsonViewer, JsonViewerProps} from "@textea/json-viewer";
import {JsonInput, JsonInputWithDate, JsonOutput} from "@/services/JsonManager";
import {JsonFile} from "@/app/page";
import JsonPreviewsItems from "@/components/json-previews/jsonPreviewsItems";

export interface JsonPreviewsProps {
  onEditJson: (item: JsonInputWithDate) => string
  values: JsonOutput | null
}

export default function JsonPreviewsContainer(props: JsonPreviewsProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [sortedItems, setSortedItems] = useState<JsonInputWithDate[]>([])
  useEffect(() => {
    if (props.values) {
      const result = Object.entries(props.values).sort((a, b) => {
        console.log('a', a[1].lastUpdated)
        console.log('b', b)

        return a[1].lastUpdated < b[1].lastUpdated ? 1 : -1
      }).map(val => val[1])
      console.log('result', result)

      setSortedItems(result)

    }
  }, [props.values]);
  return (
      <>
        <div className={'bg-gray-200'}>
          <p className={`text-2xl m-4 h-10 text-black`}>Récents</p>
        </div>
        <div className={`bg-white text-gray-600 rounded p-4 h-2/3 overflow-scroll`}>
          <div className={''}>
            {sortedItems.map((item, i) => (
                <div
                    key={i}
                    className={`flex flex-col w-full mb-6 
                     hover:bg-blue-200 hover:text-white
                     ${selectedId === item.id? `bg-blue-300 text-white` : ``} 
                     cursor-pointer p-2 rounded`}
                    onClick={() => {
                      setSelectedId(item.id)
                      props.onEditJson(item)
                    }}
                >
                  <JsonPreviewsItems data={item} />
                </div>
            ))}
          </div>
        </div>
      </>
  )
}
