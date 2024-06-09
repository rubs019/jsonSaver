import React, {useEffect, useRef, useState} from "react";
import Button from "../ui/button/Button";
import JsonManager, {JsonInput} from "@/services/JsonManager";
import JsonEditor from "../jsonEditor";
import JsonFile from "@/shared/types/JsonFile";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";

export type JSONCreateProps = {
  data?: JsonFile
  onAdd?: (id: string) => void
  onDelete?: (id: string) => void
}
export default function JsonCreate(props: JSONCreateProps) {
  const jsonManager = new JsonManager();
  const titleInput = useRef<HTMLInputElement>(null);
  const data = useRef<unknown>(null);
  const [content, setContent] = useState<unknown>({});
  const errorTitle = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!titleInput.current || !props.data?.title) return

    titleInput.current.value = props.data.title
    setContent(props.data.data)
  }, [props.data]);

  const onChange = (item: string) => {
    data.current = item
  }
  const save = () => {

    if (!titleInput.current?.value) {
      console.log('Title is required', titleInput.current)
      titleInput.current?.focus()
      errorTitle.current?.classList.remove("hidden")
      return
    }
    const payloadData = data.current
    if (!payloadData) {
      console.log('Data is required', payloadData)
      return
    }
    const payload: JsonInput = {
      id: props.data?.id.toString() || crypto.randomUUID(),
      title: titleInput.current.value,
      data: payloadData
    }

    jsonManager.save(payload)
    props.onAdd?.(payload.id)
  }

  const remove = () => {
    console.log("delete", props.data?.id)
    if (!props.data?.id) {
      console.log('ID is required', props.data?.id)
      return
    }
    props.onDelete?.(props.data.id.toString())
    cleanData()
  }

  const cleanData = () => {
    data.current = null
    setContent({})
    if (titleInput.current?.value) titleInput.current.value = ''
  }

  return (
      <div className={'h-full'}>
        <div className={'flex text-black items-center justify-between h-14 mb-3'}>
          <span className={'text-xl'}>Title</span>
          <input onChange={(item) => {
            if (item.target.value.length === 0) {
              errorTitle.current?.classList.remove('hidden')
              return
            }
            if (!errorTitle.current?.classList.contains('hidden')) {
              errorTitle.current?.classList.add('hidden')
            }
          }} ref={titleInput} className={'w-2/4 border-none bg-gray-100 rounded h-full pl-3'} type="text"
                 maxLength={200}
                 placeholder={'Enter a new title'}/>
          <div className={'w-1/4'}>
            <Button type={'secondary'} onClick={save}>Save</Button>
          </div>
          <div className={'w-24'}>
            <Button type={'danger'} onClick={remove}><span className={'flex items-center gap-1'}><FontAwesomeIcon
                icon={faXmark}/>Delete</span></Button>
          </div>
        </div>
        <div className={'my-3'}>
          <p className={'bg-red-500 p-3 hidden'} ref={errorTitle}>Title is required</p>
        </div>
        <JsonEditor data={content} onChange={onChange}/>
      </div>
  )
}
