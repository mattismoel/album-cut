import fs from "node:fs"
import { error, type RequestHandler } from "@sveltejs/kit";
import path from "path";
import { getDownload, removeDownload } from "$lib/downloads";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get("id")

  if (!id) {
    error(400, "No file path specified")
  }

  const filePath = getDownload(id)

  if (!filePath) {
    error(404, "Download expired")
  }

  if (!fs.existsSync(filePath)) {
    removeDownload(id)
    error(404, "File missing")
  }

  const file = fs.readFileSync(filePath)

  const stat = fs.statSync(filePath)
  const stream = fs.createReadStream(filePath)

  stream.on("close", () => {
    const dir = path.dirname(id)
    fs.rmSync(dir, { recursive: true, force: true })
    removeDownload(id)
  })

  const fileName = path.basename(filePath)

  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": stat.size.toString(),
      "Content-Disposition": `attachment; filename="${fileName}"`
    },
  })
}
