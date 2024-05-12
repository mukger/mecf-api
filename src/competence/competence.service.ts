import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompetencesRepository } from './competence.repository';
import { Competence } from './competence.entity';
import { AddCompetenceDto } from './dto/add-competence.dto';
import { ChangeCompetenceDto } from './dto/change-competence.dto';
import { SemanticAnalysisService } from 'src/semantic-analysis/semantic-analysis.service';

@Injectable()
export class CompetenceService {
    constructor(  
        @InjectRepository(CompetencesRepository)
        private readonly competencesRepository: CompetencesRepository,
        private readonly semanticAnalysisService: SemanticAnalysisService
    ) {} 

    async getAllCompetences(): Promise<Competence[]> {
        return this.competencesRepository.getAllCompetences()
    }

    async getCompetenceById(competenceId: string): Promise<Competence> {
        const competence = await this.competencesRepository.findOneBy({id: competenceId})
        if (!competence) {
            throw new NotFoundException('There is no competence with given id')
        }
        return competence
    }

    async addCompetence(addCompetenceDto: AddCompetenceDto): Promise<Competence> {
        try {
            const keywords = {
                'some_word1': 1,
                'some_word2': 1,
                'some_word3': 1,
                'some_word4': 1,
                'some_word5': 1
            }
            //const keywords = await this.semanticAnalysisService.determineKeyWords(addCompetenceDto.competence_description)
            return await this.competencesRepository.createCompetence(addCompetenceDto, keywords)
        } catch (error) {
            if (+error.code === 23505) {
                throw new ConflictException('This name is already taken')
            } else {
                throw new InternalServerErrorException("Ooops... Something went wrong...")
            }
        }
    }

    async changeCompetenceById(
        competenceId: string,
        changeCompetenceDto: ChangeCompetenceDto
    ): Promise<Competence> {
        try {
            await this.getCompetenceById(competenceId)
            return await this.competencesRepository.changeCompetenceById(competenceId, changeCompetenceDto)
        } catch (error) {
            if (+error.code === 23505) {
                throw new ConflictException('This name is already taken')
            } else {
                throw new InternalServerErrorException("Ooops... Something went wrong...")
            }
        }
    }

    async deleteCompetenceById(competenceId: string): Promise<void> {
        const result = await this.competencesRepository.delete({id: competenceId})
        if (result.affected === 0) {
            throw new NotFoundException("There is no competence with this id")
        }
    }
}
