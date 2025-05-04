import { createApp } from '../src'

const app = createApp().setHelper('html', (_, html: string) => {
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
})

// Variables in the middleware
app.on('*', '*', (c) => {
  c.vars['foo'] = 'bar'
})

// Custom helper
app.on('GET', '/', (c) => {
  return c.helper('html', `<html><body>${c.vars['foo']}</body></html>`)
})

// Middleware for the response
app.on('*', '*', (c) => {
  if (c.res) {
    c.res.headers.append('X-Custom', 'My message')
  }
})

export default app
