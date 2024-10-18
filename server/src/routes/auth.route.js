import { Router } from 'express'

import { signin, signout, signup } from '@/controllers/auth.controller'

const router = Router()

router.get('/signup', signup)
router.get('/signin', signin)
router.get('/signout', signout)

export default router
