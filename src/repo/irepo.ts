import {Repo} from "./repo";
import {PartSpeechRepo} from "./part.speech.repo";

export default interface IRepo {
    repo: Repo
    partSpeechRepo: PartSpeechRepo
}
