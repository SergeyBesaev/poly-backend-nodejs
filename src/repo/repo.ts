import {Client} from "pg";
import {Pronoun} from "../entity/pronoun";
import {Verb} from "../entity/verb";

export class Repo {
    constructor(private readonly dbClient: Client) {
    }

    public async getAllVerbFromDb(): Promise<Verb[]> {
        const result = await this.dbClient.query<Verb>({
            text: `select id,
                          eng_base           "engBase",
                          eng_third          "engThird",
                          eng_simple_past    "engSimplePast",
                          rus_base           "rusBase",
                          rus_present_i      "rusPresentI",
                          rus_present_we     "rusPresentWe",
                          rus_present_you    "rusPresentYou",
                          rus_present_they   "rusPresentThey",
                          rus_present_he_she "rusPresentSheHe",
                          rus_future_i       "rusFutureI",
                          rus_future_we      "rusFutureWe",
                          rus_future_you     "rusFutureYou",
                          rus_future_they    "rusFutureThey",
                          rus_future_he_she  "rusFutureSheHe",
                          rus_past_you_he_i  "rusPastYouHeI",
                          rus_past_we_they   "rusPastWeThey",
                          rus_past_she       "rusPastShe"
                   from verbs`
        })
        return result.rows
    }

    public async getAllPronounsFromDb(): Promise<Pronoun[]> {
        const result = await this.dbClient.query<Pronoun>({
            text: 'select id, eng_pronoun eng, rus_pronoun rus from pronouns'
        })

        return result.rows
    }
}
