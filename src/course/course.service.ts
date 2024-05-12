import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CoursesRepository } from './courses.repository';
import { AddCourseDto } from './dto/add-course.dto';
import { ChangeCourseDto } from './dto/change-course.dto';
import { SemanticAnalysisService } from 'src/semantic-analysis/semantic-analysis.service';
import { CorrespondenceService } from 'src/correspondence/correspondence.service';
import { CompetenceService } from 'src/competence/competence.service';
import { Competence } from 'src/competence/competence.entity';

@Injectable()
export class CourseService {
    constructor (
        @InjectRepository(CoursesRepository)
        private readonly coursesRepository: CoursesRepository,
        private readonly semanticAnalysisService: SemanticAnalysisService,
        private readonly correspondenceService: CorrespondenceService,
        private readonly competenceService: CompetenceService
    ) {}

    async getAllCourses(): Promise<Course[]> {
        return this.coursesRepository.getAllCourses()
    }

    async getCourseById(courseId: string): Promise<Course> {
        const course = await this.coursesRepository.findOneBy({id: courseId})
        if (!course) {
            throw new NotFoundException('There is no course with given id')
        }
        return course
    }

    async addCourse(addCourseDto: AddCourseDto): Promise<Course> {
        try {
            //const keywords = await this.semanticAnalysisService.determineKeyWords(addCompetenceDto.competence_description)
            const createdCourse = await this.coursesRepository.createCourse(addCourseDto, {'some_word': 1})
            const competences = await this.competenceService.getAllCompetences()
            await this.correspondenceService.createCorrespondences({course: createdCourse, competences})
            return createdCourse
        } catch (error) {
            if (+error.code === 23505) {
                throw new ConflictException('This name is already taken')
            } else {
                throw new InternalServerErrorException("Ooops... Something went wrong...")
            }
        }
    }

    async changeCourseById(
        courseId: string,
        changeCourseDto: ChangeCourseDto
    ): Promise<Course> {
        try {
            await this.getCourseById(courseId)
            return await this.coursesRepository.changeCourseById(courseId, changeCourseDto)
        } catch (error) {
            if (+error.code === 23505) {
                throw new ConflictException('This name is already taken')
            } else {
                throw new InternalServerErrorException("Ooops... Something went wrong...")
            }
        }
    }
}
