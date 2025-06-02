"use client"

import { FileCard } from "@/components/file-card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FileUpload {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

interface UploadFileListProps {
  files: FileUpload[]
  viewMode: "grid" | "list"
  isUploading: boolean
  onRemove: (id: string) => void
}

export default function UploadFileList({ files, viewMode, isUploading, onRemove }: UploadFileListProps) {
  if (files.length === 0) return null

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 group">
        {files.map((fileUpload) => (
          <FileCard
            key={fileUpload.id}
            fileUpload={fileUpload}
            onRemove={onRemove}
            disabled={isUploading}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {files.map((fileUpload) => (
        <div key={fileUpload.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{fileUpload.file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(fileUpload.id)}
              disabled={fileUpload.status === "uploading"}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {fileUpload.status === "uploading" && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading...</span>
                <span>{fileUpload.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${fileUpload.progress}%` }}
                />
              </div>
            </div>
          )}

          {fileUpload.status === "error" && fileUpload.error && (
            <div className="text-sm text-destructive">{fileUpload.error}</div>
          )}

          {fileUpload.status === "success" && (
            <p className="text-sm text-green-600 dark:text-green-400">Upload completed successfully</p>
          )}
        </div>
      ))}
    </div>
  )
}
