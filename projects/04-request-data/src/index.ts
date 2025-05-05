type Context = { req: Request; match: URLPatternResult }
type Handler = (context: Context) => Response | undefined
type Route = { method: string; pattern: URLPattern; handler: Handler }

export function createApp() {
  const routes: Route[] = []

  return {
    on(method: string, path: string, handler: Handler) {
      routes.push({
        method: method.toUpperCase(),
        pattern: new URLPattern({ pathname: path }),
        handler,
      })
    },

    fetch(req: Request) {
      for (const { method, pattern, handler } of routes) {
        const match = pattern.exec(req.url)
        if (match && (method === '*' || method === req.method)) {
          const res = handler({ req, match })
          if (res) return res
        }
      }
      return new Response('Not Found', { status: 404 })
    },
  }
}
