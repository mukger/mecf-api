import { IsNotEmpty } from "class-validator";

export class DetermineSimilarityDto {
    @IsNotEmpty()
    firstWordDict: { [key: string]: number }

    @IsNotEmpty()
    secondWordDict: { [key: string]: number }
}