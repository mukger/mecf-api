import { IsNotEmpty, Length } from "class-validator";

export class AddCourseDto {
    @IsNotEmpty()
    @Length(6, 255)
    course_name: string;

    @IsNotEmpty()
    @Length(128)
    course_materials: string;
}