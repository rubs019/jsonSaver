import { useEffect, useRef } from "react";
import JSONEditor, {JSONEditorOptions} from "jsoneditor";

export interface JSONEditorProps {
  data: unknown
  onChange: (data: string | null) => void
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
        const htmlContainer = document.getElementById("jsoneditor")
        if (!htmlContainer) {
          console.log("Could not find JSON Editor")
          return
        }
        const options: JSONEditorOptions = {
          mode: "code",
          onChange: handleOnChangeEditor
        }

        editor.current = new JsonEditor(htmlContainer, options, props.data)

        isEditorLoaded.current = true
      })
    }
  }, [props.data])
  
  const handleOnChangeEditor = async function() {
    try {
      const jsonValue = editor.current?.get();
      const errors = await editor.current?.validate()

      if (errors && errors.length > 0) {
        console.log("errors", errors)
        throw new Error("parse error");
      }
      props.onChange(jsonValue)
    } catch(e) {
      props.onChange(null)
    }
  }

  return <div id="jsoneditor" className={'w-full h-full pb-10'}></div>
}
