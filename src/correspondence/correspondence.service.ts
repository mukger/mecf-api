import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CorrespondenceRepository } from './correspondence.repository';
import { CoursesRepository } from 'src/course/courses.repository';
import { Course } from 'src/course/course.entity';
import { Competence } from 'src/competence/competence.entity';
import { SemanticAnalysisService } from 'src/semantic-analysis/semantic-analysis.service';
import { CreateCorrespondencesDto } from './dto/create-correspondences.dto';

@Injectable()
export class CorrespondenceService {
    constructor(  
        @InjectRepository(CorrespondenceRepository)
        private readonly correspondenceRepository: CorrespondenceRepository,
        private readonly semanticAnalysisService: SemanticAnalysisService,
    ) {}

    async createCorrespondences(createCorrespondencesDto: CreateCorrespondencesDto): Promise<Competence[]> {
        const { course, competences } = createCorrespondencesDto
        const boundCompetences = []
        console.log('test something')
        competences.forEach(async (competence) => {
            let result = (await this.semanticAnalysisService.determineVectorsSimilarity(
                course.course_key_words,
                competence.competence_key_words
            ))
            let similarity = result.data.similarity
            if (similarity > 0.6) {
                await this.correspondenceRepository.createCorrespondence({
                    course,
                    competence,
                    similarity
                })
                boundCompetences.push(competence)
            }
        })
        return boundCompetences
    }
}
