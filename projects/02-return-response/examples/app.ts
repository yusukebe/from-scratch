import { createApp } from '../src'

const app = createApp()

app.handler = () => {
  const res = new Response('Hi')
  res.headers.set('X-Custom', 'My message')
  return res
}

export default app
