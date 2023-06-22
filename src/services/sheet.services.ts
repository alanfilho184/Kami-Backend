import db from '../config/database'
import SheetController from '../controllers/sheet.controller'
import { ValidationError } from '../types/errors'
import { Sheet_Name } from '../types/validations'
import { generateSheetPassword } from '../utils'

type PreparedSheet = {
    sheet_name: Sheet_Name
    user_id: number
    sheet_password: string
    is_public: boolean
    attributes: {}
    legacy: false
    last_use: Date
}

class SheetServices {
    private sheetController: SheetController
    constructor() {
        this.sheetController = new SheetController(db)
    }

    async validate(body: any): Promise<Array<{ field: string; message: string }>> {
        const errors: Array<{ field: string; message: string }> = []

        if (!body.sheetName) {
            errors.push({
                field: 'sheet_name',
                message: 'Faltando nome da ficha'
            })

            return errors
        }

        if (Sheet_Name.isValid(body.sheetName) === false) {
            errors.push({
                field: 'sheet_name',
                message: 'Nome da ficha inválido'
            })
        }

        const sheet = await this.sheetController.getByUserIdAndSheetName(body.user_id, body.sheetName)

        if (sheet) {
            errors.push({
                field: 'sheet_name',
                message: 'Esta ficha já existe'
            })
        }

        return errors
    }

    async prepareSheet(body: any, userId: number): Promise<PreparedSheet> {
        return {
            sheet_name: new Sheet_Name(body.sheetName),
            user_id: userId,
            sheet_password: generateSheetPassword(),
            is_public: body.is_public ? body.is_public : false,
            attributes: {},
            legacy: false,
            last_use: new Date()
        }
    }

}

export default SheetServices
