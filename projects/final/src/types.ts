export type Methods = ('GET' | 'PUT' | 'POST' | 'DELETE') | (string & Record<never, never>)

export type Route = {
  pattern: URLPattern
  methods: Methods
  handler: Handler
}

type Context = {
  env: {}
  executionContext?: ExecutionContext
}

export type Handler = (request: Request, context: Context) => Response | Promise<Response> | void
