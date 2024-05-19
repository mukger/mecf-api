import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CorrespondenceRepository } from './correspondence.repository';
import { CoursesRepository } from 'src/course/courses.repository';
import { Course } from 'src/course/course.entity';
import { Competence } from 'src/competence/competence.entity';
import { SemanticAnalysisService } from 'src/semantic-analysis/semantic-analysis.service';
import { CreateCorrespondencesDto } from './dto/create-correspondences.dto';
import { ConfigService } from '@nestjs/config';
import { IsNull, Not } from 'typeorm';
import { Correspondence } from './correspondence.entity';

@Injectable()
export class CorrespondenceService {
    constructor(  
        @InjectRepository(CorrespondenceRepository)
        private readonly correspondenceRepository: CorrespondenceRepository,
        private readonly semanticAnalysisService: SemanticAnalysisService,
        private readonly configService: ConfigService
    ) {}

    async createCorrespondences(createCorrespondencesDto: CreateCorrespondencesDto): Promise<Correspondence[]> {
        const { course, competences } = createCorrespondencesDto
        
        const competencesPromises = competences.map(async (competence) => {
            const result = await this.semanticAnalysisService.determineSimilarity({
                firstWordDict: course.course_key_words,
                secondWordDict: competence.competence_key_words
            });
            const similarity = result.data.similarity;
        
            if (similarity > +this.configService.get('SIMILARITY_UPPER_LIMIT')) {
                return this.correspondenceRepository.createCorrespondence({
                    course,
                    competence,
                    similarity
                });
            }

            return Promise.resolve(null);
        });

        const result = await Promise.all(competencesPromises);
        const createdCorrespondences = result.filter(correspondence => correspondence !== null);

        return createdCorrespondences;

        // const boundCompetences = []
        // competences.forEach(async (competence) => {
        //     let result = (await this.semanticAnalysisService.determineSimilarity({
        //         firstWordDict: course.course_key_words,
        //         secondWordDict: competence.competence_key_words
        //     }))
        //     let similarity = result.data.similarity
        //     if (similarity > +this.configService.get('SIMILARITY_UPPER_LIMIT')) {
        //         await this.correspondenceRepository.createCorrespondence({
        //             course,
        //             competence,
        //             similarity
        //         })
        //         boundCompetences.push(competence)
        //     }
        // })
        // return boundCompetences
    }

    async getCorrespondenceByIds(competenceId: string, courseId: string): Promise<Correspondence> {
        const correspondence = await this.correspondenceRepository.getCorrespondenceByIds(competenceId, courseId)
        if (!correspondence) {
            throw new NotFoundException('There is no correspondence between declared competence and course')
        }
        return correspondence
    }

    async getCorrespondencesByCourseId(courseId: string): Promise<Correspondence[]> {
        return await this.correspondenceRepository.getCorrespondencesByCourseId(courseId)
    }

    async getCorrespondencesByCompetenceId(competenceId: string): Promise<Correspondence[]> {
        return await this.correspondenceRepository.getCorrespondencesByCompetenceId(competenceId)
    }

    async deleteCorrespondencesToCourse(courseId: string): Promise<void> {
        await this.correspondenceRepository.delete({id: Not(IsNull()), course: {id: courseId}})
    }
}
