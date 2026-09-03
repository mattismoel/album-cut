import fs from "node:fs/promises"
import { form, getRequestEvent } from "$app/server";

import { albumFormSchema, cutTracks, formatArtistsNames } from "./album";
import { createTempDir, saveFile, zipFiles } from "./cmd";
import { downloadVideo } from "./yt-dlp";
import { convertFile } from "./ffmpeg";
import path from "path";
import { isRedirect, redirect } from "@sveltejs/kit";
import { createDownload } from "./downloads";
import { getBrowserFromRequest } from "./request";

export const createAlbum = form(albumFormSchema, async ({ url, tracks, ...album }) => {
  const { request } = getRequestEvent()

  const browser = "firefox"
  console.log("browser", browser)

  const tmpDir = await createTempDir("album-cut")

  const cleanUp = (tmpDir: string) => {
    fs.rm(tmpDir, { recursive: true })
  }

  try {
    const coverExt = path.extname(album.coverArt.name)
    const coverPath = path.join(tmpDir, `cover${coverExt}`)

    await saveFile(album.coverArt, coverPath)

    const fileName = `${formatArtistsNames(album.albumArtists)} - ${album.title} (${album.releaseDate})`

    const videoOutPath = await downloadVideo(url, tmpDir, fileName, "bestaudio", browser)
    const audioOutPath = await convertFile(videoOutPath, "mp3")

    const trackPaths = await cutTracks(audioOutPath, tracks, {
      ...album,
      album: album.title,
      coverArt: coverPath,
    })

    const zipOutPath = path.join(tmpDir, `${fileName}.zip`)

    await zipFiles(zipOutPath, [...trackPaths, coverPath], { deleteOriginal: true })

    const downloadId = createDownload(zipOutPath)

    redirect(303, `/download?id=${downloadId}`)
  } catch (err) {
    if (isRedirect(err)) throw err

    cleanUp(tmpDir)
    throw err
  }
})

