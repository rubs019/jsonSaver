import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { JsonViewer, JsonViewerProps } from "@textea/json-viewer";
import { JsonInputWithDate } from "@/services/JsonManager";
import { EditStatus, JsonFile } from "@/types/json";
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
  const lastUpdated = dayjs(data.lastUpdated).format("YYYY-MM-DD HH:mm:ss");

  const isCompareMode = mode === EditStatus.compare
  const selectionIndex = compareSelections
    ? compareSelections.findIndex((s) => s?.id === data.id)
    : -1
  const isSelected = selectionIndex !== -1
  const selectionLabel = selectionIndex === 0 ? 'A' : selectionIndex === 1 ? 'B' : null
  const bothSelected = compareSelections ? compareSelections[0] !== null && compareSelections[1] !== null : false
  const isDisabled = isCompareMode && bothSelected && !isSelected

  return (
    <div className="flex flex-col justify-between mb-2">
      <div className="flex justify-between">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {isCompareMode && (
            <div className="flex items-center mt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                readOnly
                className="w-4 h-4 cursor-pointer disabled:opacity-40"
              />
              {selectionLabel && (
                <span className="ml-1 text-xs font-bold text-blue-600">{selectionLabel}</span>
              )}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span>
              {data.title.length > 24
                ? data.title.slice(0, 24) + '...'
                : data.title}
            </span>
            <div className="overflow-auto">
              <JsonViewer {...viewerConfig} value={data.data} />
            </div>
          </div>
        </div>
        {!isCompareMode && (
          <div className="flex flex-col items-end justify-between gap-4 shrink-0">
            <div className="flex gap-1 cursor-pointer">
              <FontAwesomeIcon icon={faPenToSquare} />
              Edit
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <span className="self-end text-xs">Last updated : {lastUpdated}</span>
      </div>
    </div>
  );
}
