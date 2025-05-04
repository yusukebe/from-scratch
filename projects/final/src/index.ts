import type { Route, Helper, Handler, Methods, Fetch, Context } from './types'

export function createApp<THelpers extends Record<string, Helper> = {}>() {
  type App<H extends Record<string, Helper>> = {
    on(method: Methods, path: string, handler: Handler<H>): App<H>
    setHelper<K extends string, F extends Helper>(name: K, helper: F): App<H & Record<K, F>>
    fetch: Fetch
  }

  const routes: Route[] = []
  const helpers = {} as THelpers
  const vars = {}

  const app = {
    on(method, pathname, handler) {
      routes.push({
        m: method.toUpperCase(),
        p: new URLPattern({ pathname }),
        h: handler,
      })
      return app
    },

    setHelper(name, helper) {
      // @ts-expect-error Not typed well
      helpers[name] = helper
      return app
    },

    async fetch(req, env = {}, executionContext) {
      let context: Context | undefined = undefined
      for (const { m, p, h } of routes) {
        const match = p.exec(req.url)
        if (match && (req.method === m || m === '*')) {
          context ??= { env, executionContext, match, vars, req }
          const response = await h({
            helper: (name, ...args) => {
              const helper = helpers[name]
              if (helper) return helper(context!, ...args)
            },
            ...context,
          })
          if (response instanceof Response) context.res = response
        }
      }
      if (context && context.res) {
        return context.res
      }
      return new Response('Not Found', { status: 404 })
    },
  } as App<THelpers>

  return app
}
