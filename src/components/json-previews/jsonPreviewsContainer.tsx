import React, {useEffect, useRef, useState} from "react";

import { JsonInputWithDate, JsonOutput } from "@/services/JsonManager";
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
        return a[1].lastUpdated < b[1].lastUpdated ? 1 : -1
      }).map(val => val[1])
      console.log('result', result)

      setSortedItems(result)
    }
  }, [props.values]);
  return (
      <>
        <div>
          <p className={`text-xl m-4 h-10 text-black`}>Récents</p>
        </div>
        <div className={`text-gray-600 rounded p-4 h-2/3 overflow-scroll`}>
          <div className={''}>
            {sortedItems.length > 0 && sortedItems.map((item, i) => (
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
            {sortedItems.length === 0 && <p>No json has been saved</p>}
          </div>
        </div>
      </>
  )
}
