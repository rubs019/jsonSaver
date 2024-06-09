import {useRef} from "react";
import Button from "../ui/button/Button";
import JsonManager, {JsonInput} from "@/services/JsonManager";
import JsonEditor from "../jsonEditor";

export type JSONCreateProps = {
  data: unknown
  onAdd: (id: string) => void
}
export default function JsonCreate(props: JSONCreateProps) {
  const jsonManager = new JsonManager();
  const titleInput = useRef<HTMLInputElement>(null);
  const data = useRef<unknown>(null);

  const onChange = (item: string) => {
    console.log('onChange triggered', item);
    data.current = item
  }
  const save = () => {
    console.log("save")
    console.log("payload", data.current)

    if (!titleInput.current?.value) {
      console.log('Title is required', titleInput.current)
      return
    }
    const payloadData = data.current
    if (!payloadData) {
      console.log('Data is required', payloadData)
      return
    }
    const payload: JsonInput = {
      id: crypto.randomUUID(),
      title: titleInput.current.value,
      data: payloadData
    }

    console.log("payload", payload)

    jsonManager.save(payload)
    props.onAdd(payload.id)
  }
  return (
      <div  className={'p-3 h-full'}>
        <div className={'flex text-black items-center justify-between'}>
          <span className={'text-xl'}>Title</span>
          <input ref={titleInput} className={'w-2/4 border-none bg-gray-50 rounded h-14 pl-3'} type="text" placeholder={'Enter a new title'}/>
          <div className={'w-1/4'}>
            <Button type={'secondary'} onClick={save}>Save</Button>
          </div>
        </div>
        <JsonEditor data={props.data} onChange={onChange} />
      </div>
  )
}
