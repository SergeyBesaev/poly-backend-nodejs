import { Repo } from './repo'
import { PartSpeechRepo } from './part.speech.repo'
import { UserRepo } from './userRepo'
import {TokenRepo} from "./token.repo";

export default interface IRepo {
    repo: Repo
    partSpeechRepo: PartSpeechRepo
    userRepo: UserRepo
    tokenRepo: TokenRepo
}
