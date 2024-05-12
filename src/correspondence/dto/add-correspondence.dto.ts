import { IsNotEmpty, IsNumber, Length } from "class-validator";
import { Competence } from "src/competence/competence.entity";
import { Course } from "src/course/course.entity";

export class AddCorrespondenceDto {
    @IsNotEmpty()
    course: Course;

    @IsNotEmpty()
    competence: Competence;

    @IsNotEmpty()
    @IsNumber()
    similarity: number;
}