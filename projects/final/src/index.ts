import type { Route, Handler, Methods } from './types'

type App = {
  on: (method: Methods, path: string, handler: Handler) => App
  fetch: (
    req: Request,
    env?: {},
    executionContext?: ExecutionContext
  ) => Response | Promise<Response>
}

export function createApp() {
  const routes: Route[] = []

  const app: App = {
    on(method: Methods, path: string, handler: Handler) {
      routes.push({
        methods: method.toUpperCase(),
        pattern: new URLPattern({ pathname: path }),
        handler,
      })
      return app
    },

    async fetch(request, env = {}, executionContext) {
      for (const { methods, pattern, handler } of routes) {
        if (request.method === methods && pattern.test(request.url)) {
          const response = await handler(request, {
            env,
            executionContext,
          })
          if (response instanceof Response) return response
        }
      }
      return new Response('Not Found', { status: 404 })
    },
  }

  return app
}
