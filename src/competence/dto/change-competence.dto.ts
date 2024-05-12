import { IsOptional, Length } from "class-validator";

export class ChangeCompetenceDto {
    @IsOptional()
    @Length(6, 255)
    competence_name: string;

    @IsOptional()
    @Length(32)
    competence_description: string;
}