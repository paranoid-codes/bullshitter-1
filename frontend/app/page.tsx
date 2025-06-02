"use client";

import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UploadActionsBar from "@/components/upload-actions-bar";
import UploadHeader from "@/components/upload-header";
import UploadDropzone from "@/components/upload-dropzone";
import UploadFileList from "@/components/upload-file-list";
import UploadStatusSummary from "@/components/upload-status-summary";
import { log } from "@/lib/logger";
import { API_BASE_URL } from "@/lib/api"

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function FileUploader() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const addFiles = (newFiles: File[]) => {
    const fileUploads: FileUpload[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...fileUploads]);
    log("info", "Files added", {
      count: newFiles.length,
      names: newFiles.map((f) => f.name),
    });
  };

 const simulateUpload = async (fileUpload: FileUpload) => {
  const updateProgress = (
    progress: number,
    status: FileUpload["status"] = "uploading"
  ) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileUpload.id ? { ...f, progress, status } : f
      )
    )
  }

  updateProgress(0, "uploading")

  const formData = new FormData()
  formData.append("file", fileUpload.file)

  try {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error("Upload failed")

    updateProgress(100, "success")
    log("info", "Upload success", { filename: fileUpload.file.name })
  } catch (err) {
    updateProgress(0, "error")
    log("error", "Upload failed", {
      filename: fileUpload.file.name,
      message: (err as Error).message,
    })
  }
}

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    log("info", "Upload started", { count: pendingFiles.length });
    await Promise.all(pendingFiles.map(simulateUpload));
    setIsUploading(false);
    log("info", "Upload completed", { count: pendingFiles.length });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <UploadHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Storage Path Panel */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FolderOpen className="h-4 w-4" />
              <span>Target storage folder:</span>
              <code className="bg-muted px-2 py-1 rounded text-foreground">
                ~/Shares/...
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Upload Dropzone */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <UploadDropzone onFilesSelected={addFiles} />
          </CardContent>
        </Card>

        {/* Upload Actions & File List */}
        {files.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <UploadActionsBar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onClearAll={clearAll}
                onUpload={handleUpload}
                isUploading={isUploading}
                pendingCount={pendingCount}
              />
              <UploadFileList
                files={files}
                viewMode={viewMode}
                isUploading={isUploading}
                onRemove={removeFile}
              />
            </CardContent>
          </Card>
        )}

        {/* Upload Summary */}
        <UploadStatusSummary
          total={files.length}
          success={successCount}
          error={errorCount}
          pending={pendingCount}
        />
      </div>
    </div>
  );
}
