import { PrismaClient } from '@prisma/client'
import { config } from './config'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: config.default.DATABASE_URL,
        }
    }
})

export const checkConnection = async () => await prisma.usage_info.count()
export default prisma
