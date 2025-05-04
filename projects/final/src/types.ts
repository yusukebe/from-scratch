export type Fetch = (
  req: Request,
  env?: {},
  executionContext?: ExecutionContext
) => Response | Promise<Response>

export type Helper = (request: Request, ...args: any[]) => Response | Promise<Response> | void

export type Methods = ('GET' | 'PUT' | 'POST' | 'DELETE') | (string & Record<never, never>)

export type Route = {
  p: URLPattern
  m: Methods
  h: Handler
}

export type Context<THelpers extends Record<string, Helper> = Record<string, Helper>> = {
  helper: <K extends keyof THelpers>(
    name: K,
    ...args: RemoveFirstParameter<Parameters<THelpers[K]>>
  ) => ReturnType<THelpers[K]>
  env: {}
  executionContext: ExecutionContext
}

type RemoveFirstParameter<T extends any[]> = T extends [any, ...infer R] ? R : never

export type Handler<THelpers extends Record<string, Helper> = Record<string, Helper>> = (
  request: Request,
  context: Context<THelpers>
) => Response | Promise<Response> | void
