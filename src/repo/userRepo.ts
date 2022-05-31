import { Client } from 'pg'
import { User } from '../entity/users/user'


export class UserRepo {
    constructor(private readonly dbClient: Client) {
    }

    public async saveUserInDB(user: User, password: string): Promise<void> {
        await this.dbClient.query({
            text: `insert into users (name, password)
                   values ($1, $2)`,
            values: [user.name, password]
        })
    }

    public async fetchUserByName(userName: string): Promise<User> {
        const result = await this.dbClient.query<User>({
            text: `select *
                   from users
                   where name = $1`,
            values: [userName]
        })
        return result.rows[0]
    }

}
