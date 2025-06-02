"use client"

import { Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadActionsBarProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onClearAll: () => void
  onUpload: () => void
  isUploading: boolean
  pendingCount: number
}

export default function UploadActionsBar({
  viewMode,
  onViewModeChange,
  onClearAll,
  onUpload,
  isUploading,
  pendingCount,
}: UploadActionsBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-medium">Files</h3>
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-7 w-7 p-0"
          >
            <Grid3X3 className="h-3 w-3" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-7 w-7 p-0"
          >
            <List className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onClearAll} disabled={isUploading}>
          Clear All
        </Button>
        <Button onClick={onUpload} disabled={pendingCount === 0 || isUploading} size="sm">
          {isUploading ? "Uploading..." : `Upload ${pendingCount} Files`}
        </Button>
      </div>
    </div>
  )
}
