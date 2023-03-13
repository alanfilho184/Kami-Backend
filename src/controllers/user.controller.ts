import { config } from '../config/config'

type PreparedUser = {
    username: string
    email: string
    avatar?: string
    password: string
}

function toUser(user: any): User | null {
    try {
        return {
            id: user.id,
            discord_id: user.discord_id,
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            password: user.password,
            is_beta: user.is_beta,
            is_premium: user.is_premium,
            last_use: user.last_use,
        }
    } catch (err) {
        return null
    }
}

function toUserArray(users: any[]): User[] {
    const usersArray: User[] = []

    users.forEach(prismaUser => {
        const user = toUser(prismaUser)
        if (user) {
            usersArray.push(user)
        }
    })

    return usersArray
}

export default class UserController {
    private db: Db
    constructor(db: Db) {
        this.db = db
    }

    async create(user: PreparedUser): Promise<User | null> {
        return toUser(
            await this.db.users.create({
                data: {
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    password: user.password,
                },
            }),
        )
    }

    async getById(id: number): Promise<User | null> {
        return toUser(
            await this.db.users.findUnique({
                where: {
                    id: id,
                },
            }),
        )
    }

    async getByUsername(username: string): Promise<User | null> {
        return toUser(
            await this.db.users.findUnique({
                where: {
                    username: username,
                },
            }),
        )
    }

    async getByEmail(email: string): Promise<User | null> {
        return toUser(
            await this.db.users.findUnique({
                where: {
                    email: email,
                },
            }),
        )
    }

    async getByDiscordId(discordId: string): Promise<User | null> {
        return toUser(
            await this.db.users.findUnique({
                where: {
                    discord_id: discordId,
                },
            }),
        )
    }
}
