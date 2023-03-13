import { Router, Request, Response } from 'express'
import logger from '../config/logger'
import UserServices from '../services/user.services'
import UserController from '../controllers/user.controller'
import db from '../config/database'

const router = Router()
const userServices = new UserServices(db)
const userController = new UserController(db)

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

router.post('/', async (req: Request, res: Response) => {
    try {
        const invalidFields = await userServices.validateUser(req.body)

        if (invalidFields.length > 0) {
            res.status(400).json({
                invalidFields,
            })
        } else {
            const preparedUser = await userServices.prepareUser(req.body)

            await userController.create(preparedUser)

            res.status(201).json({ success: 'User created successfully' })
        }
    } catch (err) {
        logger.registerError(err)
        res.status(500).end()
    }
})

export default router
