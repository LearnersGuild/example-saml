import {Router} from 'express'

const router = new Router()

router.get('/', (req, res) => {
  res.status(200).send('Hi!')
})

export default router
