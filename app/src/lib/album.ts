import z from "zod"
import { createCompoundCommand, execAsync, quote } from "./cmd"
import path from "node:path"

const timestampSchema = z.string().regex(/[0-9]+:[0-9]+:[0-9]+/i)

const trackSchema = z.object({
  title: z.string().nonempty(),
  trackNumber: z.int().positive(),

  from: timestampSchema,
  to: timestampSchema,

  artists: z.string().nonempty().array(),
})

const trackFormSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  trackNumber: z.int().positive(),

  artists: z.string().nonempty().array().min(1),

  from: timestampSchema,
  to: timestampSchema,
})

export const albumFormSchema = z.object({
  url: z.url({ hostname: /^youtu\.be$/ }),
  title: z.string().nonempty(),
  albumArtists: z.string().nonempty().array().nonempty(),
  releaseDate: z.int().positive(),
  genres: z.string().array(),
  coverArt: z.file().mime(["image/png", "image/jpeg"]),
  tracks: trackFormSchema.array().min(1)
})

type Metadata = {
  album: string;
  albumArtists: string[];
  releaseDate: number;
  genres: string[];
  coverArt: string,
}

export const formatArtistsNames = (artists: string[]) => {
  if (artists.length === 0) throw Error("No artists to format from")

  if (artists.length === 1) return artists[0]

  const lastArtist = artists[artists.length - 1]

  const groupedArtists = artists.slice(0, -1)

  return `${groupedArtists.join(", ")} & ${lastArtist}`
}

/**
 * @description Cuts the input file into the specified tracks and returns the filepaths to the cut tracks.
 */
export const cutTracks = async (filePath: string, tracks: Track[], metadata: Metadata) => {
  const ext = path.extname(filePath)
  const dir = path.dirname(filePath)

  const createTitle = (track: Track) => {
    // If there are artists add a featuring section to the filename.
    if (track.artists && track.artists.length > 1) {
      return `${track.title} (feat. ${track.artists.slice(1).join(", ")})`
    }

    return `${track.title}`
  }

  const createFileName = (track: Track, ext: string) => {
    return `${track.trackNumber} - ${createTitle(track)}${ext}`
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
      "-metadata", `title="${createTitle(t)}"`,
      "-metadata", `track="${t.trackNumber}"`,
      "-metadata", `album="${metadata.album}"`,
      "-metadata", `genre="${metadata.genres.join(";")}"`,
      "-metadata", `album_artist="${metadata.albumArtists.join("; ")}"`,
      "-metadata", `artist="${t.artists.join("; ")}"`,
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
