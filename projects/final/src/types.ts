export type Helper = (request: Request, ...args: any[]) => Response | Promise<Response> | void

export type Methods = ('GET' | 'PUT' | 'POST' | 'DELETE') | (string & Record<never, never>)

export type Route = {
  p: URLPattern
  m: Methods
  h: Handler
}

type RemoveFirstParameter<T extends any[]> = T extends [any, ...infer R] ? R : never

export type Handler<THelpers extends Record<string, Helper> = Record<string, Helper>> = (
  request: Request,
  helper: <K extends keyof THelpers>(
    name: K,
    ...args: RemoveFirstParameter<Parameters<THelpers[K]>>
  ) => ReturnType<THelpers[K]>
) => Response | Promise<Response> | void
