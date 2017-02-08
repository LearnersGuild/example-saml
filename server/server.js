/* eslint-disable no-console, no-undef, no-unused-vars */
import {HTTPS as https} from 'express-sslify'
import Express, {Router} from 'express'
import cookieParser from 'cookie-parser'

import routes from './routes'

export function start() {
  const app = new Express()

  if (process.env.NODE_ENV === 'production') {
    app.use(https({trustProtoHeader: true}))
  }
  app.use(cookieParser())
  app.use('/', routes)

  return app.listen(process.env.PORT, err => {
    if (err) {
      console.error(err)
    } else {
      console.info(`🌍  Listening on port ${process.env.PORT}`)
    }
  })
}
