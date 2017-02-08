/* eslint-disable no-console, no-undef, no-unused-vars */
import https from 'express-sslify'
import Express from 'express'
import cookieParser from 'cookie-parser'

const PORT = 3000

export function start() {
  const app = new Express()

  app.use(cookieParser())

  if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(https({trustProtoHeader: true}))
  }

  app.get('/', (req, res) => {
    res.status(200).send('Hi!')
  })

  return app.listen(PORT, err => {
    if (err) {
      console.error(err)
    } else {
      console.info(`🌍  Listening on port ${PORT}`)
    }
  })
}
