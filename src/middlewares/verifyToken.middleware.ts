import db from '../config/database'
import { Request, Response, NextFunction } from 'express'
import AuthServices from '../services/auth.services'
import UserController from '../controllers/user.controller'
import { DateTime } from 'luxon'
import { config } from '../config/config'

const authServices = new AuthServices()
const userController = new UserController(db)

const excludedRoutes = ['POST|/auth/login', 'GET|/info', 'GET|/tutorial', 'GET|/command']

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    req.startTime = DateTime.now().setZone('America/Fortaleza').toMillis()
    if (!excludedRoutes.includes(`${req.method}|${req.path.endsWith('/') ? req.path.substring(0, req.path.length - 1) : req.path}`)) {
        if (req.headers.authorization) {
            if (req.headers.authorization === config.default.API_TOKEN) {
                next()
            } else {
                try {
                    const payload = authServices.verifyToken(req.headers.authorization)

                    if (payload) {
                        const user = await userController.getById(payload.id)

                        if (user) {
                            req.user = {
                                id: user.id,
                                discord_id: user.discord_id,
                                username: user.username,
                                avatar: user.avatar,
                                is_beta: user.is_beta,
                                is_premium: user.is_premium,
                            }
                        }

                        next()
                    } else {
                        return res.status(401).json({ title: 'Unathorized', message: 'Invalid token' })
                    }
                } catch (err) {
                    return res.status(401).json({ title: 'Unathorized', message: 'Invalid token' })
                }
            }
        } else {
            return res.status(401).json({ title: 'Unathorized', message: 'Authorization token is required' })
        }
    } else {
        next()
    }
}
