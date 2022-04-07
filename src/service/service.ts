import {Repo} from "../repo/repo"
import IRepo from "../repo/irepo"
import {Verb} from "../entity/verb"
import {VerbTensesDto} from "../dto/verb.tenses.dto";
import {VerbTensesEnum} from "../entity/verb.tensens.enum";
import {Pronoun} from "../entity/pronoun";
import {shuffle} from "../util/util";

export class Service {
    private readonly repo: Repo

    constructor(repo: IRepo) {
        this.repo = repo.repo
    }

    public async returnListDtoOfAllVerbsTenses() {
        let listVerbs = await this.repo.getAllVerbFromDb()
        listVerbs = shuffle(listVerbs)
        return Promise.all(
            listVerbs.map(verb => this.makeDtoOutVerb(verb))
        )
    }


    private async makeDtoOutVerb(verb: Verb): Promise<VerbTensesDto> {
        const pronoun: Pronoun = await this.fetchRandomNoun()
        const verbTense = await this.fetchRandomVerbTenses()
        if (verbTense === VerbTensesEnum.FutureQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `Will I ${verb.engBase}?`, rusForm: `Я ${verb.rusFutureI}?`}
                case 'You':
                    return {engForm: `Will you ${verb.engBase}?`, rusForm: `Ты ${verb.rusFutureYou}?`}
                case 'We':
                    return {engForm: `Will we ${verb.engBase}?`, rusForm: `Мы ${verb.rusFutureWe}?`}
                case 'They':
                    return {engForm: `Will they ${verb.engBase}?`, rusForm: `Они ${verb.rusFutureThey}?`}
                case 'He':
                    return {engForm: `Will he ${verb.engBase}?`, rusForm: `Он ${verb.rusFutureSheHe}?`}
                default:
                    return {engForm: `Will she ${verb.engBase}?`, rusForm: `Она ${verb.rusFutureSheHe}?`}
            }

        }
        if (verbTense === VerbTensesEnum.FutureStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `I will ${verb.engBase}`, rusForm: `Я ${verb.rusFutureI}`}
                case 'You':
                    return {engForm: `You will ${verb.engBase}`, rusForm: `Ты ${verb.rusFutureYou}`}
                case 'We':
                    return {engForm: `We will ${verb.engBase}`, rusForm: `Мы ${verb.rusFutureWe}`}
                case 'They':
                    return {engForm: `They will ${verb.engBase}`, rusForm: `Они ${verb.rusFutureThey}`}
                case 'He':
                    return {engForm: `He will ${verb.engBase}`, rusForm: `Он ${verb.rusFutureSheHe}`}
                default:
                    return {engForm: `She will ${verb.engBase}`, rusForm: `Она ${verb.rusFutureSheHe}`}
            }

        }
        if (verbTense === VerbTensesEnum.FutureNegative) {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `I will not ${verb.engBase}`, rusForm: `Я не ${verb.rusFutureI}`}
                case 'You':
                    return {engForm: `You will not ${verb.engBase}`, rusForm: `Ты не ${verb.rusFutureYou}`}
                case 'We':
                    return {engForm: `He will not ${verb.engBase}`, rusForm: `Мы не ${verb.rusFutureWe}`}
                case 'They':
                    return {engForm: `They will not ${verb.engBase}`, rusForm: `Они не ${verb.rusFutureThey}`}
                case 'He':
                    return {engForm: `He will not ${verb.engBase}`, rusForm: `Он не ${verb.rusFutureSheHe}`}
                default:
                    return {engForm: `She will not ${verb.engBase}`, rusForm: `Она не ${verb.rusFutureSheHe}`}
            }

        }
        if (verbTense === VerbTensesEnum.PresentQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `Do I ${verb.engBase} ?`, rusForm: `Я ${verb.rusPresentI}?`}
                case 'You':
                    return {engForm: `Do you ${verb.engBase}?`, rusForm: `Ты ${verb.rusPresentYou}?`}
                case 'We':
                    return {engForm: `Do we ${verb.engBase}?`, rusForm: `Мы ${verb.rusPresentWe}?`}
                case 'They':
                    return {engForm: `Do they ${verb.engBase}?`, rusForm: `Они ${verb.rusPresentThey}?`}
                case 'He':
                    return {engForm: `Does he ${verb.engBase}?`, rusForm: `Он ${verb.rusPresentSheHe}?`}
                default:
                    return {engForm: `Does she ${verb.engBase}?`, rusForm: `Она ${verb.rusPresentSheHe}?`}
            }

        }
        if (verbTense === VerbTensesEnum.PresentStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `I ${verb.engBase}`, rusForm: `Я ${verb.rusPresentI}`}
                case 'You':
                    return {engForm: `You ${verb.engBase}`, rusForm: `Ты ${verb.rusPresentYou}`}
                case 'We':
                    return {engForm: `We ${verb.engBase}`, rusForm: `Мы ${verb.rusPresentWe}`}
                case 'They':
                    return {engForm: `They ${verb.engBase}`, rusForm: `Они ${verb.rusPresentThey}`}
                case 'He':
                    return {engForm: `He ${verb.engThird}`, rusForm: `Он ${verb.rusPresentSheHe}`}
                default:
                    return {engForm: `She ${verb.engThird}`, rusForm: `Она ${verb.rusPresentSheHe}`}
            }

        }
        if (verbTense === VerbTensesEnum.PresentNegative) {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `I don't ${verb.engBase}`, rusForm: `Я не ${verb.rusPresentI}`}
                case 'You':
                    return {engForm: `You don't ${verb.engBase}`, rusForm: `Ты не ${verb.rusPresentYou}`}
                case 'We':
                    return {engForm: `We don't ${verb.engBase}`, rusForm: `Мы не ${verb.rusPresentWe}`}
                case 'They':
                    return {engForm: `They don't ${verb.engBase}`, rusForm: `Они не ${verb.rusPresentThey}`}
                case 'He':
                    return {engForm: `He doesn't ${verb.engBase}`, rusForm: `Он не ${verb.rusPresentSheHe}`}
                default:
                    return {engForm: `She doesn't ${verb.engBase}`, rusForm: `Она не ${verb.rusPresentSheHe}`}
            }

        }
        if (verbTense === VerbTensesEnum.PastQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `Did I ${verb.engBase}?`, rusForm: `Я ${verb.rusPastYouHeI}?`}
                case 'You':
                    return {engForm: `Did you ${verb.engBase}?`, rusForm: `Ты ${verb.rusPastYouHeI}?`}
                case 'We':
                    return {engForm: `Did we ${verb.engBase}?`, rusForm: `Мы ${verb.rusPastWeThey}?`}
                case 'They':
                    return {engForm: `Did they ${verb.engBase}?`, rusForm: `Они ${verb.rusPastWeThey}?`}
                case 'He':
                    return {engForm: `Did he ${verb.engBase}?`, rusForm: `Он ${verb.rusPastYouHeI}?`}
                default:
                    return {engForm: `Did she ${verb.engBase}?`, rusForm: `Она ${verb.rusPastShe}?`}
            }

        }
        if (verbTense === VerbTensesEnum.PastStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `I ${verb.engSimplePast}`, rusForm: `Я ${verb.rusPastYouHeI}`}
                case 'You':
                    return {engForm: `You ${verb.engSimplePast}`, rusForm: `Ты ${verb.rusPastYouHeI}`}
                case 'We':
                    return {engForm: `We ${verb.engSimplePast}`, rusForm: `Мы ${verb.rusPastWeThey}`}
                case 'They':
                    return {engForm: `They ${verb.engSimplePast}`, rusForm: `Они ${verb.rusPastWeThey}`}
                case 'He':
                    return {engForm: `He ${verb.engSimplePast}`, rusForm: `Он ${verb.rusPastYouHeI}`}
                default:
                    return {engForm: `She ${verb.engSimplePast}`, rusForm: `Она ${verb.rusPastShe}`}
            }

        } else {
            switch (pronoun.eng) {
                case 'I':
                    return {engForm: `I didn't ${verb.engBase}`, rusForm: `Я не ${verb.rusPastYouHeI}`}
                case 'You':
                    return {engForm: `You didn't ${verb.engBase}`, rusForm: `Ты не ${verb.rusPastYouHeI}`}
                case 'We':
                    return {engForm: `We didn't ${verb.engBase}`, rusForm: `Мы не ${verb.rusPastWeThey}`}
                case 'They':
                    return {engForm: `They didn't ${verb.engBase}`, rusForm: `Они не ${verb.rusPastWeThey}`}
                case 'He':
                    return {engForm: `He didn't ${verb.engBase}`, rusForm: `Он не ${verb.rusPastYouHeI}`}
                default:
                    return {engForm: `She didn't ${verb.engBase}`, rusForm: `Она не ${verb.rusPastShe}`}
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
