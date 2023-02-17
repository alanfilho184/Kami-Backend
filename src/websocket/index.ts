import { config } from '../config/config'
import EventListener from 'events'
import { Server } from 'socket.io'
import prisma from '../config/database'

const Events = new EventListener()

export default function createSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: config.default.CORS_ORIGIN,
        },
    })

    //io.use(verifyTokenWebsocket)

    io.on('connection', socket => {})
}

export { Events }
