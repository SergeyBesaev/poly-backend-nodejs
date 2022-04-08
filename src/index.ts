import express, { NextFunction, Request, Response } from 'express'
import {Client} from "pg";
import {initDB} from "./db/init";
import {initApi} from "./api/controller";
import IRepo from "./repo/irepo";
import IService from "./service/iservice";
import {Repo} from "./repo/repo";
import {Service} from "./service/service";
import {PartSpeechService} from "./service/part.speech.service";
import {PartSpeechRepo} from "./repo/part.speech.repo";

export class App {

    async run() {
        const app = express()

        const dbClientDb = initDB()
        const repo = this.initRepo(await dbClientDb)
        const service = this.initService(repo)

        app.use(express.json())

        initApi(app, service)

        function errorHandler() {
            return async (error: Error, req: Request, res: Response, next: NextFunction) => {

                console.error(error.stack)
                const body = {
                    success: false,
                    error: error.message
                }
                res.status(500).json(body)
            }

        }

        function responseHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                if (!req.route) {
                    return res.status(404).end()
                }
                console.log(`Success response to ${req.originalUrl}`)
                const body = {
                    success: true,
                    data: res.locals.body
                }
                return res.status(200).json(body).end()
            }

        }

        app.use(errorHandler())
        app.use(responseHandler())

        const port = 8080

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }

    private initRepo(dbClient: Client): IRepo {
        return {
            repo: new Repo(dbClient),
            partSpeechRepo: new PartSpeechRepo(dbClient),
        }
    }

    private initService(repo: IRepo): IService {
        return {
            service: new Service(repo),
            speechService: new PartSpeechService(repo),
        }
    }

}

void new App().run()
