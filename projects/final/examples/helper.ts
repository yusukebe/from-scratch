import { createApp } from '../src'

const app = createApp().helper('redirect', (_req, url: string) => {
  return Response.redirect(url)
})

app.on('GET', '/redirect', (_, { helper }) => {
  return helper('redirect', 'http://example.com')
})
export default app
