import { createApp } from '.'
import { describe, it, expect } from 'vitest'

describe('Basic', () => {
  describe('200 OK', () => {
    const app = createApp()
    app.handler = () => new Response('Hi')

    it('should return 200 response - /', async () => {
      const res = app.fetch()
      expect(res.status).toBe(200)
      expect(await res.text()).toBe('Hi')
    })
  })

  describe('404 Not Found', () => {
    const app = createApp()

    it('should return 404 response - /', async () => {
      const res = app.fetch()
      expect(res.status).toBe(404)
      expect(await res.text()).toBe('Not Found')
    })
  })
})
