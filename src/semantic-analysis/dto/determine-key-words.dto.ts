import { IsNotEmpty } from "class-validator";

export class DetermineKeyWordsDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    materials: string
}