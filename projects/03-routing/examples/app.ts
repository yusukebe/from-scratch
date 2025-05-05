import { createApp } from '../src'

const app = createApp()

app.on('GET', '/foo', () => {
  return new Response('foo!')
})

export default app
