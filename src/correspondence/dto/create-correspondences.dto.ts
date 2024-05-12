import { IsNotEmpty, Length } from "class-validator";
import { Competence } from "src/competence/competence.entity";
import { Course } from "src/course/course.entity";

export class CreateCorrespondencesDto {
    @IsNotEmpty()
    course: Course;

    @IsNotEmpty()
    competences: Competence[];
}