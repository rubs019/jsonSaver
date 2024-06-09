import {useEffect, useRef} from "react";
import JSONEditor, {JSONEditorOptions} from "jsoneditor";

export type JSONEditorProps = {
  data: unknown
  onChange: (data: any) => void
}
export default function JsonEditor(props: JSONEditorProps) {
  const isEditActive = useRef<boolean>(false);
  let editor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    if (isEditActive.current) {
      return
    }
    const container = document.getElementById("jsoneditor")
    if (!container) {
      console.log("Could not find JSON Editor")
      return
    }
    ;
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
    isEditActive.current = true
  }, [])

  return <div id="jsoneditor" className={'w-full h-3/4'}></div>
}
