import asyncHandler from 'express-async-handler'
import express from 'express'
import IService from '../service/iservice'

export function initApi(
    app: express.Express,
    { service, speechService }: IService
) {

    app.route('/lesson-1')
        .get(asyncHandler(async (req, res, next) => {
            res.locals.body = await service.makeRecordVerbsOnUser(req.headers.authorization as string)
            next()
        }))

    app.route('/dictionary')
        .get(asyncHandler(async (req, res, next) => {
            res.locals.body = await speechService.returnAllPartOfSpeech()
            next()
        }))

    app.route('/dictionary/:partOfSpeech')
        .get(asyncHandler(async (req, res, next) => {
            res.locals.body = await speechService.returnAllWords(req.params.partOfSpeech)
            next()
        }))
}
