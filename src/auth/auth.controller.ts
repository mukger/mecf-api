import { Controller, Delete, HttpStatus, Patch, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpCredentialsDto } from './dto/signup-credentials-dto';
import { SignInCredentialsDto } from './dto/signin-credentials-dto';
import { Post, Body, Get } from '@nestjs/common';
import { User } from './entities/user/user.entity';
import { UseGuards } from '@nestjs/common';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangeProfileInfoDto } from './dto/change-profile-info.dto';
import { SafeProfileInfo } from './interfaces/safe-profile-info.interface';
import { Response } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    register(
        @Body() signUpCredentialsDto: SignUpCredentialsDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<{accessToken: string, refreshToken: string}> {
        return this.authService.register(signUpCredentialsDto, res)
    }

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    login(
        @Body() signInCredentialsDto: SignInCredentialsDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<{accessToken: string, refreshToken: string}> {
        return this.authService.login(signInCredentialsDto, res)
    }

    @Delete('/signout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    logout(
        @GetUser() user: User,
        @Res({ passthrough: true }) res: Response
    ): Promise<void> {
        return this.authService.logout(user, res)
    }

    @Get('/profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    getProfileInfo(
        @GetUser() user: User
    ): Promise<User> {
        return this.authService.getProfileInfo(user)
    }

    @Patch('/profile')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    changeProfileInfo(
        @Body() changeProfileInfoDto: ChangeProfileInfoDto,
        @GetUser() user: User,
        @Res({ passthrough: true }) res: Response
    ): Promise<SafeProfileInfo> {
        return this.authService.changeProfileInfo(changeProfileInfoDto, user, res)
    }

    @Post('/refresh')
    @UseGuards(JwtRefreshAuthGuard)
    refreshToken(
        @GetUser() user: User,
        @Res({ passthrough: true }) res: Response
    ): Promise<{accessToken: string, refreshToken: string}> {
        return this.authService.refreshToken(user, res)
    }

    @Delete('/profile')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    deleteProfile(
        @GetUser() user: User,
        @Res({ passthrough: true }) res: Response
    ): Promise<void> {
        return this.authService.deleteProfile(user, res)
    }

}

