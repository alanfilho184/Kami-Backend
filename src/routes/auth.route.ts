import { Router, Request, Response } from 'express'
import AuthServices from '../services/auth.services'
import logger from '../config/logger'
import { LoginErrorCodes } from '../types/errors'

const router = Router()
const authServices = new AuthServices()

router.post('/login', async (req: Request, res: Response) => {
    try {
        if (!req.body.username && !req.body.email) {
            res.status(400).json({
                error: 'Username or email is required',
            })
        } else if (!req.body.password) {
            res.status(400).json({
                error: 'Password is required',
            })
        } else {
            try {
                const token = await authServices.login(req.body)

                res.status(200).json({
                    token: token,
                })
            } catch (err: any) {
                if (err.code == LoginErrorCodes.INVALID_CREDENTIALS) {
                    res.status(400).json({
                        error: 'Invalid credentials',
                    })
                } else if (err.code == LoginErrorCodes.EMAIL_NOT_FOUND) {
                    res.status(404).json({
                        error: 'Email not found',
                    })
                } else if (err.code == LoginErrorCodes.USERNAME_NOT_FOUND) {
                    res.status(404).json({
                        error: 'Username not found',
                    })
                } else if (err.code == LoginErrorCodes.PASSWORD_INCORRECT) {
                    res.status(401).json({
                        error: 'Password is incorrect',
                    })
                } else {
                    throw err
                }
            }
        }
    } catch (err) {
        logger.registerError(err)
        res.status(500).end()
    }
})

export default router
