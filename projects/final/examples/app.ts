import { FromScratch } from '../src'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

const app = new FromScratch()

const honoApp = new Hono()
honoApp.use(logger())

app.on('GET', '*', honoApp.fetch)

app.on('GET', '/welcome', () => {
  return new Response('Welcome!')
})

export default app
