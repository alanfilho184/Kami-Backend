import { Router, Request, Response } from 'express'
import logger from '../config/logger'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            user: req.user,
        })
    } catch (err) {
        logger.registerError(err)
        res.status(500).end()
    }
})

export default router
