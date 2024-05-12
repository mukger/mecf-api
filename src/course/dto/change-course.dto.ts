import { IsOptional, Length } from "class-validator";

export class ChangeCourseDto {
    @IsOptional()
    @Length(6, 255)
    course_name: string;
 
    @IsOptional()
    @Length(128)
    course_materials: string;
}