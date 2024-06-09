import {useEffect, useRef} from "react";
import JSONEditor, {JSONEditorOptions} from "jsoneditor";

export type JSONEditorProps = {
  data: unknown
  onChange: (data: any) => void
}
export default function JsonEditor(props: JSONEditorProps) {
  const isEditorLoaded = useRef<boolean>(false);
  let editor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    console.log('props.values JsonEditor', props.data);
    editor.current?.set(props.data)
  }, [props.data]);
  useEffect(() => {
    console.log('JsonEditor', isEditorLoaded.current)
    if (isEditorLoaded.current) {
      return
    }
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
    editor.current = new JSONEditor(container, options, props.data)
    isEditorLoaded.current = true
  }, [])

  return <div id="jsoneditor" className={'w-full h-full'}></div>
}
