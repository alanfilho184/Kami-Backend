import { config } from '../config/config'
import EventListener from 'events'
import { Server } from 'socket.io'
import tutorialsCache from '../utils/cache'

const Events = new EventListener()

export default function createSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: config.default.CORS_ORIGIN,
        },
    })

    io.on('connection', socket => {
        socket.on('tutorialsSearch', search => {
            const tutorials = tutorialsCache.searchTutorials(search)

            socket.emit('tutorialsFound', { tutorials: tutorials })
        })
    })
}

export { Events }
