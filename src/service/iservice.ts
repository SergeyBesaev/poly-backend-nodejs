import {Service} from "./service";
import {PartSpeechService} from "./part.speech.service";

export default interface IService {
    service: Service
    speechService: PartSpeechService
}
