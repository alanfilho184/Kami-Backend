import { config } from '../config/config'
import bcrypt from 'bcrypt'

type PreparedUser = {
    username: string
    email: string
    avatar?: string
    password: string
}

class UserServices {
    private db: Db
    public emailRegex: RegExp
    public usernameRegex: RegExp
    public avatarURLRegex: RegExp
    constructor(db: Db) {
        this.db = db
        this.emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
        this.usernameRegex = new RegExp(/^[a-zA-Z0-9_]+$/)
        this.avatarURLRegex = new RegExp(/(https?:\/\/.*.(?:png|jpg|jpeg|webp|gif|gifv))/i)
    }

    async validateUser(user: User): Promise<Array<{ field: string; message: string }>> {
        const invalidFields = []
        if (user.username.length < 3) {
            invalidFields.push({
                field: 'username',
                message: 'Username must be at least 3 characters long',
            })
        }

        if (user.username.length > 32) {
            invalidFields.push({
                field: 'username',
                message: 'Username must be at most 32 characters long',
            })
        }

        if (!this.usernameRegex.test(user.username)) {
            invalidFields.push({
                field: 'username',
                message: 'Username must only contain letters, numbers and underscores',
            })
        }

        if (!this.usernameRegex.test(user.username)) {
            invalidFields.push({
                field: 'username',
                message: 'Username must only contain letters, numbers and underscores',
            })
        }

        if (!user.email) {
            invalidFields.push({
                field: 'email',
                message: 'Email is required',
            })
        }

        if (!this.emailRegex.test(user.email)) {
            invalidFields.push({
                field: 'email',
                message: 'Email is invalid',
            })
        }

        if (!user.password) {
            invalidFields.push({
                field: 'password',
                message: 'Password is required',
            })
        }

        if (user.password.length < 8) {
            invalidFields.push({
                field: 'password',
                message: 'Password must be at least 8 characters long',
            })
        }

        if (user.avatar && !this.avatarURLRegex.test(user.avatar)) {
            invalidFields.push({
                field: 'avatar',
                message: 'Avatar URL is invalid',
            })
        }

        try {
            await this.db.users.findFirstOrThrow({ where: { username: user.username } })
        } catch (err) {
            invalidFields.push({
                field: 'username',
                message: 'Username already exists',
            })
        }

        try {
            await this.db.users.findFirstOrThrow({ where: { email: user.email } })
        } catch (err) {
            invalidFields.push({
                field: 'email',
                message: 'Email already exists',
            })
        }

        return invalidFields
    }

    async prepareUser(user: User): Promise<PreparedUser> {
        const preparedUser: PreparedUser = {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            password: user.password,
        }

        preparedUser.password = await bcrypt.hashSync(preparedUser.password, config.default.saltRounds)

        return preparedUser
    }
}

export default UserServices
