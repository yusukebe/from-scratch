type Context = {
  req: Request
  res?: Response
  match: URLPatternResult
  vars: Record<string, unknown>
}
type ContextWithHelper = Context & {
  helper: (name: string, ...args: any[]) => Response | undefined
}
type Handler = (context: ContextWithHelper) => Response | void
type Helper = (context: Context, ...args: any[]) => Response
type Route = { method: string; pattern: URLPattern; handler: Handler }

export function createApp() {
  const routes: Route[] = []
  const vars: Record<string, unknown> = {}
  const helpers: Record<string, Helper> = {}

  const app = {
    on(method: string, path: string, handler: Handler) {
      routes.push({
        method: method.toUpperCase(),
        pattern: new URLPattern({ pathname: path }),
        handler,
      })
      return app
    },

    setHelper(name: string, helper: Helper) {
      helpers[name] = helper
      return app
    },

    fetch(req: Request) {
      let res: Response | undefined

      for (const { method, pattern, handler } of routes) {
        const match = pattern.exec(req.url)
        if (match && (method === '*' || method === req.method)) {
          const context = { req, match, res, vars }

          const newRes = handler({
            ...context,
            helper: (name, ...args) => helpers[name]?.(context, ...args),
          })

          if (newRes instanceof Response) res = newRes
        }
      }

      return res || new Response('Not Found', { status: 404 })
    },
  }

  return app
}
