import { config } from '../config/config'
import db from '../config/database'
import { default as Events } from '../websocket/events'
import { Server } from 'socket.io'
import tutorialsCache from '../utils/cache/tutorials'
import AuthServices from '../services/auth.services'
import UserController from '../controllers/user.controller'
import { loggerWebsocket } from '../middlewares/logger.middleware'

const authServices = new AuthServices()
const userController = new UserController(db)

export default function createSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: config.default.CORS_ORIGIN,
        },
    })

    io.use(loggerWebsocket)

    io.on('connection', socket => {
        socket.on('login', async data => {
            if (data.token) {
                try {
                    const payload = authServices.verifyToken(data.token)

                    if (payload) {
                        const payloadUser = await userController.getById(payload.id)

                        if (payloadUser) {
                            const user = {
                                id: payloadUser.id,
                                discord_id: payloadUser.discord_id,
                                username: payloadUser.username,
                                avatar_url: payloadUser.avatar,
                                is_beta: payloadUser.is_beta,
                                is_premium: payloadUser.is_premium,
                            }

                            socket.join(`${user.id}`)
                            socket.data.user = user
                        } else {
                            return socket.disconnect()
                        }
                    } else {
                        return socket.disconnect()
                    }
                } catch (err) {
                    return socket.disconnect()
                }
            } else {
                return socket.disconnect()
            }
        })

        socket.on('tutorialsSearch', search => {
            const tutorials = tutorialsCache.searchTutorials(search)

            socket.emit('tutorialsFound', { tutorials: tutorials })
        })

        socket.on('open-sheet', sheetId => {
            socket.join(`sheet-${sheetId}`)
        })

        socket.on('close-sheet', sheetId => {
            socket.leave(`sheet-${sheetId}`)
        })
    })

    Events.on('user-password-changed', (userId: number) => {
        io.to(`${userId}`).emit('user-password-changed')
    })

    Events.on('user-changed', (user: Express.Request['user']) => {
        io.to(`${user.id}`).emit('user-changed', { user: user })
    })

    Events.on('sheet-updated', (socketIdentifier: string, sheet: Sheet) => {
        io.to(`sheet-${sheet.id}`).emit('sheet-updated', sheet, socketIdentifier)
    })

    Events.on('sheet-deleted', (sheetId: number) => {
        io.to(`sheet-${sheetId}`).emit('sheet-deleted', sheetId)
    })
}