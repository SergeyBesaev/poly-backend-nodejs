import {UserRepo} from '../repo/userRepo'
import IRepo from '../repo/irepo'
import {User} from '../entity/users/user'
import uuid from "uuid/v4";
import {hashSha256} from "../util/util"
import {UserData} from "../entity/users/user.data"
import jwt from "jsonwebtoken"

const DELIMETER = '::'
const secret = 'SECRET'

export class AuthService {
    private readonly repo: UserRepo

    constructor(repo: IRepo) {
        this.repo = repo.authRepo
    }

    public async saveUser(user: User): Promise<UserData> {
        const candidate: User = await this.repo.fetchUserByName(user.name)
        if (candidate) {
            throw Error(`User with name ${user.name} already exists`)
        }

        const salt = uuid()
        const hashedPassword = this.hashPassword(user.password, salt)
        const combined = `${hashedPassword}${DELIMETER}${salt}` // Save this as user's password to Database

        await this.repo.saveUserInDB(user, combined)

        const userFetched: User = await this.repo.fetchUserByName(user.name)

        return this.user2userData(userFetched)
    }

    public async authUser(user: User) {
        const candidate: User = await this.repo.fetchUserByName(user.name)
        const error = Error(`Invalid login or password`)

        // TODO добавить логи, чтобы видеть какая именно ошибка: по логину или по паролю
        if (!candidate) {
            throw error
        }

        if (!this.checkPassword(user.password, candidate.password)) {
            throw error
        }

        return this.generateAccessToken(candidate.id!)
    }

    private user2userData(user: User): UserData {
        return {id: user.id!, name: user.name}
    }

    private hashPassword(password: string, salt: string): string {
        const input = `${password}${DELIMETER}${salt}`
        return hashSha256(input)
    }

    private checkPassword(enteredPassword: string, passwordFromDb: string): boolean {
        const [pass, salt] = passwordFromDb.split(DELIMETER)
        return this.hashPassword(enteredPassword, salt) === pass
    }

    private generateAccessToken(userId: number): string {
        const payload = {
            userId
        }
        return jwt.sign(payload, secret, {expiresIn: '24h'})
    }

}
