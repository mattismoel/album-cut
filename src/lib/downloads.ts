const downloads = new Map<string, string>()

export const createDownload = (filePath: string) => {
  const id = crypto.randomUUID()

  downloads.set(id, filePath)

  return id
}

export const getDownload = (id: string) => {
  return downloads.get(id)
}

export const removeDownload = (id: string) => {
  downloads.delete(id)
}
