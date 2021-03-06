import { WordsRepo } from '../repo/words.repo'
import IRepo from '../repo/irepo'
import { Verb } from '../entity/verb'
import { VerbTensesEnum } from '../entity/verb.tensens.enum'
import { Pronoun } from '../entity/pronoun'
import {shuffle, validateAccessToken} from '../util/util'

export class LessonService {
    private readonly repo: WordsRepo

    constructor(repo: IRepo) {
        this.repo = repo.repo
    }

    public async checkUnfinishedLesson(token: string): Promise<boolean> {

        const dataFromAccessToken = validateAccessToken(token)

        const userIdFromAccessToken: number = dataFromAccessToken.userId

        const verbs: number[] =  await this.repo.checkUnfinishedLessonByUserId(userIdFromAccessToken)

        return verbs.length !== 0

    }

    public async makeRecordVerbsOnUser(token: string) {
        const dataFromAccessToken = validateAccessToken(token)

        const userIdFromAccessToken: number = dataFromAccessToken.userId

        await this.repo.removeAllVerbsByUserId(userIdFromAccessToken)

        const verbs = await this.repo.getAllVerbFromDb()
        shuffle(verbs)

        for (const verb of verbs) {
            const verbTenses: string = await this.fetchRandomVerbTenses()
            const pronoun: Pronoun = await this.fetchRandomNoun()
            await this.repo.makeRecordVerbsOnUserInDB(userIdFromAccessToken, verb.id, verbTenses, pronoun.id)
        }
    }

    public async getFirstVerbForController(token: string) {
        const phrase = await this.getFirstVerb(token)
        return phrase.rus

    }

    public async checkInputVerb(token: string, engForm: string) {

        const dataFromAccessToken = validateAccessToken(token)

        const userIdFromAccessToken: number = dataFromAccessToken.userId

        const phrase = await this.getFirstVerb(token)

        const verb: Verb = await this.repo.getFirstVerbByUserId(userIdFromAccessToken)

        const engRight: string = phrase.eng as string

        if (engRight === engForm) {
            console.log(engRight === engForm)
            await this.repo.deleteVerbById(verb.id)
            return await this.getFirstVerbForController(token)
        } else {
            console.log(typeof engForm)
            throw Error('??????????????')
        }
    }

    private async getFirstVerb(token: string) {
        const dataFromAccessToken = validateAccessToken(token)

        const userIdFromAccessToken: number = dataFromAccessToken.userId

        const verb: Verb = await this.repo.getFirstVerbByUserId(userIdFromAccessToken)

        const verbTense: string = await this.repo.getVerbTenseByUserId(userIdFromAccessToken)

        const pronoun: Pronoun = await this.repo.getFirstPronounByUserId(userIdFromAccessToken)

        return await this.makeDtoOutVerb(verb, verbTense, pronoun)
    }

