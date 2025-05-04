import { createApp } from '.'
import { describe, it, expect } from 'vitest'

describe('Basic', () => {
  const app = createApp()

  app.on('GET', '/welcome', () => {
    return new Response('Welcome!')
  })

  app.on('GET', '/welcome-method-lowercase', () => {
    return new Response('welcome!')
  })

  app.on('GET', '/req-pathname', (c) => {
    return new Response(`Path name is ${new URL(c.req.url).pathname}`)
  })

  app.on('*', '/wildcard', () => {
    return new Response('Wildcard')
  })

  it('should return 200 response - GET /welcome', async () => {
    const res = await app.fetch(new Request('http://example.com/welcome'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Welcome!')
  })

  it('should return 200 response - GET /welcome-method-lowercase', async () => {
    const res = await app.fetch(new Request('http://example.com/welcome-method-lowercase'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('welcome!')
  })

  it('should return 200 response - GET /req-pathname', async () => {
    const res = await app.fetch(new Request('http://example.com/req-pathname'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Path name is /req-pathname')
  })

  it('should return 404 response - POST /welcome', async () => {
    const res = await app.fetch(
      new Request('http://example.com/welcome', {
        method: 'POST',
      })
    )
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Not Found')
  })

  it('should return 404 response - GET /not-found', async () => {
    const res = await app.fetch(new Request('http://example.com/not-found'))
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Not Found')
  })
})

describe('Helper', () => {
  const app = createApp()
    .setHelper('html', (_c, html) => {
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    })
    .setHelper('searchParams', (c) => {
      return new URLSearchParams(c.match.search.input)
    })
    .setHelper('params', (c) => {
      return c.match.pathname.groups
    })

  app.on('GET', '/html', (c) => {
    return c.helper('html', '<html>Hi</html>')
  })

  app.on('GET', '/posts/:id', (c) => {
    const { id } = c.helper('params')
    const page = c.helper('searchParams').get('page')
    return new Response(`Your ID is ${id}, page is ${page}`)
  })

  it('should return 200 HTML response - GET /html', async () => {
    const res = await app.fetch(new Request('http://example.com/html'))
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/html')
  })

  it('should return 200 response - GET /posts/123?page=123', async () => {
    const res = await app.fetch(new Request('http://example.com/posts/123?page=456'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Your ID is 123, page is 456')
  })
})

describe('Middleware', () => {
  const app = createApp()

  app.on('GET', '*', (c) => {
    c.vars['foo'] = 'bar'
  })

  app.on('GET', '/', (c) => {
    return new Response(`Variable is ${c.vars['foo']}`)
  })

  app.on('GET', '/', (c) => {
    if (c.res) {
      c.res.headers.append('X-Custom', 'My message')
    }
  })

  it('should return 200 response - GET /', async () => {
    const res = await app.fetch(new Request('http://example.com/'))
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Custom')).toBe('My message')
    expect(await res.text()).toBe('Variable is bar')
  })
})
