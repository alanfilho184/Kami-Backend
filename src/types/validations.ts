class ValidationError extends Error {
    code: string
    constructor(message: string, code: string) {
        super(message)
        this.name = 'ValidationError'
        this.code = code
    }
}

function default_id_validation(id: string, type: string) {
    if (!id) {
        throw new ValidationError(`"${id}" is not a valid ${type}`, 'Not a valid string')
    } else if (!id.match(/^\d+$/g)) {
        throw new ValidationError(`"${id}" is not a valid ${type}`, `The ${type} must contain only digits`)
    } else if (id.length < 18 || id.length > 20) {
        throw new ValidationError(`"${id}" is not a valid ${type}`, `The ${type} must have between 18 and 20 digits of length`)
    } else {
        return id
    }
}

class User_Id {
    user_id: string
    constructor(user_id: string) {
        this.user_id = default_id_validation(user_id, 'user_id')
    }
}

class Server_Id {
    server_id: string
    constructor(server_id: string) {
        this.server_id = default_id_validation(server_id, 'server_id')
    }
}

class Msg_Id {
    msg_id: string
    constructor(msg_id: string) {
        this.msg_id = default_id_validation(msg_id, 'msg_id')
    }
}

class Channel_Id {
    channel_id: string
    constructor(channel_id: string) {
        this.channel_id = default_id_validation(channel_id, 'channel_id')
    }
}

class Sheet_Name {
    sheet_name: string
    constructor(sheet_name: string) {
        if (sheet_name.length > 40) {
            throw new ValidationError(`"${sheet_name}" is not a valid sheet_name`, `Exceeded the maximum of 40 characters`)
        } else if (sheet_name.match(/[ '$%]/g)) {
            throw new ValidationError(`"${sheet_name}" is not a valid sheet_name`, `Contains invalid characters`)
        } else {
            this.sheet_name = sheet_name
        }
    }
}

export { User_Id, Server_Id, Msg_Id, Channel_Id, Sheet_Name }
