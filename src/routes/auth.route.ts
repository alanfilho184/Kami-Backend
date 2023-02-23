import { Router, Request, Response } from 'express'
import db from '../config/database'
import AuthServices from '../services/auth.services'
import logger from '../config/logger'

const router = Router()
const authServices = new AuthServices(db)

router.post('/login', async (req: Request, res: Response) => {
    try {
        const token = await authServices.generateTokenByDiscordCode(req.body.code)

        res.status(200).json({ token: token })
    } catch (err) {
        logger.registerError(err)
        res.status(500).end()
    }
})

export default router
