import { Repo } from './repo'
import { PartSpeechRepo } from './part.speech.repo'
import { UserRepo } from './userRepo'

export default interface IRepo {
    repo: Repo
    partSpeechRepo: PartSpeechRepo
    authRepo: UserRepo
}
