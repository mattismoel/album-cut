import fs from "node:fs/promises"
import os from "os"
import path from "node:path"
import { promisify } from "node:util"
import { exec } from "node:child_process"

export const execAsync = promisify(exec)

/**
 * @description Creates a command out of the input parts.
 * @example - ["ffmpeg", "-i", "hello_world.webm", "hello_world.mp3"] -> "ffmpeg -i hello_world.webm hello_world.mp3".
 */
export const createCompoundCommand = (...parts: string[]) => {
  return parts.join(" ")
}

/**
 * @description Creates a temporary directory at the default OS path for temporary files, and suffixes it with the input 'suffix'.
 * @param suffix - Suffix to add to the end of the directory name.
 */
export const createTempDir = async (suffix?: string) => {
  const tmpDir = await fs.mkdtemp(suffix ? path.join(os.tmpdir(), suffix) : os.tmpdir())
  return tmpDir
}

/**
 * @description Returns the input string in quotes.
 */
export const quote = (s: string): string => {
  return `"${s}"`
}

type ZipFilesOpts = {
  deleteOriginal: boolean
}

/**
 * @description Zips the input files into the output path.
 * @param outPath - The path to output the zip file. It must be a file path ending in '.zip'.
 * @param files - The paths to the files to be zipped.
 */
export const zipFiles = async (outPath: string, files: string[], opts?: ZipFilesOpts) => {
  if (files.length === 0) throw Error("No input files.")
  if (path.extname(outPath) !== ".zip") {
    throw Error("The outPath must specify a filename ending with '.zip'")
  }

  const cmd = createCompoundCommand(
    "zip",
    quote(outPath),
    files.map(f => quote(path.basename(f))).join(" "),
  )

  await execAsync(cmd, { cwd: path.dirname(files[0]) })

  if (opts?.deleteOriginal) {
    await Promise.all(files.map(file => fs.rm(file)))
  }
}

/**
 * @description Saves the input file to the specified path.
 */
export const saveFile = async (file: File, path: string) => {
  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFile(path, buffer)
}
