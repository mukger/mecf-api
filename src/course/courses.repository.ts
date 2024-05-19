import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Course } from "./course.entity";
import { AddCourseDto } from "./dto/add-course.dto";
import { ChangeCourseDto } from "./dto/change-course.dto";

@Injectable()
export class CoursesRepository extends Repository<Course> {
    constructor(private dataSource: DataSource) {
        super(Course, dataSource.createEntityManager());
    }

    async getAllCourses(): Promise<Course[]> {
        const query = this.createQueryBuilder('course').select(
            [
             'course.id',
             'course.course_name',
             'course.course_key_words'
            ]
        )
        return query.getMany()
    }

    async createCourse(addCourseDto: AddCourseDto, keyWords: { [key: string]: number }): Promise<Course> {
        const course = this.create({
            ...addCourseDto,
            course_key_words: keyWords
        })
        return this.save(course)
    }

    async changeCourseById(
        courseId: string,
        changeCourseDto: ChangeCourseDto,
        keywords: { [key: string]: number }
    ): Promise<Course> {
        const course = await this.findOneBy({id: courseId})
        if (!course) {
            return undefined
        }
        Object.assign(course, changeCourseDto)
        if (keywords) {
            course.course_key_words = keywords
        }
        return this.save(course)
    }
}