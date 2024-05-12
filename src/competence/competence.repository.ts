import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Competence } from "./competence.entity";
import { AddCompetenceDto } from "./dto/add-competence.dto";
import { ChangeCompetenceDto } from "./dto/change-competence.dto";

@Injectable()
export class CompetencesRepository extends Repository<Competence> {
    constructor(private dataSource: DataSource) {
        super(Competence, dataSource.createEntityManager());
    }

    async getAllCompetences(): Promise<Competence[]> {
        const query = this.createQueryBuilder('competence').select(
            [
             'competence.id',
             'competence.competence_name',
             'competence.competence_key_words'
            ]
        )
        return query.getMany()
    }

    async createCompetence(addCompetenceDto: AddCompetenceDto, keyWords: { [key: string]: number }): Promise<Competence> {
        const competence = this.create({
            ...addCompetenceDto,
            competence_key_words: keyWords
        })
        return this.save(competence)
    }

    async changeCompetenceById(
        competenceId: string,
        changeCompetenceDto: ChangeCompetenceDto
    ): Promise<Competence> {
        const competence = await this.findOneBy({id: competenceId})
        if (!competence) {
            return undefined
        }
        Object.assign(competence, changeCompetenceDto)
        return this.save(competence)
    }
}