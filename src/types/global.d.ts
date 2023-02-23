import * as validations from './validations'
import { MongoClient } from 'mongodb'

export {}

declare global {
    type Db = MongoClient.Db

    enum Ban_Type {
        TEMPORARY = 'TEMPORARY',
        PERMANENT = 'PERMANENT',
        UNBANNED = 'UNBANNED',
    }

    enum Available_Languagues {
        PT_BR = 'PT_BR',
        EN_US = 'EN_US',
    }

    type User_Id = validations.User_Id
    type Server_Id = validations.Server_Id
    type Msg_Id = validations.Msg_Id
    type Channel_Id = validations.Channel_Id

    type Sheet_Name = validations.Sheet_Name

    type Beta_User = {
        user_id: User_Id
    }

    type Blocked_User = {
        user_id: User_Id
        ban_count: number
        current_ban: Ban_Type
        ban_duration: Date
    }

    type Irt_Sheet = {
        user_id: User_Id
        sheet_name: Sheet_Name
        msg_id: Msg_Id
        channel_id: Channel_Id
        server_id: Server_Id
    }

    type Premium_User = {
        user_id: User_Id
    }

    type Server_Config = {
        server_id: Server_Id
        languague: Available_Languagues
        force_languague: boolean
    }

    type Sheet = {
        user_id: User_Id
        sheet_name: Sheet_Name
        sheet_password: string
        is_public: boolean
        attributes: object
        last_use: Date
    }

    type Usage_Info = {
        bot_commands_count: number
        bot_buttons_count: number
        bot_users_count: number
        bot_servers_count: number
    }

    type User_Config = {
        user_id: User_Id
        languague: Available_Languagues
        default_sheet: Sheet_Name
        secret_roll: boolean
        secret_insan: boolean
        secret_general: boolean
        secret_sheet: boolean
        secret_send: boolean
    }

    type Tutorial = {
        link: string
        title: string
        desc: string
        thumb: string
        tags: string[]
        tutorial: string
    }

    namespace Express {
        interface Application {
            start: function
        }
        interface Request {
            startTime: number
            user: {
                id: string
                username: string
                discriminator: string
                locale: string
                avatar_url: string
            }
        }
    }
}
