import fs from "fs"
import { form } from "$app/server";

import { albumFormSchema } from "./album";
import { createTempDir } from "./cmd";
import { downloadVideo } from "./yt-dlp";
import { convertFile } from "./ffmpeg";

export const createAlbum = form(albumFormSchema, async (data) => {
  const tmpDir = createTempDir("album-cut")

  const cleanUp = (tmpDir: string) => {
    console.log("clean-up...")
    console.log("removing tmp dir", tmpDir)
    fs.rmSync(tmpDir, { recursive: true })
  }

  try {
    console.log("downloading video", data.url)
    const videoOutPath = await downloadVideo(data.url, tmpDir, "bestaudio")
    console.log("downloaded video to", videoOutPath)

    console.log("converting video to audio...")
    const audioOutPath = await convertFile(videoOutPath, "mp3")
    console.log("converted to audio at", audioOutPath)
  } catch (err) {
    cleanUp(tmpDir)
    throw err
  }

  cleanUp(tmpDir)
})

