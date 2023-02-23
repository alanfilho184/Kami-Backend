import { Router } from 'express'
import AuthRoute from './auth.route'
import UserRoute from './user.route'
import InfoRoute from './info.route'
import TutorialRoute from './tutorial.route'

const router = Router()

router.use('/auth', AuthRoute)
router.use('/user', UserRoute)
router.use('/info', InfoRoute)
router.use('/tutorial', TutorialRoute)

export default router
