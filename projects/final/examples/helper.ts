import { createApp } from '../src'

const app = createApp()
  .helper('html', (_req, html: string) => {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  })
  .helper('redirect', (_req, url: string) => {
    return Response.redirect(url)
  })

app.on('GET', '/html', (_, helper) => {
  return helper('html', '<html>Foo</html>')
})

export default app
