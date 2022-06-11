import express from 'express'
import asyncHandler from 'express-async-handler'
import IService from '../service/iservice'
import {UserData} from "../entity/users/user.data";

export function authController(
    app: express.Express,
    { authService }: IService,
) {

    app.route('/register')
        .post(asyncHandler(async (req, res, next) => {
            const user: UserData = await authService.saveUser(req.body)
            res.locals.body = {user}
            next()
        }))

    app.route('/login')
        .post(asyncHandler(async (req, res, next) => {
            res.locals.body = await authService.authUser(req.body)
            next()
        }))

}
