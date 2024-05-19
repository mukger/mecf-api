import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Correspondence } from "./correspondence.entity";
import { Course } from "src/course/course.entity";
import { Competence } from "src/competence/competence.entity";
import { AddCorrespondenceDto } from "./dto/add-correspondence.dto";

@Injectable()
export class CorrespondenceRepository extends Repository<Correspondence> {
    constructor(private dataSource: DataSource) {
        super(Correspondence, dataSource.createEntityManager());
    }

    async createCorrespondence(addCorrespondenceDto: AddCorrespondenceDto): Promise<Correspondence> {
        const { course, competence, similarity } = addCorrespondenceDto
        const correspondence = this.create({
            course,
            competence,
            similarity
        })
        return this.save(correspondence)
    }

    async getCorrespondenceByIds(competenceId: string, courseId: string): Promise<Correspondence> {
        return this.createQueryBuilder('correspondence')
            .leftJoinAndSelect('correspondence.competence', 'competence')
            .leftJoinAndSelect('correspondence.course', 'course')
            .where('competence.id = :competenceId', { competenceId })
            .andWhere('course.id = :courseId', { courseId })
            .select([
                'correspondence',
                'course.id', 'course.course_name', 'course.course_key_words',
                'competence.id', 'competence.competence_name', 'competence.competence_key_words'
            ])
            .getOne();
    }

    async getCorrespondencesByCourseId(courseId: string): Promise<Correspondence[]> {
        return this.createQueryBuilder('correspondence')
            .leftJoinAndSelect('correspondence.competence', 'competence')
            .where('correspondence.course_id = :courseId', { courseId })
            .select([
                'correspondence',
                'competence.id', 'competence.competence_name'
            ])
            .getMany()
    }

    async getCorrespondencesByCompetenceId(competenceId: string): Promise<Correspondence[]> {
        return this.createQueryBuilder('correspondence')
            .leftJoinAndSelect('correspondence.course', 'course')
            .where('correspondence.competence_id = :competenceId', { competenceId })
            .select([
                'correspondence',
                'course.id', 'course.course_name'
            ])
            .getMany()
    }
}