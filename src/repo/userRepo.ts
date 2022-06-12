import { Client } from 'pg'
import { User } from '../entity/users/user'

export class UserRepo {
    constructor(private readonly dbClient: Client) {
    }

    public async saveUserInDB(user: User, password: string): Promise<void> {
        await this.dbClient.query({
            text: `insert into users (name, password, email)
                   values ($1, $2, $3)`,
            values: [user.name, password, user.email]
        })
    }

    public async fetchUserByEmail(email: string): Promise<User> {
        const result = await this.dbClient.query<User>({
            text: `select *
                   from users
                   where email = $1`,
            values: [email]
        })
        return result.rows[0]
    }

    public async getAllUsersFromDB(): Promise<User[]> {
        const result = await this.dbClient.query<User>({
            text: 'select * from users'
        })
        return result.rows
    }

}
