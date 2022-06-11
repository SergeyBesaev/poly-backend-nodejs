
import crypto from 'crypto'

export function shuffle<T>(array: T[]): T[] {
    array.sort(() => Math.random() - 0.5)
    return array
}

export function hashSha256(input: string): string {
    const sha = crypto.createHash('sha256')
    sha.update(input)
    return sha.digest('hex')
}

