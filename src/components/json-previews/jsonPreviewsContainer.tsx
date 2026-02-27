import { JsonInputWithDate, JsonOutput } from '@/services/JsonManager'
import JsonPreviewsItems from '@/components/json-previews/jsonPreviewsItems'
import { EditStatus, JsonFile } from '@/types/json'
import { Button } from '../ui/button'

export interface JsonPreviewsProps {
  onEditJson: (item: JsonInputWithDate) => void
  values: JsonOutput
  mode: EditStatus
  onLoadMore: () => void
  shouldDisplayLoadMore: boolean
  compareSelections: [JsonFile | null, JsonFile | null]
  onToggleCompare: (item: JsonFile) => void
}

export default function JsonPreviewsContainer({
  values,
  onEditJson,
  onLoadMore,
  shouldDisplayLoadMore,
  mode,
  compareSelections,
  onToggleCompare,
}: JsonPreviewsProps) {
  const isCompare = mode === EditStatus.compare
  const selectedCount = compareSelections.filter(Boolean).length

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
        <p className="font-display font-semibold text-[11px] uppercase tracking-widest text-zinc-400">
          Récents
        </p>
        {isCompare && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {selectedCount}/2 selected
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {values.length > 0 ? (
          <div className="flex flex-col gap-2">
            {values.map((item) => {
              const selectionIndex = compareSelections.findIndex((s) => s?.id === item.id)
              const isSelected = selectionIndex !== -1
              const bothSelected = compareSelections[0] !== null && compareSelections[1] !== null
              const isDisabled = isCompare && bothSelected && !isSelected

              return (
                <div
                  key={item.id}
                  className={[
                    'group relative rounded-xl border bg-white cursor-pointer',
                    'transition-all duration-150 active:scale-[0.995]',
                    isCompare && isSelected
                      ? 'border-violet-300 shadow-card-selected'
                      : isDisabled
                        ? 'border-zinc-100 opacity-50 cursor-not-allowed'
                        : 'border-zinc-200 shadow-card hover:border-violet-200 hover:shadow-card-hover',
                  ].join(' ')}
                  onClick={() => isCompare ? onToggleCompare(item) : onEditJson(item)}
                >
                  {isCompare && isSelected && (
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-violet-500" />
                  )}
                  <JsonPreviewsItems
                    data={item}
                    mode={mode}
                    compareSelections={compareSelections}
                  />
                </div>
              )
            })}
            {shouldDisplayLoadMore && (
              <Button
                variant="outline"
                className="w-full border-zinc-200 text-zinc-500 hover:border-violet-200 hover:text-violet-700 mt-1"
                onClick={onLoadMore}
              >
                Load more…
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">
              {'{ }'}
            </div>
            <p className="text-sm text-zinc-400 font-medium">No JSONs saved yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
