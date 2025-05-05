import { createApp } from '.'
import { describe, it, expect } from 'vitest'

describe('05', () => {
  const app = createApp()

  app.on('GET', '*', (c) => {
    c.vars['foo'] = 'bar'
  })

  app.on('GET', '/welcome', (c) => {
    return new Response(`Welcome foo is ${c.vars['foo']}`)
  })

  app.on('GET', '*', (c) => {
    if (c.res) {
      c.res.headers.set('X-Custom', 'My message')
    }
  })

  it('should return 200 response - /welcome', async () => {
    const res = app.fetch(new Request('http://localhost/welcome'))
    expect(res.status).toBe(200)
    expect(res.headers.get('X-Custom')).toBe('My message')
    expect(await res.text()).toBe('Welcome foo is bar')
  })
})
