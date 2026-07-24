import fs from "fs"
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
export const createTempDir = (suffix?: string) => {
  const tmpDir = fs.mkdtempSync(suffix ? path.join(os.tmpdir(), suffix) : os.tmpdir())
  return tmpDir
}

/**
 * @description Returns the input string in quotes.
 */
export const quote = (s: string): string => {
  return `"${s}"`
}
