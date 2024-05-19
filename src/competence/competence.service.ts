import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompetencesRepository } from './competence.repository';
import { Competence } from './competence.entity';
import { AddCompetenceDto } from './dto/add-competence.dto';
import { ChangeCompetenceDto } from './dto/change-competence.dto';
import { SemanticAnalysisService } from 'src/semantic-analysis/semantic-analysis.service';
import { Course } from 'src/course/course.entity';
import { CorrespondenceService } from 'src/correspondence/correspondence.service';
import { Correspondence } from 'src/correspondence/correspondence.entity';
import { CorrespondenceMatrixDto } from './dto/correspondence-matrix.dto';

@Injectable()
export class CompetenceService {
    constructor(  
        @InjectRepository(CompetencesRepository)
        private readonly competencesRepository: CompetencesRepository,
        private readonly semanticAnalysisService: SemanticAnalysisService,
        private readonly correspondenceService: CorrespondenceService,
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

    async getCorrespondenceToCourseByIds(competenceId: string, courseId: string): Promise<Correspondence> {
        return await this.correspondenceService.getCorrespondenceByIds(competenceId, courseId)
    }

    async getCorrespondencesById(competenceId: string): Promise<Correspondence[]> {
        return await this.correspondenceService.getCorrespondencesByCompetenceId(competenceId)
    }

    async getCorrespondenceMatrixToCourseByIds(competenceId: string, courseId: string): Promise<CorrespondenceMatrixDto> {
        const { course: {course_key_words}, competence: {competence_key_words} } = await this.correspondenceService.getCorrespondenceByIds(competenceId, courseId)
        const result = await this.semanticAnalysisService.determineSimilarityMatrix({
            firstWordDict: competence_key_words,
            secondWordDict: course_key_words
        })
        return result.data
    }

    async addCompetence(addCompetenceDto: AddCompetenceDto): Promise<Competence> {
        try {
            const result = await this.semanticAnalysisService.determineKeyWords({
                name: addCompetenceDto.competence_name,
                materials: addCompetenceDto.competence_description
            })
            const keywords = result.data
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
        await this.getCompetenceById(competenceId)
        try {
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
