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
import { Correspondence } from 'src/correspondence/correspondence.entity';
import { GetCoursesByIdsDto } from './dto/get-courses-by-ids.dto';

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

    async getCoursesByIds(getCorrespondencesById: GetCoursesByIdsDto): Promise<Course[]> {
        const { ids } = getCorrespondencesById
        const coursePromises = ids.map(id => this.getCourseById(id));
        const result = await Promise.all(coursePromises);

        return result
    }

    async getCorrespondencesById(courseId: string): Promise<Correspondence[]> {
        return await this.correspondenceService.getCorrespondencesByCourseId(courseId)
    }

    async addCourse(addCourseDto: AddCourseDto): Promise<Course> {
        try {
            const keywordsRes = await this.semanticAnalysisService.determineKeyWords({
                name: addCourseDto.course_name,
                materials: addCourseDto.course_materials
            })
            const keywords = keywordsRes.data
            const createdCourse = await this.coursesRepository.createCourse(addCourseDto, keywords)
            const competences = await this.competenceService.getAllCompetences()
            this.correspondenceService.createCorrespondences({course: createdCourse, competences})
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
        const course = await this.getCourseById(courseId)
        const { course_name, course_materials } = changeCourseDto
        if ((!course_name && !course_materials) || (course.course_name === course_name && course.course_materials === course_materials)) {
            return course
        }

        try {
            await this.correspondenceService.deleteCorrespondencesToCourse(courseId)

            const keywordsRes = await this.semanticAnalysisService.determineKeyWords({
                name: course_name || course.course_name,
                materials: course_materials || course.course_materials
            })
            const keywords = keywordsRes.data
            const changedCourse = await this.coursesRepository.changeCourseById(courseId, changeCourseDto, keywords)
            const competences = await this.competenceService.getAllCompetences() 
            await this.correspondenceService.createCorrespondences({course: changedCourse, competences})

            return changedCourse
        } catch (error) {
            if (+error.code === 23505) {
                throw new ConflictException('This name is already taken')
            } else {
                throw new InternalServerErrorException("Ooops... Something went wrong...")
            }
        }
    }

    async deleteCourseById(courseId: string): Promise<void> {
        const result = await this.coursesRepository.delete({id: courseId})
        if (result.affected === 0) {
            throw new NotFoundException("There is no course with this id")
        }
    }
}
