import { JsonInputWithDate, JsonOutput } from '@/services/JsonManager'
import JsonPreviewsItems from '@/components/json-previews/jsonPreviewsItems'
import { EditStatus } from '@/types/json'
import { Button } from '../ui/button'

export interface JsonPreviewsProps {
  onEditJson: (item: JsonInputWithDate) => void
  values: JsonOutput
  mode: EditStatus
  onLoadMore: () => void
  shouldDisplayLoadMore: boolean
}

export default function JsonPreviewsContainer({
  values,
  onEditJson,
  onLoadMore,
  shouldDisplayLoadMore,
}: JsonPreviewsProps) {
  return (
    <>
      <div>
        <p className="text-xl m-4 h-10 text-black">Récents</p>
      </div>
      <div className="text-gray-600 rounded p-4 overflow-auto">
        <div>
          {values.length > 0 ? (
            <>
              {values.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col w-full mb-6 border-2 border-transparent transition hover:border-2 hover:border-gray-300 hover:bg-gray-50 hover:ease-out duration-100 cursor-pointer p-2 rounded-lg"
                  onClick={() => onEditJson(item)}
                >
                  <JsonPreviewsItems data={item} />
                </div>
              ))}
              {shouldDisplayLoadMore && (
                <Button variant="outline" className="w-full" onClick={onLoadMore}>
                  Load more...
                </Button>
              )}
            </>
          ) : (
            <p>No json has been saved</p>
          )}
        </div>
      </div>
    </>
  )
}