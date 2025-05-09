type Handler = () => Response | undefined

export function createApp() {
  const routes: { method: string; pattern: URLPattern; handler: Handler }[] = []

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
        if ((method === '*' || method === req.method) && pattern.test(req.url)) {
          const res = handler()
          if (res) return res
        }
      }
      return new Response('Not Found', { status: 404 })
    },
  }
}
