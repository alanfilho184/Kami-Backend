import { Router, Request, Response } from 'express'
import db from '../config/database'
import SheetController from '../controllers/sheet.controller'
import logger from '../config/logger'

const router = Router()
const sheetController = new SheetController(db)

router.get('/one', async (req: Request, res: Response) => {
    try {
        if (req.query.id) {
            const sheet = await sheetController.getById(Number(req.query.id))

            if (sheet) {
                if (sheet.user_id === req.user.id || sheet.is_public === true) {
                    sheet.user = req.user
                    res.status(200).json({ sheet: sheet })
                }
                else {
                    res.status(403).json({ error: 'Forbidden' })
                }
            } else {
                res.status(404).json({ error: 'Sheet not found' })
            }
        }
        else if (req.query.userId && req.query.sheetName) {
            const sheet = await sheetController.getByUserIdAndSheetName(Number(req.query.userId), req.query.sheetName.toString())

            if (sheet) {
                if (sheet.user_id === req.user.id || sheet.is_public === true) {
                    sheet.user = req.user
                    res.status(200).json({ sheet: sheet })
                }
                else {
                    res.status(403).json({ error: 'Forbidden' })
                }
            } else {
                res.status(404).json({ error: 'Sheet not found' })
            }
        }
        else {
            res.status(400).json({ error: 'Missing parameters' })
        }
    } catch (err) {
        logger.registerError(err)
        res.status(500).end()
    }
})

router.get('/all', async (req: Request, res: Response) => {
    try {
        const sheets = await sheetController.getByUserId(Number(req.user.id))

        if (sheets && sheets.length > 0) {
            res.status(200).json({ sheets: sheets })
        } else {
            res.status(404).json({ error: 'Sheets not found' })
        }
    } catch (err) {
        logger.registerError(err)
        res.status(500).end()
    }
})

export default router
