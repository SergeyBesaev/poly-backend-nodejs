import {Client} from 'pg';

export async function initDB() {
    const client = new Client({
        user: 'sergey',
        host: 'localhost',
        database: 'polyglotDB',
        password: 'password123',
        port: 5432,
    })

    await client.connect()
    return client
}
