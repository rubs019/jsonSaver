import React, {useEffect, useRef, useState} from "react";
import Button from "../ui/button/Button";
import JsonEditor from "../jsonEditor";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import JsonManager, { JsonInput } from "@/services/JsonManager";
import {JsonFile} from "@/app/page";

export type JSONCreateProps = {
  data?: JsonFile | null
  onAdd?: (data: JsonFile) => void
  onDelete?: (id: string) => void
  mode: "new" | "view"
}
export default function JsonCreate(props: JSONCreateProps) {
  const jsonManager = new JsonManager();
  const titleInput = useRef<HTMLInputElement>(null);
  const data = useRef<unknown>(null);
  const [content, setContent] = useState<unknown>({});
  const currentId = useRef<string | null>(null);
  const errorTitle = useRef<HTMLDivElement | null>(null);

  // When data is updated
  useEffect(() => {
    if (!titleInput.current || !props.data?.title) return

    titleInput.current.value = props.data.title
    setContent(props.data.data)
    currentId.current = props.data.id
  }, [props.data]);

  useEffect(() => {
    if (props.mode === 'new') cleanData()
  }, [props.mode]);

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

    // In case if the title only has changed
    const payloadData = data.current || content

    if (!payloadData) {
      console.log('Data is required', payloadData)
      return
    }
    const payload: JsonInput = {
      id: currentId.current || crypto.randomUUID(),
      title: titleInput.current.value,
      data: payloadData
    }
    props.onAdd?.(payload)
  }

  const remove = () => {
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

  const shouldDisplayEditor = () => {
    return props.data || props.mode === 'new'
  }

  return (
      <div className={`h-full`}>
        <div className={`flex items-center justify-center text-2xl text-black ${shouldDisplayEditor() ? 'hidden' : ''}`}>
          <p>No JSON to display</p>
        </div>
        <div className={`${shouldDisplayEditor() ? '' : 'hidden'} flex flex-col h-full`}>
          <div className={`flex text-black items-center justify-between h-14 mb-3 `}>
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
            <div className={'flex gap-4'}>
              <div className={'w-24'}>
                <Button type={'primary'} onClick={save}>Save</Button>
              </div>
              <div className={'w-24'}>
                <Button type={'danger'} onClick={remove}><span className={'flex items-center gap-2'}>
                <FontAwesomeIcon icon={faXmark} size={'xl'}/>Delete</span>
                </Button>
              </div>
            </div>
          </div>
          <div className={'my-3'}>
            <p className={'bg-red-500 p-3 hidden'} ref={errorTitle}>Title is required</p>
          </div>
          <div className={`h-2/3`}>
            <JsonEditor data={props.mode === 'view' ? content : {}} onChange={onChange}/>
          </div>
        </div>
      </div>
  )
}
