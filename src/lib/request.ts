export type Browser = "firefox" | "chrome";

const indicators: Record<Browser, string> = {
  chrome: "Chrome",
  firefox: "Firefox"
}


/**
 * @description Returns the Browser string from the request's "User-Agent" header.
 */
export const getBrowserFromRequest = (request: Request): Browser => {
  const userAgent = request.headers.get("User-Agent")
  if (!userAgent) throw Error("No User-Agent header found in request")

  for (const browser of Object.keys(indicators) as Browser[]) {
    if (userAgent.includes(indicators[browser])) {
      return browser
    }
  }

  throw Error("No valid browser found in User Agent")
}
