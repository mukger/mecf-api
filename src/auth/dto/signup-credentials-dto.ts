import { IsEmail, IsEnum, IsNotEmpty, Length, Matches, MaxLength } from "class-validator";
import { passwordRegEx } from "src/data/password-regex";
import { UsersRoles } from "src/data/users-roles";

export class SignUpCredentialsDto {
    @Length(4, 20)
    @IsNotEmpty()
    login: string;

    @IsEmail()
    @MaxLength(50)
    @IsNotEmpty()
    email: string;

    @Matches(passwordRegEx, {
        message: 'password is too weak'
    })
    @Length(6, 24)
    @IsNotEmpty()
    password: string;

    @IsEnum(UsersRoles)
    role: UsersRoles;
}