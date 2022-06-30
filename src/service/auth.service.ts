import {UserRepo} from '../repo/userRepo'
import IRepo from '../repo/irepo'
import {User} from '../entity/users/user'
import uuid from "uuid/v4";
import {hashSha256, validateRefreshToken} from "../util/util"
import {UserData} from "../entity/users/user.data"
import jwt from "jsonwebtoken"
import {TokenRepo} from "../repo/token.repo"
require('dotenv').config()

const DELIMETER: string = process.env.DELIMETER as string
const accessSecretKey: string = process.env.JWT_ACCESS_TOKEN_KEY as string
const refreshSecretKey: string  = process.env.JWT_REFRESH_TOKEN_KEY as string

export class AuthService {
    private readonly repo: UserRepo
    private readonly tokenRepo: TokenRepo

    constructor(repo: IRepo, tokenRepo: IRepo) {
        this.repo = repo.userRepo
        this.tokenRepo = tokenRepo.tokenRepo
    }

    // TODO добавить валидация полей
    public async registration(user: User): Promise<UserData> {
        const candidate: User = await this.repo.fetchUserByEmail(user.email)
        if (candidate) {
            throw Error(`User with email ${user.email} already exists`)
        }

        const salt = uuid()
        const hashedPassword = this.hashPassword(user.password, salt)
        const combined = `${hashedPassword}${DELIMETER}${salt}` // Save this as user's password to Database

        await this.repo.saveUserInDB(user, combined)

        const userFetched: User = await this.repo.fetchUserByEmail(user.email)

        const userData: UserData = this.user2userData(userFetched)

        await this.saveRefreshToken(userData.id!, userData.refreshToken!)

        return userData
    }

    public async authorization(user: User): Promise<UserData> {
        const candidate: User = await this.repo.fetchUserByEmail(user.email)
        const error = Error(`Invalid login or password`)

        // TODO добавить логи, чтобы видеть какая именно ошибка: по логину или по паролю
        if (!candidate) {
            throw error
        }

        if (!this.checkPassword(user.password, candidate.password)) {
            throw error
        }

        const userData: UserData = this.user2userData(candidate)

        await this.saveRefreshToken(candidate.id!, userData.refreshToken!)

        return userData
    }

    public async logout(refreshToken: string) {
        await this.tokenRepo.removeRefreshTokenFromDB(refreshToken)
    }

    public async refresh(refreshToken: string): Promise<UserData> {
        if(!refreshToken) {
            throw Error('Неизвестная ошибка')
        }

        const tokenCheck = validateRefreshToken(refreshToken)

        const tokenFromDB = await this.tokenRepo.findRefreshTokenInDbByToken(refreshToken)

        if (!tokenCheck || !tokenFromDB) {
            throw Error('Пользователь не авторизован')
        }

        const email: string = tokenCheck.email
        const user: User = await this.repo.fetchUserByEmail(email)

        const userData: UserData = this.user2userData(user)

        await this.tokenRepo.updateRefreshTokenInDB(userData.id, userData.refreshToken!)

        return userData

    }

    private user2userData(user: User): UserData {
        return {
            id: user.id!,
            email: user.email,
            name: user.name,
            accessToken: this.generateAccessToken(user.id!, user.email),
            refreshToken: this.generateRefreshToken(user.id!, user.email)
        }
    }

    private hashPassword(password: string, salt: string): string {
        const input = `${password}${DELIMETER}${salt}`
        return hashSha256(input)
    }

    private checkPassword(enteredPassword: string, passwordFromDb: string): boolean {
        const [pass, salt] = passwordFromDb.split(DELIMETER)
        return this.hashPassword(enteredPassword, salt) === pass
    }

    private generateAccessToken(userId: number, email: string): string {
        const payload = {
            userId,
            email
        }
        return jwt.sign(payload, accessSecretKey, {expiresIn: '24h'})
    }

    private generateRefreshToken(userId: number, email: string): string {
        const payload = {
            userId,
            email
        }
        return jwt.sign(payload, refreshSecretKey as string, {expiresIn: '30d'})
    }

    private async saveRefreshToken(userId: number, token: string): Promise<void> {
        const findRefreshToken: string = await this.tokenRepo.findRefreshTokenInDB(userId)

        if (findRefreshToken) {
            await this.tokenRepo.updateRefreshTokenInDB(userId, token)
        } else {
            await this.tokenRepo.saveRefreshTokenInDB(userId, token)
        }

    }

}
