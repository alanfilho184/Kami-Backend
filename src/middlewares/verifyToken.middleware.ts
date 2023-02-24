import db from '../config/database'
import { Request, Response, NextFunction } from 'express'
import AuthServices from '../services/auth.services'
import { DateTime } from 'luxon'
import { User_Id } from '../types/validations'
import { config } from '../config/config'

const authServices = new AuthServices(db)

const excludedRoutes = ['POST|/auth/login', 'GET|/info', 'GET|/tutorial', 'GET|/command']

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    req.startTime = DateTime.now().setZone('America/Fortaleza').toMillis()
    if (!excludedRoutes.includes(`${req.method}|${req.path.endsWith('/') ? req.path.substring(0, req.path.length - 1) : req.path}`)) {
        if (req.headers.authorization) {
            if (req.headers.authorization === config.default.API_TOKEN) {
                next()
            }
            else {
                try {
                    const payload = authServices.verifyToken(req.headers.authorization)

                    if (payload) {
                        req.user = {
                            id: new User_Id(payload.id).user_id,
                            username: payload.username,
                            discriminator: payload.discriminator,
                            locale: payload.locale,
                            avatar_url: payload.avatar_url,
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
