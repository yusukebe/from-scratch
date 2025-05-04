import type { Route, Helper, Handler, Methods } from './types'

export function createApp<THelpers extends Record<string, Helper> = {}>() {
  const routes: Route[] = []
  const helpers = {} as THelpers

  type App<H extends Record<string, Helper>> = {
    on(method: Methods, path: string, handler: Handler<H>): App<H>
    helper<K extends string, F extends Helper>(name: K, helper: F): App<H & Record<K, F>>
    fetch(request: Request): Response | Promise<Response>
  }

  const app = {
    on(method, path, handler) {
      routes.push({
        m: method.toUpperCase(),
        p: new URLPattern({ pathname: path }),
        // @ts-expect-error Not typed well
        h: handler,
      })
      return app
    },

    helper(name, helper) {
      // @ts-expect-error Not typed well
      helpers[name] = helper
      return app
    },

    fetch(request) {
      for (const { m, p, h } of routes) {
        if (request.method === m && p.test(request.url)) {
          const response = h(request, (name, ...args) => {
            const helper = helpers[name]
            if (helper) return helper(request, ...args)
          })
          if (response instanceof Response) return response
        }
      }
      return new Response('Not Found', { status: 404 })
    },
  } as App<THelpers>

  return app
}
