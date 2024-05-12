import { IsNotEmpty } from "class-validator";

export class SignInCredentialsDto {
    @IsNotEmpty()
    loginOrEmail: string;

    @IsNotEmpty()
    password: string;
}