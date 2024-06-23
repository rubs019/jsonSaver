import React, {useEffect, useRef, useState} from "react";
import JsonEditor from "../jsonEditor";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import { JsonInput } from "@/services/JsonManager";
import {JsonFile} from "@/app/page";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "../ui/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog";

export type JSONCreateProps = {
  data?: JsonFile | null
  onAdd?: (data: JsonFile) => void
  onDelete?: (id: string) => void
  mode: "new" | "view"
}
export default function JsonCreate(props: JSONCreateProps) {
  const titleInput = useRef<HTMLInputElement>(null);
  const data = useRef<unknown>(null);
  const [content, setContent] = useState<unknown>({});
  const currentId = useRef<string | null>(null);
  const errorTitle = useRef<HTMLDivElement | null>(null);
  const [btnSaveIsDisabled, setBtnSaveIsDisabled] = useState<boolean>(false);

  const { toast } = useToast()

  // When data is updated
  useEffect(() => {
    if (!titleInput.current || !props.data?.title) return

    titleInput.current.value = props.data.title
    setContent(props.data.data)
    currentId.current = props.data.id
  }, [props.data]);

  useEffect(() => {
    if (props.mode === 'new') {
      cleanData()
      titleInput.current?.focus()
    }
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
    const title = titleInput.current.value
    const id = props.mode === 'view' ? currentId.current : crypto.randomUUID()
    if (!id) return
    const payload: JsonInput = {
      id,
      title,
      data: payloadData
    }
    props.onAdd?.(payload)
    toast({
      title: `Your json has been saved`,
      description: `${title}`,
    })
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
          <div className={`flex text-black items-center justify-between h-14 mb-3 gap-4`}>
            <Input  
              onChange={(item) => {
                if (item.target.value.length === 0) {
                  setBtnSaveIsDisabled(true)
                  errorTitle.current?.classList.remove('hidden')
                  return
                }
                if (!errorTitle.current?.classList.contains('hidden')) {
                  errorTitle.current?.classList.add('hidden')
                }
                setBtnSaveIsDisabled(false)
              }} 
              ref={titleInput} 
              className={'border-none bg-gray-100 rounded pl-3'} type="text"
              maxLength={200}
              placeholder={'Enter a new title'}/>
            <div className={'flex gap-4'}>
                <Button type={'button'} onClick={save} disabled={btnSaveIsDisabled}>Save</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type={'button'} variant={'destructive'}>Delete</Button>
				  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={remove}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
          <div>
            <Alert variant="destructive" className={'m-1 hidden'} ref={errorTitle}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Title is required. Please enter a title.
              </AlertDescription>
            </Alert>
          </div>
          <div className={`h-2/3`}>
            <JsonEditor data={content} onChange={onChange}/>
          </div>
        </div>
      </div>
  )
}
