import express from 'express'

export async function start(): Promise<void> {
  const app = express()

  app.get('/', (req, res) => {
    res.send('Hello World')
  })
  console.log('Booting server')
  app.listen(3000)
}
