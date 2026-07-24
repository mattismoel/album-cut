import path from "path"
import { createCompoundCommand, execAsync, quote } from "./cmd"

export type Format = "bestaudio"

/**
 * @description Downloads the YouTube video at the input URL, and puts it in the input output directory.
 * @param url - The YouTube URL to download from. It MUST come from the 'Share' menu on the YouTube page.
 * @param outDir - The directory to put the downloaded file in.
 * @param format - The format to use.
 */
export const downloadVideo = async (url: string, outDir: string, fileName: string, format: Format) => {
  let cmd = createCompoundCommand(
    "yt-dlp",
    "-f", format,
    "-o", path.join(outDir, quote(`${fileName}.%(ext)s`)),
    "--print", "after_move:filepath",
    url,
  )

  const { stdout } = await execAsync(cmd)

  return stdout.trim()
}
