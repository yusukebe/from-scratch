import { createApp } from '../src'

const app = createApp().setHelper('html', (_, html: string) => {
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
})

app.on('GET', '/welcome', (c) => {
  return c.helper('html', '<html><body><h1>Welcome!</h1></body></html>')
})

export default app
