import { createApp } from '../src'

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

export default app
