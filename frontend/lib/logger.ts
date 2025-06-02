import { API_BASE_URL } from "@/lib/api"

type LogLevel = "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  event: string
  data?: Record<string, any>
  timestamp: string
}

function formatTimestamp(date: Date): string {
  return date.toISOString()
}

export function log(level: LogLevel, event: string, data?: Record<string, any>) {
  const timestamp = formatTimestamp(new Date())

  const entry: LogEntry = {
    level,
    event,
    data,
    timestamp,
  }

  // Local dev output
  const message = `[${timestamp}] [${level.toUpperCase()}] ${event}`
  if (level === "info") {
    console.info(message, data || "")
  } else if (level === "warn") {
    console.warn(message, data || "")
  } else {
    console.error(message, data || "")
  }

  // Forward to backend
  fetch(`${API_BASE_URL}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  }).catch((err) => {
    console.warn("Failed to send log", err)
  })

  return entry
}
