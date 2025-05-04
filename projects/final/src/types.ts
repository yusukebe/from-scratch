export type Fetch = (
  req: Request,
  env?: {},
  executionContext?: ExecutionContext
) => Response | Promise<Response>

export type Helper = (context: Context, ...args: any[]) => unknown

export type Methods = ('GET' | 'PUT' | 'POST' | 'DELETE' | '*') | (string & Record<never, never>)

export type Route = {
  p: URLPattern
  m: Methods
  h: Handler
}

export type Context = {
  env: {}
  executionContext?: ExecutionContext
  match: URLPatternResult
  vars: Record<string, unknown>
  req: Request
  res?: Response
}

export type ContextWithHelper<THelpers extends Record<string, Helper> = Record<string, Helper>> = {
  helper: <K extends keyof THelpers>(
    name: K,
    ...args: RemoveFirstParameter<Parameters<THelpers[K]>>
  ) => ReturnType<THelpers[K]>
} & Context

type RemoveFirstParameter<T extends any[]> = T extends [any, ...infer R] ? R : never

export type Handler<THelpers extends Record<string, Helper> = Record<string, Helper>> = (
  context: ContextWithHelper<THelpers>
) => Response | Promise<Response> | void
