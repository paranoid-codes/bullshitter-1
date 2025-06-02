"use client"

interface UploadStatusSummaryProps {
  total: number
  success: number
  error: number
  pending: number
}

export default function UploadStatusSummary({ total, success, error, pending }: UploadStatusSummaryProps) {
  if (total === 0) return null

  return (
    <div className="border rounded-lg p-4 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <span className="text-muted-foreground">Total: {total}</span>
          {success > 0 && <span className="text-green-600 dark:text-green-400">Success: {success}</span>}
          {error > 0 && <span className="text-destructive">Failed: {error}</span>}
          {pending > 0 && <span className="text-muted-foreground">Pending: {pending}</span>}
        </div>
      </div>
    </div>
  )
}
