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
    console.log('props.values JsonEditor', props.data, editor.current);
    editor.current?.update(props.data)
  }, [props.data]);
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined'
    if (isBrowser) {

      import('jsoneditor').then((jsoneditor) => {  // <----------- Import if is browser

        if (isEditorLoaded.current) { return }
        console.log('JSONEditor ----->', jsoneditor);
        const JsonEditor = jsoneditor.default;
        const container = document.getElementById("jsoneditor")
        if (!container) {
          console.log("Could not find JSON Editor")
          return
        }
        const options: JSONEditorOptions = {
          mode: "code",
          onChange: async () => {
            console.log("JSONEditor onChange", editor.current?.getText())
            const errors = await editor.current?.validate()
            if (errors && errors.length > 0) {
              console.log("errors", errors)
              return
            }
            props.onChange(editor.current?.get())
          }
        }

        console.log("JSONEditor options", props)

        editor.current = new JsonEditor(container, options, props.data)

        isEditorLoaded.current = true
      })
    }
  }, [props])

  return <div id="jsoneditor" className={'w-full h-full'}></div>
}
