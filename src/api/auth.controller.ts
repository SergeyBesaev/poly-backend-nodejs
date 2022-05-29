import express from "express";
import asyncHandler from "express-async-handler";

export function authController(
    app: express.Express,
) {

    app.route('/login')
        .get(asyncHandler(async (req, res, next) => {
            res.send('AuthController work')
        }))
        .post(asyncHandler(async (req, res, next) => {

        }))

    app.route('/registration')
        .post(asyncHandler(async (req, res, next) => {

        }))

}
