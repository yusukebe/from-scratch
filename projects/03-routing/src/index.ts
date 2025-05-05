type Handler = () => Response | undefined
type Route = { method: string; pattern: URLPattern; handler: Handler }

export function createApp() {
  const routes: Route[] = []

  return {
    on(method: string, path: string, handler: Handler) {
      routes.push({
        method,
        pattern: new URLPattern({ pathname: path }),
        handler,
      })
    },

    fetch(req: Request) {
      for (const route of routes) {
        if (route.method.toUpperCase() === req.method && route.pattern.test(req.url)) {
          const res = route.handler()
          if (res instanceof Response) return res
        }
      }
      return new Response('Not Found', { status: 404 })
    },
  }
}
