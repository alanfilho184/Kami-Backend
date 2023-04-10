function toSheet(sheet: any): Sheet | null {
    try {
        return {
            id: sheet.id,
            user_id: sheet.user_id,
            sheet_name: sheet.sheet_name,
            sheet_password: sheet.sheet_password,
            is_public: sheet.is_public,
            attributes: sheet.attributes,
            last_use: sheet.last_use
        }
    } catch (err) {
        return null
    }
}

function toSheetArray(sheets: any[]): Sheet[] | null {
    try {
        return sheets.map(sheet => {
            return {
                id: sheet.id,
                user_id: sheet.user_id,
                sheet_name: sheet.sheet_name,
                sheet_password: sheet.sheet_password,
                is_public: sheet.is_public,
                attributes: sheet.attributes,
                last_use: sheet.last_use
            }
        })
    } catch (err) {
        return null
    }
}

export default class SheetController {
    private db: Db
    constructor(db: Db) {
        this.db = db
    }

    async create(sheet: Sheet): Promise<Sheet| null> {
        return toSheet(
            await this.db.sheets.create({
                data: {
                    user_id: sheet.user_id,
                    sheet_name: sheet.sheet_name.toString(),
                    sheet_password: sheet.sheet_password,
                    attributes: sheet.attributes
                },
            }),
        )
    }

    async getById(id: number): Promise<Sheet | null> {
        return toSheet(
            await this.db.sheets.findUnique({
                where: {
                    id: id,
                },
            }),
        )
    }

    async getByUserId(userId: number): Promise<Sheet[] | null> {
        return toSheetArray(
            await this.db.sheets.findMany({
                where: {
                    user_id: userId,
                },
                select: {
                    id: true,
                    user_id: true,
                    sheet_name: true
                }
            }),
        )
    }

    async getByUserIdAndSheetName(userId: number, sheetName: string): Promise<Sheet | null> {
        return toSheet(
            await this.db.sheets.findFirst({
                where: {
                    user_id: userId,
                    sheet_name: sheetName,
                },
            }),
        )
    }

    async updateById(id: number, newSheet: Sheet): Promise<Sheet | null> {
        return toSheet(
            await this.db.sheets.update({
                where: {
                    id: id,
                },
                data: {
                    sheet_name: newSheet.sheet_name.toString(),
                    sheet_password: newSheet.sheet_password,
                    attributes: newSheet.attributes
                },
            }),
        )
    }
}
