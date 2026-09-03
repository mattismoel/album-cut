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
    console.log("cleaning up...")
    fs.rm(tmpDir, { recursive: true })
  }

  try {
    const coverExt = path.extname(album.coverArt.name)
    const coverPath = path.join(tmpDir, `cover${coverExt}`)

    console.log("saving cover art...")
    await saveFile(album.coverArt, coverPath)
    console.log("saved cover art...")

    const fileName = `${formatArtistsNames(album.albumArtists)} - ${album.title} (${album.releaseDate})`

    console.log("downloading video...")
    const videoOutPath = await downloadVideo(url, tmpDir, fileName, "bestaudio", browser)
    console.log("downloaded video...")
    console.log("converting file...")
    const audioOutPath = await convertFile(videoOutPath, "mp3")
    console.log("converted file...")

    console.log("cutting tracks...")
    const trackPaths = await cutTracks(audioOutPath, tracks, {
      ...album,
      album: album.title,
      coverArt: coverPath,
    })
    console.log("cut tracks...")

    const zipOutPath = path.join(tmpDir, `${fileName}.zip`)

    console.log("zipping files...")
    await zipFiles(zipOutPath, [...trackPaths, coverPath], { deleteOriginal: true })
    console.log("zipped files...")

    console.log("creating download...")
    const downloadId = createDownload(zipOutPath)

    console.log("redirecting...")
    redirect(303, `/download?id=${downloadId}`)
  } catch (err) {
    console.error(err)
    if (isRedirect(err)) throw err

    cleanUp(tmpDir)
    throw err
  }
})

