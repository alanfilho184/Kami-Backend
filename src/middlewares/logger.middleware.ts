import { Request, Response, NextFunction } from 'express'
import { DateTime } from 'luxon'
import color from 'colors'
import LogHandler from '../logs'

const logHandler = new LogHandler()

export function logger(req: Request, res: Response, next: NextFunction) {
    let sentReponse: any
    const oldJson = res.json
    res.json = (json) => {
        sentReponse = json
        res.json = oldJson
        return res.json(json)
    }

    const time = DateTime.now().setZone('America/Fortaleza').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
    const resource = `${req.method} ${req.url}`

    // res.on('finish', () => {
    //     let info
    //     if (req.credentials && Object.keys(req.body)[0]) {
    //         const data = req.body
    //         data.senha ? (data.senha = '*') : ''
    //         if (data.modificar) {
    //             data.modificar.senha ? (data.modificar.senha = '*') : ''
    //             data.modificar.cpf ? (data.modificar.cpf = '*') : ''
    //         }

    //         info =`Usuário: [ID: ${req.credentials.id} Grupo: ${req.credentials.grupo}] | Body Request: [${JSON.stringify(data)}]`
    //     } else if (req.credentials && !Object.keys(req.body)[0]) {
    //         info =`Usuário: [ID: ${req.credentials.id} Grupo: ${req.credentials.grupo}]`
    //     } else if (Object.keys(req.body)[0]) {
    //         const data = req.body
    //         data.senha ? (data.senha = '*') : ''
    //         if (data.modificar) {
    //             data.modificar.senha ? (data.modificar.senha = '*') : ''
    //             data.modificar.cpf ? (data.modificar.cpf = '*') : ''
    //         }

    //         info =`Body Request: [${JSON.stringify(data)}]`
    //     } else {
    //         info ='Não autenticado | Sem body'
    //     }

    //     if (sentReponse) {
    //         info += ` | Body Reponse: [${JSON.stringify(sentReponse)}]`
    //     }

    //     let status: string = res.statusCode.toString()
    //     const statusNoColor = status

    //     if (parseInt(status) >= 200 && parseInt(status) < 300) {
    //         status = color.green(status)
    //     } else if (parseInt(status) >= 300 && parseInt(status) < 400) {
    //         status = color.cyan(status)
    //     } else if (parseInt(status) >= 400 && parseInt(status) < 500) {
    //         status = color.yellow(status)
    //     } else {
    //         status = color.red(status)
    //     }

    //     const execTime = (DateTime.now().toMillis() - req.startTime).toString() + 'ms'

    //     if (process.env.NODE_ENV != 'test') {
    //         console.log(
    //             `[ ${color.green(time)} ] - [ ${color.green(resource)} ] - [ ${color.cyan(info)} ] - [ ${status} ${color.underline(execTime)} ]\n`,
    //         )
    //     }
    //     logHandler.updateActualLogFile(`[ ${time} ] - [ ${resource} ] - [ ${info} ] - [ ${statusNoColor} ${execTime} ]\n`)
    // })

    next()
}
