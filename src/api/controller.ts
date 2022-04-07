import asyncHandler from 'express-async-handler'
import express from 'express'
import IService from "../service/iservice"

export function initApi(
    app: express.Express,
    { service }: IService
) {

    app.route('/lesson-1')
        .get(asyncHandler(async (req, res, next) => {
            res.locals.body = await service.returnListDtoOfAllVerbsTenses()
            next()
        }))

}
