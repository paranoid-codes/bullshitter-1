import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { serveStatic } from "hono/bun"
import { v4 as uuidv4 } from "uuid"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { z } from "zod"

const app = new Hono()

app.use("*", cors())
app.use("*", logger())

const UPLOAD_DIR = join(process.cwd(), "uploads")
mkdirSync(UPLOAD_DIR, { recursive: true })

app.post("/upload", async (c) => {
  const traceId = uuidv4()
  const log = (msg: string, data?: any) => {
    console.log(`[TRACE ${traceId}] ${msg}`, data || "")
  }

  log("=== [UPLOAD INITIATED] ===")
  log(`Request: ${c.req.method} ${c.req.url}`)
//   log("Headers:", Object.fromEntries(c.req.raw.headers))

  const form = await c.req.formData()
  const raw = form.get("file")

  if (!(raw instanceof File)) {
    log("❌ Invalid File object")
    return c.json({ error: "Invalid file upload payload", traceId }, 400)
  }

  const file = raw as File
  log("File metadata:", {
    name: file.name,
    size: file.size,
    type: file.type,
  })

  if (!file.name || !file.name.endsWith(".txt")) {
    log("❌ Invalid file extension")
    return c.json({ error: "Only .txt files allowed", traceId }, 400)
  }

  try {
    log("Reading file into buffer...")
    const buffer = Buffer.from(await file.arrayBuffer())

    const filePath = join(UPLOAD_DIR, file.name)
    log(`Writing file to: ${filePath}`)
    writeFileSync(filePath, buffer)

    log(`✅ File saved successfully`)
    log("=== [UPLOAD COMPLETE] ===\n")

    return c.json({ status: "success", filename: file.name, traceId })
  } catch (err) {
    log("❌ Write error:", err)
    return c.json({ error: "Failed to save file", traceId }, 500)
  }
})




const LogSchema = z.object({
  level: z.enum(["info", "warn", "error"]),
  event: z.string(),
  data: z.any().optional(),
  timestamp: z.string(),
})

app.post("/log", async (c) => {
  const log = await c.req.json()
  const result = LogSchema.safeParse(log)
  if (!result.success) {
    return c.json({ error: "Invalid log format" }, 400)
  }

  const { level, event, data, timestamp } = result.data
  console[level]?.(`[${timestamp}] [${level.toUpperCase()}] ${event}`, data || "")
  return c.json({ status: "received" })
})

app.get("/health", (c) => c.json({ status: "ok" }))
app.use("/*", serveStatic({ root: "./public" }))

export default app
