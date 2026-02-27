import { JsonViewer, JsonViewerProps } from "@textea/json-viewer";
import { JsonInputWithDate } from "@/services/JsonManager";
import { EditStatus, JsonFile } from "@/types/json";
import { Check } from "lucide-react";
import dayjs from 'dayjs';

export type JsonPreviewsItemProps = {
  data: JsonInputWithDate
  mode?: EditStatus
  compareSelections?: [JsonFile | null, JsonFile | null]
}

const viewerConfig: Omit<JsonViewerProps, 'value'> = {
  editable: false,
  enableClipboard: false,
  maxDisplayLength: 1,
  displayDataTypes: false,
  displaySize: false,
  enableAdd: false,
  enableDelete: false,
}

export default function JsonPreviewsItems({ data, mode, compareSelections }: JsonPreviewsItemProps) {
  const lastUpdated = dayjs(data.lastUpdated).format("YYYY-MM-DD HH:mm");

  const isCompareMode = mode === EditStatus.compare
  const selectionIndex = compareSelections
    ? compareSelections.findIndex((s) => s?.id === data.id)
    : -1
  const isSelected = selectionIndex !== -1
  const selectionLabel = selectionIndex === 0 ? 'A' : selectionIndex === 1 ? 'B' : null
  const bothSelected = compareSelections ? compareSelections[0] !== null && compareSelections[1] !== null : false
  const isDisabled = isCompareMode && bothSelected && !isSelected

  return (
    <div className="flex items-start gap-3 px-3 pt-3 pb-2.5">
      {isCompareMode && (
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <div
            className={[
              'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150',
              isSelected
                ? 'border-violet-600 bg-violet-600'
                : isDisabled
                  ? 'border-zinc-200 bg-zinc-50'
                  : 'border-zinc-300 group-hover:border-violet-400',
            ].join(' ')}
          >
            {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          {selectionLabel && (
            <span
              className={[
                'w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center',
                selectionIndex === 0
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-violet-100 text-violet-700',
              ].join(' ')}
            >
              {selectionLabel}
            </span>
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium text-zinc-800 text-sm leading-snug truncate">
            {data.title.length > 26 ? data.title.slice(0, 26) + '…' : data.title}
          </span>
          {!isCompareMode && (
            <span className="text-[11px] font-medium text-zinc-400 group-hover:text-violet-500 transition-colors shrink-0">
              Edit ›
            </span>
          )}
        </div>

        <div className="mt-1 text-zinc-500 text-xs overflow-hidden max-h-8">
          <JsonViewer {...viewerConfig} value={data.data} />
        </div>

        <p className="mt-1.5 text-[11px] text-zinc-400">{lastUpdated}</p>
      </div>
    </div>
  );
}
