import { createApp } from '.'
import { describe, it, expect } from 'vitest'

describe('03', () => {
  const app = createApp()
  app.on('GET', '/welcome', () => {
    return new Response('Welcome')
  })
  app.on('get', '/welcome-lowercase', () => {
    return new Response('welcome')
  })
  app.on('GET', '/wildcard/*', () => {
    return new Response('Wildcard')
  })
  app.on('POST', '/posts', () => {
    return new Response('Created', {
      status: 201,
    })
  })
  app.on('*', '/method-wildcard', () => {
    return new Response('Method Wildcard')
  })

  it('should return 200 response - /welcome', async () => {
    const res = app.fetch(new Request('http://localhost/welcome'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Welcome')
  })

  it('should return 200 response - /welcome-lowercase', async () => {
    const res = app.fetch(new Request('http://localhost/welcome-lowercase'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('welcome')
  })

  it('should return 200 response - /wildcard/foo', async () => {
    const res = app.fetch(new Request('http://localhost/wildcard/foo'))
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Wildcard')
  })

  it('should return 201 response - POST /posts', async () => {
    const res = app.fetch(
      new Request('http://localhost/posts', {
        method: 'POST',
      })
    )
    expect(res.status).toBe(201)
    expect(await res.text()).toBe('Created')
  })

  it('should return 200 response - /method-wildcard', async () => {
    const res = app.fetch(
      new Request('http://localhost/method-wildcard', {
        method: 'PURGE',
      })
    )
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Method Wildcard')
  })

  it('should return 404 response - /', async () => {
    const res = app.fetch(new Request('http://localhost/'))
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Not Found')
  })
})
