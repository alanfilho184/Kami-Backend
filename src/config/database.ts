import { MongoClient } from 'mongodb'
import { config } from './config'

const mongo = new MongoClient(config.default.DATABASE_URL)

const db = mongo.db(config.default.DATABASE_NAME)

export const checkConnection = async () => await db.stats()
export default db
