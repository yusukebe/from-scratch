import { createApp } from '.'
import { describe, it, expect } from 'vitest'

describe('04', () => {
  const app = createApp()
  app.on('GET', '/welcome', (c) => {
    const url = new URL(c.req.url)
    return new Response(`Welcome from ${url.pathname}`)
  })

  app.on('GET', '/posts/:id', (c) => {
    const { id } = c.match.pathname.groups
    const searchParams = new URLSearchParams(c.match.search.input)
    return new Response(`ID is ${id}, page is ${searchParams.get('page')}`)
  })

  it('should return 200 response - /welcome', async () => {
    const res = app.fetch(new Request('http://localhost/welcome'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Welcome from /welcome')
  })

  it('should return 200 response - /posts/123?page=456', async () => {
    const res = app.fetch(new Request('http://localhost/posts/123?page=456'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('ID is 123, page is 456')
  })
})
