import { useEffect, useRef } from "react";
import JSONEditor, {JSONEditorOptions} from "jsoneditor";

export interface JSONEditorProps {
  data: unknown
  onChange: (data: any) => void
}
export default function JsonEditor(props: JSONEditorProps) {
  const isEditorLoaded = useRef<boolean>(false);
  let editor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    editor.current?.update(props.data)
  }, [props.data]);

  useEffect(() => {
    const isBrowser = typeof window !== 'undefined'
    if (isBrowser) {

      import('jsoneditor').then((jsoneditor) => {  // <----------- Import if is browser

        if (isEditorLoaded.current) { return }
        const JsonEditor = jsoneditor.default;
        const container = document.getElementById("jsoneditor")
        if (!container) {
          console.log("Could not find JSON Editor")
          return
        }
        const options: JSONEditorOptions = {
          mode: "code",
          onChange: async () => {
            const errors = await editor.current?.validate()
            if (errors && errors.length > 0) {
              console.log("errors", errors)
              return
            }
            props.onChange(editor.current?.get())
          }
        }

        editor.current = new JsonEditor(container, options, props.data)

        isEditorLoaded.current = true
      })
    }
  }, [props.data])

  return <div id="jsoneditor" className={'w-full h-full'}></div>
}
