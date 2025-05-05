type Handler = () => Response | undefined

export function createApp() {
  let handler: Handler | undefined = undefined

  return {
    set handler(h: Handler) {
      handler = h
    },

    fetch() {
      const res = handler?.()
      return res instanceof Response ? res : new Response('Not Found', { status: 404 })
    },
  }
}
