import { FromScratch } from '../src'

const app = new FromScratch()

app.on('GET', '/welcome', () => {
  return new Response('Welcome!')
})

export default app
