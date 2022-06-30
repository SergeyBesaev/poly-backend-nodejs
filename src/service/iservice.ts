import { Service } from './service'
import { PartSpeechService } from './part.speech.service'
import { AuthService } from './auth.service'
import {EmailService} from "./email.service";

export default interface IService {
    service: Service
    speechService: PartSpeechService
    authService: AuthService
    emailService: EmailService
}
