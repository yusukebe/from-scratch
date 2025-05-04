import { createApp } from '../src'

const app = createApp()

app.on('GET', '/', () => new Response('Hi'))

export default app
