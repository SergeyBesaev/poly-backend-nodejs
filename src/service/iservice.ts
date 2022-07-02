import { Service } from './service'
import { PartSpeechService } from './part.speech.service'
import { AuthService } from './auth.service'

export default interface IService {
    service: Service
    speechService: PartSpeechService
    authService: AuthService
}
