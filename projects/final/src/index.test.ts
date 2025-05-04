import { createApp } from '.'
import { describe, it, expect } from 'vitest'

describe('Basic', () => {
  const app = createApp()

  app.on('GET', '/welcome', () => {
    return new Response('Welcome!')
  })

  app.on('GET', '/welcome-method-lowercase', () => {
    return new Response('Welcome!')
  })

  it('should return 200 response - GET /welcome', async () => {
    const res = await app.fetch(new Request('http://example.com/welcome'))
    expect(res.status).toBe(200)
  })

  it('should return 200 response - GET /welcome-method-lowercase', async () => {
    const res = await app.fetch(new Request('http://example.com/welcome-method-lowercase'))
    expect(res.status).toBe(200)
  })

  it('should return 404 response - POST /welcome', async () => {
    const res = await app.fetch(
      new Request('http://example.com/welcome', {
        method: 'POST',
      })
    )
    expect(res.status).toBe(404)
  })

  it('should return 404 response - GET /not-found', async () => {
    const res = await app.fetch(new Request('http://example.com/not-found'))
    expect(res.status).toBe(404)
  })
})
