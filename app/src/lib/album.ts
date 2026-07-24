import z from "zod"

export const albumFormSchema = z.object({
  url: z.url({ hostname: /^youtu\.be$/ }),
})
