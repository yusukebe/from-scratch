import type { Handler, Methods, Route } from './types'

export class FromScratch {
  #routes: Route[] = []

  on(method: Methods, path: string, handler: Handler) {
    this.#routes.push({
      method: method.toUpperCase(),
      pattern: new URLPattern({ pathname: path }),
      handler,
    })
    return this
  }

  fetch(request: Request) {
    for (const { method, pattern, handler } of this.#routes) {
      if (request.method === method && pattern.test(request.url)) {
        const response = handler(request)
        if (response instanceof Response) return response
      }
    }
    return new Response('Not Found', { status: 404 })
  }
}
