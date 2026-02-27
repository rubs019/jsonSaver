'use client'

import dynamic from 'next/dynamic'

const DiffEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.DiffEditor),
  { ssr: false }
)

interface DiffViewerProps {
  original: unknown
  modified: unknown
}

export default function DiffViewer({ original, modified }: DiffViewerProps) {
  const originalStr = JSON.stringify(original, null, 2)
  const modifiedStr = JSON.stringify(modified, null, 2)

  return (
    <DiffEditor
      original={originalStr}
      modified={modifiedStr}
      language="json"
      options={{
        readOnly: true,
        renderSideBySide: true,
      }}
      height="100%"
    />
  )
}
