import { config } from '../config/config'
import crypto from 'crypto-js'
import axios from 'axios'
import { URLSearchParams } from 'url'
import DiscordOauth2 from 'discord-oauth2'
import jwt from 'jsonwebtoken'

class AuthServices {
    private db: Db
    constructor(db: Db) {
        this.db = db
    }

    async generateTokenByDiscordCode(code: string): Promise<string> {
        const oauth = new DiscordOauth2()

        const params = new URLSearchParams()
        params.append('client_id', `${config.default.CLIENT_ID}`)
        params.append('client_secret', `${config.default.CLIENT_SECRET}`)
        params.append('grant_type', 'authorization_code')
        params.append('code', code)
        params.append('redirect_uri', `${config.default.O_AUTH_REDIRECT_URI}`)
        params.append('scope', 'identify')

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        }

        const response = await axios.post('https://discord.com/api/oauth2/token', params, { headers })
        const userInfo = await oauth.getUser(response.data.access_token)

        const user = {
            id: userInfo.id,
            username: userInfo.username,
            discriminator: userInfo.discriminator,
            locale: userInfo.locale,
            avatar_url: `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`,
        }

        const jwtToken = jwt.sign(user, config.default.JWT_KEY, { expiresIn: '7d' })
        const encryptedToken = crypto.AES.encrypt(jwtToken, config.default.AES_KEY).toString()

        return encryptedToken
    }

    verifyToken(token: string): jwt.JwtPayload | false {
        token = crypto.AES.decrypt(token, `${config.default.AES_KEY}`).toString(crypto.enc.Utf8)

        const payload = jwt.verify(token, `${config.default.JWT_KEY}`)
        if (typeof payload != 'string') {
            return payload
        } else {
            return false
        }
    }
}

export default AuthServices
