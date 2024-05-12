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
}