import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './entities/user/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpCredentialsDto } from './dto/signup-credentials-dto';
import { SignInCredentialsDto } from './dto/signin-credentials-dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { UsersRoles } from 'src/data/users-roles';
import { User } from './entities/user/user.entity';
import { ChangeProfileInfoDto } from './dto/change-profile-info.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { SafeProfileInfo } from './interfaces/safe-profile-info.interface';
import { Response } from 'express';
import { RefreshSessionsRepository } from './entities/refresh-session/refresh-session.repository';
import { ConfigService } from '@nestjs/config';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
        @InjectRepository(RefreshSessionsRepository)
        private readonly refreshSessionsRepository: RefreshSessionsRepository,
        private configService: ConfigService,
        private jwtService: JwtService
    ) {}

    async register(
        signUpCredentialsDto: SignUpCredentialsDto,
        res: Response
    ): Promise<{accessToken: string, refreshToken: string}> {
        try {
            const user = await this.usersRepository.createUser(signUpCredentialsDto)
            const { login } = signUpCredentialsDto
            const tokens = await this.formTokens(login, UsersRoles.USER)
            res.cookie("mesAccessToken", tokens.accessToken, { httpOnly: true })
            res.cookie("mesRefreshToken", tokens.refreshToken, { httpOnly: true })
            await this.refreshSessionsRepository.createRefreshSession(
                tokens.refreshToken,
                user,
                this.configService.get('TOKEN_EXPIRATION_REFRESH')
            )
            return tokens
        } catch (error) {
            if (+error.code === 23505) {
                if (error.driverError.detail.includes('email')) {
                    throw new ConflictException('Account with this email already exists')
                }
                else if (error.driverError.detail.includes('login')) {
                    throw new ConflictException('Account with this login already exists')
                }
            } else {
                throw new InternalServerErrorException("Ooops... Something went wrong...")
            }
        }
    }

    async login(
        signInCredentialsDto: SignInCredentialsDto,
        res: Response
    ): Promise<{accessToken: string, refreshToken: string}> {
        const { loginOrEmail, password } = signInCredentialsDto
        const user = await this.usersRepository.findUserByEmailOrLogin(loginOrEmail)
        if (user && (await bcrypt.compare(password, user.password))) {
            try {
                const tokens = await this.formTokens(user.login, UsersRoles.USER)
                res.cookie("mesAccessToken", tokens.accessToken, { httpOnly: true })
                res.cookie("mesRefreshToken", tokens.refreshToken, { httpOnly: true })
                await this.refreshSessionsRepository.createRefreshSession(
                    tokens.refreshToken,
                    user,
                    this.configService.get('TOKEN_EXPIRATION_REFRESH')
                )
                return tokens
            } catch (error) {
                throw new InternalServerErrorException("Ooops... Something went wrong...")
            }
        }
        else {
            throw new UnauthorizedException('Please check your inputed credentials')
        }
    }

    async logout(
        user: User,
        res: Response
    ): Promise<void> {
        res.cookie("mesAccessToken", "")
        res.cookie("mesRefreshToken", "")
        await this.refreshSessionsRepository.deleteOldRefreshSession(user)
        return
    }

    async getProfileInfo(user: User): Promise<User> {
        const { login } = user
        const found = await this.usersRepository.findOneBy({login})
        if (found) {
            return found
        }
        else {
            throw new NotFoundException()
        }
    }

    async changeProfileInfo(
        changeProfileInfoDto: ChangeProfileInfoDto,
        user: User,
        res: Response
    ): Promise<SafeProfileInfo> {
        const { login } = user
        let found = await this.usersRepository.findOneBy({login})
        if (found) {
            try {
                Object.assign(found, await this.usersRepository.changeUserByLogin(login, changeProfileInfoDto))
            } catch (error) {
                if (+error.code === 23505) {
                    if (error.driverError.detail.includes('email')) {
                        throw new ConflictException('Account with this email already exists')
                    }
                    else if (error.driverError.detail.includes('login')) {
                        throw new ConflictException('Account with this login already exists')
                    }
                } else {
                    throw new InternalServerErrorException("Ooops... Something went wrong...")
                }
            }

            let result: SafeProfileInfo = {
                login: found.login,
                email: found.email,
                role: found.role
            }
            if (login) {
                const tokens = await this.formTokens(login, found.role)
                result.access_token = tokens.accessToken
                result.refresh_token = tokens.refreshToken
                res.cookie("mesAccessToken", tokens.accessToken, { httpOnly: true })
                res.cookie("mesRefreshToken", tokens.refreshToken, { httpOnly: true })
            }
            return result
        }
        else {
            throw new NotFoundException()
        }
    }

    async deleteProfile(
        user: User,
        res: Response
    ): Promise<void> {
        res.cookie("mesAccessToken", "")
        res.cookie("mesRefreshToken", "")
        await this.refreshSessionsRepository.delete({id: Not(IsNull()), user: {id: user.id}})
        await this.usersRepository.remove(user)
        return
    } 

    async refreshToken(
        user: User,
        res: Response
    ): Promise<{accessToken: string, refreshToken: string}> {
        try {
            await this.refreshSessionsRepository.deleteOldRefreshSession(user)
            const tokens = await this.formTokens(user.login, UsersRoles.USER)
            res.cookie("mesAccessToken", tokens.accessToken, { httpOnly: true })
            res.cookie("mesRefreshToken", tokens.refreshToken, { httpOnly: true })
            await this.refreshSessionsRepository.createRefreshSession(
                tokens.refreshToken,
                user,
                this.configService.get('TOKEN_EXPIRATION_REFRESH')
            )
            return tokens
        } catch (error) {
            throw new InternalServerErrorException("Ooops... Something went wrong...")
        }
    }

    private async formTokens(login: string, role: UsersRoles): Promise<{accessToken: string, refreshToken: string}> {
        const accessToken = await this.jwtService.signAsync({login, role, type: 'access'})
        const refreshToken = await this.jwtService.signAsync(
            {login, role, type: 'refresh'},
            {expiresIn: this.configService.get('TOKEN_EXPIRATION_REFRESH')}
        )
        return { accessToken, refreshToken }
    }
}

