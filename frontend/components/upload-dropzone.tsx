"use client"

import { useRef, useState, useCallback } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


{/* !!!IMPORTANT: This component only accepts .filter files */}
{/* !!!IMPORTANT: Change .filter to anything to customize the accepted file type */}
interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void
  onDuplicatesDetected?: (duplicates: string[]) => void
}

export type UploadDropzoneHandle = {
  notifyDuplicates: (filenames: string[]) => void
}

export default function UploadDropzone({ onFilesSelected }: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showError = (msg: string) => {
    setErrorMessage(msg)
    setTimeout(() => setErrorMessage(""), 3000)
  }

  const filterFiles = (files: File[]) => {
    const valid = files.filter((f) => f.name.endsWith(".txt"))
    const invalid = files.length - valid.length
    if (invalid > 0) {
      showError(`Only .txt files are allowed. Ignored ${invalid} file${invalid > 1 ? "s" : ""}.`)
    }
    return valid
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = filterFiles(droppedFiles)
    onFilesSelected(validFiles)
  }, [onFilesSelected])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = filterFiles(selectedFiles)
    onFilesSelected(validFiles)
  }, [onFilesSelected])

  return (
    <div>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Drop .txt files here to upload</h3>
        <p className="text-muted-foreground mb-4">or click the button below to browse files</p>
        <Button onClick={() => fileInputRef.current?.click()} className="mb-2">
          Browse Files
        </Button>
        <p className="text-xs text-muted-foreground">Only .txt files are supported</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {errorMessage && (
        <div className="mt-3 text-sm text-destructive text-center">{errorMessage}</div>
      )}
    </div>
  )
}

