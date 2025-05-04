export type Handler = (request: Request) => Response | Promise<Response> | void

export type Methods = ('GET' | 'PUT' | 'POST' | 'DELETE') | (string & Record<never, never>)

export type Route = {
  pattern: URLPattern
  method: Methods
  handler: Handler
}
