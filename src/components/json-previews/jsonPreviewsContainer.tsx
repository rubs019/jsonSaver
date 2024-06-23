import React, {useEffect, useRef, useState} from "react";

import { JsonInputWithDate, JsonOutput } from "@/services/JsonManager";
import JsonPreviewsItems from "@/components/json-previews/jsonPreviewsItems";
import { EditStatus } from "@/app/page";
import { Button } from "../ui/button";

export interface JsonPreviewsProps {
  onEditJson: (item: JsonInputWithDate) => string
  values: JsonOutput | null
  mode: EditStatus
  onLoadMore: () => void
  shouldDisplayLoadMore: boolean
}

export default function JsonPreviewsContainer(props: JsonPreviewsProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [sortedItems, setSortedItems] = useState<JsonInputWithDate[]>([])
  useEffect(() => {
    if (props.values) {
      // Sort by most recent updated
      const result = Object.entries(props.values).map(val => val[1])

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
            {
              sortedItems.length > 0 && 
              <>
              {sortedItems.map((item, i) => (
                <div
                    key={i}
                    className={`flex flex-col w-full mb-6 
                     hover:bg-blue-200 hover:text-white
                     ${selectedId === item.id && props.mode === 'view' ? `bg-blue-300 text-white` : ``} 
                     cursor-pointer p-2 rounded`}
                    onClick={() => {
                      setSelectedId(item.id)
                      props.onEditJson(item)
                    }}
                >
                  <JsonPreviewsItems data={item} />
                </div>
                ))
              }
              {props.shouldDisplayLoadMore && <Button variant="outline" className={'w-full'} onClick={props.onLoadMore}>Load more...</Button>}
              </>
            }
            {sortedItems.length === 0 && <p>No json has been saved</p>}
          </div>
        </div>
      </>
  )
}
