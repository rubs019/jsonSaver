import { useEffect, useRef } from "react";
import JSONEditor, { JSONEditorOptions } from "jsoneditor";

export interface JSONEditorProps {
  data: unknown
  onChange: (data: string | null) => void
}

export default function JsonEditor(props: JSONEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isEditorLoaded = useRef<boolean>(false);
  const editor = useRef<JSONEditor | null>(null);
  // Ref to always call the latest version of props.onChange (avoids stale closure)
  const onChangeRef = useRef(props.onChange);

  useEffect(() => {
    onChangeRef.current = props.onChange;
  }, [props.onChange]);

  useEffect(() => {
    editor.current?.update(props.data);
  }, [props.data]);

  // Initialize editor once on mount
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;

    import('jsoneditor').then((jsoneditor) => {
      if (isEditorLoaded.current || !containerRef.current) return;

      const JsonEditorClass = jsoneditor.default;

      const options: JSONEditorOptions = {
        mode: "code",
        onChange: handleOnChangeEditor,
      };

      editor.current = new JsonEditorClass(containerRef.current, options, props.data);
      isEditorLoaded.current = true;
    });

    return () => {
      editor.current?.destroy();
      editor.current = null;
      isEditorLoaded.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChangeEditor = async function () {
    try {
      const jsonValue = editor.current?.get();
      const errors = await editor.current?.validate();

      if (errors && errors.length > 0) {
        throw new Error("parse error");
      }
      onChangeRef.current(jsonValue);
    } catch {
      onChangeRef.current(null);
    }
  };

  return <div ref={containerRef} className="w-full h-full pb-10" />;
}