    private async makeDtoOutVerb(verb: Verb, verbTense: string, pronoun: Pronoun) {
        if (verbTense === VerbTensesEnum.FutureQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `Will I ${verb.engBase}?`, rus: `?? ${verb.rusFutureI}?` }
                case 'You':
                    return { eng: `Will you ${verb.engBase}?`, rus: `???? ${verb.rusFutureYou}?` }
                case 'We':
                    return { eng: `Will we ${verb.engBase}?`, rus: `???? ${verb.rusFutureWe}?` }
                case 'They':
                    return { eng: `Will they ${verb.engBase}?`, rus: `?????? ${verb.rusFutureThey}?` }
                case 'He':
                    return { eng: `Will he ${verb.engBase}?`, rus: `???? ${verb.rusFutureSheHe}?` }
                default:
                    return { eng: `Will she ${verb.engBase}?`, rus: `?????? ${verb.rusFutureSheHe}?` }
            }

        }
        if (verbTense === VerbTensesEnum.FutureStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I will ${verb.engBase}`, rus: `?? ${verb.rusFutureI}` }
                case 'You':
                    return { eng: `You will ${verb.engBase}`, rus: `???? ${verb.rusFutureYou}` }
                case 'We':
                    return { eng: `We will ${verb.engBase}`, rus: `???? ${verb.rusFutureWe}` }
                case 'They':
                    return { eng: `They will ${verb.engBase}`, rus: `?????? ${verb.rusFutureThey}` }
                case 'He':
                    return { eng: `He will ${verb.engBase}`, rus: `???? ${verb.rusFutureSheHe}` }
                default:
                    return { eng: `She will ${verb.engBase}`, rus: `?????? ${verb.rusFutureSheHe}` }
            }

        }
        if (verbTense === VerbTensesEnum.FutureNegative) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I will not ${verb.engBase}`, rus: `?? ???? ${verb.rusFutureI}` }
                case 'You':
                    return { eng: `You will not ${verb.engBase}`, rus: `???? ???? ${verb.rusFutureYou}` }
                case 'We':
                    return { eng: `We will not ${verb.engBase}`, rus: `???? ???? ${verb.rusFutureWe}` }
                case 'They':
                    return { eng: `They will not ${verb.engBase}`, rus: `?????? ???? ${verb.rusFutureThey}` }
                case 'He':
                    return { eng: `He will not ${verb.engBase}`, rus: `???? ???? ${verb.rusFutureSheHe}` }
                default:
                    return { eng: `She will not ${verb.engBase}`, rus: `?????? ???? ${verb.rusFutureSheHe}` }
            }

        }
        if (verbTense === VerbTensesEnum.PresentQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `Do I ${verb.engBase}?`, rus: `?? ${verb.rusPresentI}?` }
                case 'You':
                    return { eng: `Do you ${verb.engBase}?`, rus: `???? ${verb.rusPresentYou}?` }
                case 'We':
                    return { eng: `Do we ${verb.engBase}?`, rus: `???? ${verb.rusPresentWe}?` }
                case 'They':
                    return { eng: `Do they ${verb.engBase}?`, rus: `?????? ${verb.rusPresentThey}?` }
                case 'He':
                    return { eng: `Does he ${verb.engBase}?`, rus: `???? ${verb.rusPresentSheHe}?` }
                default:
                    return { eng: `Does she ${verb.engBase}?`, rus: `?????? ${verb.rusPresentSheHe}?` }
            }

        }
        if (verbTense === VerbTensesEnum.PresentStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I ${verb.engBase}`, rus: `?? ${verb.rusPresentI}` }
                case 'You':
                    return { eng: `You ${verb.engBase}`, rus: `???? ${verb.rusPresentYou}` }
                case 'We':
                    return { eng: `We ${verb.engBase}`, rus: `???? ${verb.rusPresentWe}` }
                case 'They':
                    return { eng: `They ${verb.engBase}`, rus: `?????? ${verb.rusPresentThey}` }
                case 'He':
                    return { eng: `He ${verb.engThird}`, rus: `???? ${verb.rusPresentSheHe}` }
                default:
                    return { eng: `She ${verb.engThird}`, rus: `?????? ${verb.rusPresentSheHe}` }
            }

        }
        if (verbTense === VerbTensesEnum.PresentNegative) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I don't ${verb.engBase}`, rus: `?? ???? ${verb.rusPresentI}` }
                case 'You':
                    return { eng: `You don't ${verb.engBase}`, rus: `???? ???? ${verb.rusPresentYou}` }
                case 'We':
                    return { eng: `We don't ${verb.engBase}`, rus: `???? ???? ${verb.rusPresentWe}` }
                case 'They':
                    return { eng: `They don't ${verb.engBase}`, rus: `?????? ???? ${verb.rusPresentThey}` }
                case 'He':
                    return { eng: `He doesn't ${verb.engBase}`, rus: `???? ???? ${verb.rusPresentSheHe}` }
                default:
                    return { eng: `She doesn't ${verb.engBase}`, rus: `?????? ???? ${verb.rusPresentSheHe}` }
            }

        }
        if (verbTense === VerbTensesEnum.PastQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `Did I ${verb.engBase}?`, rus: `?? ${verb.rusPastYouHeI}?` }
                case 'You':
                    return { eng: `Did you ${verb.engBase}?`, rus: `???? ${verb.rusPastYouHeI}?` }
                case 'We':
                    return { eng: `Did we ${verb.engBase}?`, rus: `???? ${verb.rusPastWeThey}?` }
                case 'They':
                    return { eng: `Did they ${verb.engBase}?`, rus: `?????? ${verb.rusPastWeThey}?` }
                case 'He':
                    return { eng: `Did he ${verb.engBase}?`, rus: `???? ${verb.rusPastYouHeI}?` }
                default:
                    return { eng: `Did she ${verb.engBase}?`, rus: `?????? ${verb.rusPastShe}?` }
            }

        }
        if (verbTense === VerbTensesEnum.PastStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I ${verb.engSimplePast}`, rus: `?? ${verb.rusPastYouHeI}` }
                case 'You':
                    return { eng: `You ${verb.engSimplePast}`, rus: `???? ${verb.rusPastYouHeI}` }
                case 'We':
                    return { eng: `We ${verb.engSimplePast}`, rus: `???? ${verb.rusPastWeThey}` }
                case 'They':
                    return { eng: `They ${verb.engSimplePast}`, rus: `?????? ${verb.rusPastWeThey}` }
                case 'He':
                    return { eng: `He ${verb.engSimplePast}`, rus: `???? ${verb.rusPastYouHeI}` }
                default:
                    return { eng: `She ${verb.engSimplePast}`, rus: `?????? ${verb.rusPastShe}` }
            }

        } else {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I didn't ${verb.engBase}`, rus: `?? ???? ${verb.rusPastYouHeI}` }
                case 'You':
                    return { eng: `You didn't ${verb.engBase}`, rus: `???? ???? ${verb.rusPastYouHeI}` }
                case 'We':
                    return { eng: `We didn't ${verb.engBase}`, rus: `???? ???? ${verb.rusPastWeThey}` }
                case 'They':
                    return { eng: `They didn't ${verb.engBase}`, rus: `?????? ???? ${verb.rusPastWeThey}` }
                case 'He':
                    return { eng: `He didn't ${verb.engBase}`, rus: `???? ???? ${verb.rusPastYouHeI}` }
                default:
                    return { eng: `She didn't ${verb.engBase}`, rus: `?????? ???? ${verb.rusPastShe}` }
            }
        }

    }

    private async fetchRandomNoun(): Promise<Pronoun> {
        const allNoun: Array<Pronoun> = await this.repo.getAllPronounsFromDb()
        const randomIndex: number = Math.random() * allNoun.length
        const pronoun = allNoun.at(randomIndex)
        if (!pronoun) {
            throw new Error('Impossible')
        }
        return pronoun
    }

    private async fetchRandomVerbTenses(): Promise<VerbTensesEnum> {
        const verbTenses: VerbTensesEnum[] = Object.values(VerbTensesEnum)

        const randomIndex: number = Math.random() * verbTenses.length

        const randomVerbTense = verbTenses.at(randomIndex)
        if (!randomVerbTense) {
            throw new Error('Error')
        }

        return randomVerbTense
    }

}
