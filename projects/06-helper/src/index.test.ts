import { createApp } from '.'
import { describe, it, expect } from 'vitest'

describe('06', () => {
  const app = createApp().setHelper('html', (c, html: string) => {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Foo': String(c.vars['foo'] ?? 'no value'),
      },
    })
  })

  app.on('GET', '*', (c) => {
    c.vars['foo'] = 'bar'
  })

  app.on('GET', '/html', (c) => {
    return c.helper('html', '<html><body>Hi</body></html>')
  })

  it('should return 200 response - /html', async () => {
    const res = app.fetch(new Request('http://localhost/html'))
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Foo')).toBe('bar')
    expect(res.headers.get('Content-Type')).toBe('text/html')
    expect(await res.text()).toBe('<html><body>Hi</body></html>')
  })
})
