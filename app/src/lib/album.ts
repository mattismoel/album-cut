import z from "zod"
import { createCompoundCommand, execAsync, quote } from "./cmd"
import path from "node:path"

const timestampSchema = z.string().regex(/[0-9]+:[0-9]+:[0-9]+/i)

const trackSchema = z.object({
  title: z.string().nonempty(),
  trackNumber: z.int().positive(),

  from: timestampSchema,
  to: timestampSchema,
})

const trackFormSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  trackNumber: z.int().positive(),

  from: timestampSchema,
  to: timestampSchema,
})

export const albumFormSchema = z.object({
  url: z.url({ hostname: /^youtu\.be$/ }),
  title: z.string().nonempty(),
  albumArtist: z.string().nonempty(),
  releaseDate: z.int().positive(),
  genre: z.string().nonempty(),
  coverArt: z.file().mime(["image/png", "image/jpeg"]),
  tracks: trackFormSchema.array().min(1)
})

type Metadata = {
  album: string;
  albumArtist: string;
  releaseDate: number;
  genre: string;
  coverArt: string,
}

/**
 * @description Cuts the input file into the specified tracks and returns the filepaths to the cut tracks.
 */
export const cutTracks = async (filePath: string, tracks: Track[], metadata: Metadata) => {
  const ext = path.extname(filePath)
  const dir = path.dirname(filePath)

  const createFileName = (track: Track, ext: string) => {
    return `${track.trackNumber} - ${track.title}${ext}`
  }

  let filePaths: string[] = []

  const trackCmds = tracks.map(t => {
    const fileName = createFileName(t, ext)
    const filePath = path.join(dir, fileName)

    filePaths.push(filePath)

    return [
      "-id3v2_version", "3",
      "-ss", t.from,
      "-to", t.to,
      "-c", "copy",
      "-metadata:s:v", `title="Album cover"`,
      "-metadata:s:v", `comment="Cover (front)"`,
      "-metadata", `title="${t.title}"`,
      "-metadata", `track="${t.trackNumber}"`,
      "-metadata", `album="${metadata.album}"`,
      "-metadata", `genre="${metadata.genre}"`,
      "-metadata", `album_artist="${metadata.albumArtist}"`,
      "-metadata", `artist="${metadata.albumArtist}"`,
      "-metadata", `date="${metadata.releaseDate}"`,
      quote(filePath)
    ]
  })

  const cmd = createCompoundCommand(
    "ffmpeg",
    "-i", quote(filePath),
    "-i", quote(metadata.coverArt),
    "-map", "0:0",
    "-map", "1:0",
    ...trackCmds.flat(),
  )

  await execAsync(cmd)

  return filePaths
}

type Track = z.infer<typeof trackSchema>
export type TrackFormSchema = z.infer<typeof trackFormSchema>
