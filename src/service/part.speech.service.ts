import IRepo from "../repo/irepo";
import {PartSpeechRepo} from "../repo/part.speech.repo";
import {PartOfSpeechEnum} from "../entity/part.of.speech.enum";

export class PartSpeechService {
    private readonly repo: PartSpeechRepo

    constructor(repo: IRepo) {
        this.repo = repo.partSpeechRepo
    }

    public async returnAllPartOfSpeech() {
        return Object.values(PartOfSpeechEnum)
    }

    public async returnAllWords(partsOfSpeech: string) {
        return await this.repo.getAllWordsFromDb(partsOfSpeech)
    }


}
