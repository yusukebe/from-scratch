import { createApp } from '../src'

const app = createApp()

app.on('GET', '/posts/:id', (c) => {
  const { id } = c.match.pathname.groups
  const searchParams = new URLSearchParams(c.match.search.input)
  return new Response(`ID is ${id}, page is ${searchParams.get('page')}`)
})

export default app
