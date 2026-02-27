import React, { useEffect, useRef, useState } from "react";
import JsonEditor from "../jsonEditor";
import { JsonInput } from "@/services/JsonManager";
import { EditStatus, JsonFile } from "@/types/json";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, FileJson } from "lucide-react";
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
      {/* Empty state */}
      <div className={`h-full flex-col items-center justify-center text-center gap-4 ${shouldDisplayEditor() ? 'hidden' : 'flex'}`}>
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
          <FileJson className="w-7 h-7 text-zinc-400" />
        </div>
        <div>
          <p className="font-display font-semibold text-zinc-600 text-base">No JSON selected</p>
          <p className="text-sm text-zinc-400 mt-1">Pick one from the sidebar or create a new one</p>
        </div>
      </div>

      {/* Editor */}
      <div className={`${shouldDisplayEditor() ? 'flex' : 'hidden'} flex-col h-full`}>
        <div className="flex items-center justify-between mb-3 gap-3">
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
            className="bg-zinc-50 border-zinc-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-zinc-900 placeholder:text-zinc-400 font-medium rounded-lg"
            type="text"
            maxLength={200}
            placeholder="JSON title…"
          />
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              onClick={save}
              disabled={btnSaveIsDisabled}
            >
              Save
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleteDisabled}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium"
                >
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
                    <Button type="button" variant="destructive">Delete</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {showTitleError && (
          <Alert variant="destructive" className="mb-3">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Title required</AlertTitle>
            <AlertDescription>Please enter a title before saving.</AlertDescription>
          </Alert>
        )}
        <div className="flex-1 min-h-0">
          <JsonEditor data={content} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
