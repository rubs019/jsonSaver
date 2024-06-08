import {useEffect, useRef} from "react";
import JSONEditor, {JSONEditorOptions} from 'jsoneditor'

export default function JsonCreate() {
  const isEditActive = useRef<boolean>(false);
  useEffect(() => {
    if (isEditActive.current) {
      return
    }
    const container = document.getElementById("jsoneditor")
    if(!container) {
      console.log("Could not find JSON Editor")
      return
    };
    const options: JSONEditorOptions = {
      mode: "code",
    }
    const editor = new JSONEditor(container, options, {test: 'Rubz'})
    isEditActive.current = true
  }, [])
  return (<div id="jsoneditor" className={'w-full h-full'}></div>)
}
