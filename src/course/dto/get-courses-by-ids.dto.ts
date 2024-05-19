import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class GetCoursesByIdsDto {
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    ids: string[];
}