import path from "node:path"
import { createCompoundCommand, execAsync, quote } from "./cmd"

type Format = "mp3"

const FORMAT_TO_EXTENSION: Record<Format, string> = {
  mp3: ".mp3"
}

/**
 * @description Converts a file at the specified file path to the given format
 *
 * @param filePath - Path to the file to be converted.
 * @param format - The desired output format. The format will map to the fitting file extension.
 */
export const convertFile = async (filePath: string, format: Format) => {
  const ext = path.extname(filePath)
  const outPath = filePath.replace(ext, FORMAT_TO_EXTENSION[format])

  const cmd = createCompoundCommand(
    "ffmpeg", "-i", quote(filePath), quote(outPath)
  )

  await execAsync(cmd)
  return outPath
}
