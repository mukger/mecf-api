import { IsNotEmpty, Length } from "class-validator";

export class AddCompetenceDto {
    @IsNotEmpty()
    @Length(6, 255)
    competence_name: string;

    @IsNotEmpty()
    @Length(32)
    competence_description: string;
}