type Context = {
  req: Request
  res?: Response
  match: URLPatternResult
  vars: Record<string, unknown>
}
type Handler = (context: Context) => Response | void
type Route = { method: string; pattern: URLPattern; handler: Handler }

export function createApp() {
  const routes: Route[] = []
  const vars: Record<string, unknown> = {}

  return {
    on(method: string, path: string, handler: Handler) {
      routes.push({
        method: method.toUpperCase(),
        pattern: new URLPattern({ pathname: path }),
        handler,
      })
    },

    fetch(req: Request) {
      let res: Response | undefined

      for (const { method, pattern, handler } of routes) {
        const match = pattern.exec(req.url)
        if (match && (method === '*' || method === req.method)) {
          const context = { req, match, res, vars }
          const newRes = handler(context)
          if (newRes instanceof Response) res = newRes
        }
      }

      return res || new Response('Not Found', { status: 404 })
    },
  }
}
