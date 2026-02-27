import React, { useEffect, useRef, useState } from "react";
import JsonEditor from "../jsonEditor";
import { JsonInput } from "@/services/JsonManager";
import { EditStatus, JsonFile } from "@/types/json";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "../ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog";

export type JSONCreateProps = {
  data?: JsonFile | null
  onAdd?: (data: JsonFile) => void
  onDelete?: (id: string) => void
  mode: EditStatus
}

export default function JsonCreate(props: JSONCreateProps) {
  const titleInput = useRef<HTMLInputElement>(null);
  // Tracks the currently edited JSON value from the editor
  const editedJsonRef = useRef<unknown>(null);
  // Initial content passed to the editor when a JSON is selected
  const [content, setContent] = useState<unknown>({});
  const currentId = useRef<string | null>(null);
  const [showTitleError, setShowTitleError] = useState(false);
  const [btnSaveIsDisabled, setBtnSaveIsDisabled] = useState<boolean>(false);

  const { toast } = useToast();

  // When selected JSON changes
  useEffect(() => {
    if (!titleInput.current || !props.data?.title) return;

    titleInput.current.value = props.data.title;
    setContent(props.data.data);
    currentId.current = props.data.id;
  }, [props.data, props.mode]);

  useEffect(() => {
    if (props.mode === EditStatus.new) {
      cleanData();
      titleInput.current?.focus();
    }
  }, [props.mode]);

  const onChange = (item: string | null) => {
    // item is null when the editor reports a validation error
    if (!item) {
      setBtnSaveIsDisabled(true);
      return;
    }
    setBtnSaveIsDisabled(false);
    editedJsonRef.current = item;
  };

  const save = () => {
    if (!titleInput.current?.value) {
      titleInput.current?.focus();
      setShowTitleError(true);
      return;
    }

    // Use editedJsonRef if user changed the JSON, otherwise fall back to the displayed content
    const payloadData = editedJsonRef.current || content;

    if (!payloadData) return;

    const title = titleInput.current.value;
    const id = props.mode === EditStatus.view ? currentId.current : crypto.randomUUID();
    if (!id) return;

    const payload: JsonInput = { id, title, data: payloadData };
    props.onAdd?.(payload);
    toast({
      title: `Your json has been saved`,
      description: title,
    });
  };

  const remove = () => {
    if (!props.data?.id) return;
    props.onDelete?.(props.data.id.toString());
    cleanData();
  };

  const cleanData = () => {
    editedJsonRef.current = null;
    setContent({});
    setShowTitleError(false);
    if (titleInput.current?.value) titleInput.current.value = '';
  };

  const shouldDisplayEditor = (): boolean => {
    return !!props.data || props.mode === EditStatus.new;
  };

  const isDeleteDisabled = props.mode === EditStatus.new || !props.data;

  return (
    <div className="h-full">
      <div className={`flex items-center justify-center text-2xl text-black ${shouldDisplayEditor() ? 'hidden' : ''}`}>
        <p>No JSON to display</p>
      </div>
      <div className={`${shouldDisplayEditor() ? '' : 'hidden'} flex flex-col h-full`}>
        <div className="flex text-black items-center justify-between h-14 mb-3 gap-4">
          <Input
            onChange={(item) => {
              if (item.target.value.length === 0) {
                setBtnSaveIsDisabled(true);
                setShowTitleError(true);
                return;
              }
              setShowTitleError(false);
              setBtnSaveIsDisabled(false);
            }}
            ref={titleInput}
            className="border-none bg-gray-100 rounded pl-3"
            type="text"
            maxLength={200}
            placeholder="New title for your JSON"
          />
          <div className="flex gap-4">
            <Button type="button" onClick={save} variant="outline" disabled={btnSaveIsDisabled}>
              Save
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isDeleteDisabled}>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild onClick={remove}>
                    <Button type="button" variant="destructive">Continue</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {showTitleError && (
          <Alert variant="destructive" className="m-1">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Title is required. Please enter a title.</AlertDescription>
          </Alert>
        )}
        <div className="h-full">
          <JsonEditor data={content} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
