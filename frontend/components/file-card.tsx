"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Code,
  X,
  Check,
  AlertCircle,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUpload {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

interface FileCardProps {
  fileUpload: FileUpload
  onRemove: (id: string) => void
  disabled?: boolean
}

export function FileCard({ fileUpload, onRemove, disabled }: FileCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (!extension) return File

    // Image files
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico"].includes(extension)) {
      return FileImage
    }

    // Video files
    if (["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv", "3gp"].includes(extension)) {
      return FileVideo
    }

    // Audio files
    if (["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"].includes(extension)) {
      return FileAudio
    }

    // Archive files
    if (["zip", "rar", "7z", "tar", "gz", "bz2", "xz"].includes(extension)) {
      return Archive
    }

    // Code files
    if (
      [
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "css",
        "scss",
        "json",
        "xml",
        "py",
        "java",
        "cpp",
        "c",
        "php",
        "rb",
        "go",
        "rs",
        "swift",
      ].includes(extension)
    ) {
      return Code
    }

    // Text files
    if (["txt", "md", "doc", "docx", "pdf", "rtf"].includes(extension)) {
      return FileText
    }

    return File
  }

  const getStatusColor = (status: FileUpload["status"]) => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "error":
        return "text-destructive"
      case "uploading":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: FileUpload["status"]) => {
    switch (status) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "uploading":
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      default:
        return null
    }
  }

  const FileIcon = getFileIcon(fileUpload.file.name)

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md",
        fileUpload.status === "success" && "ring-1 ring-green-500/20",
        fileUpload.status === "error" && "ring-1 ring-destructive/20",
        fileUpload.status === "uploading" && "ring-1 ring-primary/20",
      )}
    >
      <CardContent className="p-4">
        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(fileUpload.id)}
          disabled={disabled || fileUpload.status === "uploading"}
        >
          <X className="h-3 w-3" />
        </Button>

        {/* File Icon */}
        <div className="flex justify-center mb-3">
          <div
            className={cn(
              "p-3 rounded-lg",
              fileUpload.status === "success" && "bg-green-500/10",
              fileUpload.status === "error" && "bg-destructive/10",
              fileUpload.status === "uploading" && "bg-primary/10",
              fileUpload.status === "pending" && "bg-muted",
            )}
          >
            <FileIcon className={cn("h-8 w-8", getStatusColor(fileUpload.status))} />
          </div>
        </div>

        {/* File Name */}
        <div className="text-center mb-2">
          <h3 className="font-medium text-sm truncate" title={fileUpload.file.name}>
            {fileUpload.file.name}
          </h3>
          <p className="text-xs text-muted-foreground">{formatFileSize(fileUpload.file.size)}</p>
        </div>

        {/* Status and Progress */}
        <div className="space-y-2">
          {fileUpload.status === "uploading" && (
            <div className="space-y-1">
              <Progress value={fileUpload.progress} className="h-1.5" />
              <p className="text-xs text-center text-muted-foreground">{fileUpload.progress}% uploaded</p>
            </div>
          )}

          {fileUpload.status === "success" && (
            <div className="flex items-center justify-center gap-1 text-green-500">
              <Check className="h-3 w-3" />
              <span className="text-xs">Upload complete</span>
            </div>
          )}

          {fileUpload.status === "error" && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-destructive mb-1">
                <AlertCircle className="h-3 w-3" />
                <span className="text-xs">Upload failed</span>
              </div>
              {fileUpload.error && <p className="text-xs text-muted-foreground">{fileUpload.error}</p>}
            </div>
          )}

          {fileUpload.status === "pending" && (
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <span className="text-xs">Ready to upload</span>
            </div>
          )}
        </div>

        {/* Download Button for Successful Uploads */}
        {/* {fileUpload.status === "success" && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 h-7 text-xs"
            onClick={() => {
              // Simulate download - in real app, this would download the file
              console.log("Downloading:", fileUpload.file.name)
            }}
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        )} */}
      </CardContent>
    </Card>
  )
}
