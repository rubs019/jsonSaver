import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { JsonViewer, JsonViewerProps } from "@textea/json-viewer";
import { JsonInputWithDate } from "@/services/JsonManager";
import dayjs from 'dayjs';

export type JsonPreviewsItemProps = {
  data: JsonInputWithDate
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

export default function JsonPreviewsItems(props: JsonPreviewsItemProps) {
  const lastUpdated = dayjs(props.data.lastUpdated).format("YYYY-MM-DD HH:mm:ss");

  return (
    <div className="flex flex-col justify-between mb-2">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>
            {props.data.title.length > 24
              ? props.data.title.slice(0, 24) + '...'
              : props.data.title}
          </span>
          <div className="overflow-auto">
            <JsonViewer {...viewerConfig} value={props.data.data} />
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-4">
          <div className="flex gap-1 cursor-pointer">
            <FontAwesomeIcon icon={faPenToSquare} />
            Edit
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <span className="self-end text-xs">Last updated : {lastUpdated}</span>
      </div>
    </div>
  );
}
