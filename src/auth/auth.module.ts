import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenJwtStrategy } from './strategies/access-token-jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token-jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshSession } from './entities/refresh-session/refresh-session.entity';
import { RefreshSessionsRepository } from './entities/refresh-session/refresh-session.repository';
import { UsersRepository } from './entities/user/users.repository';
import { User } from './entities/user/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, RefreshSession]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('TOKEN_EXPIRATION_ACCESS')
          }
        }
      }
    }),
  ],
  providers: [AuthService, UsersRepository, RefreshSessionsRepository, AccessTokenJwtStrategy, RolesGuard, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AccessTokenJwtStrategy, PassportModule, RefreshTokenStrategy]
})
export class AuthModule {}
