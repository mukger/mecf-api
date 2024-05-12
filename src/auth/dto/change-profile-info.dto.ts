import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length, Matches, MaxLength } from "class-validator";

export class ChangeProfileInfoDto {
    @Length(4, 20)
    @IsOptional()
    login?: string;

    @IsEmail()
    @MaxLength(50)
    @IsOptional()
    email?: string;
}