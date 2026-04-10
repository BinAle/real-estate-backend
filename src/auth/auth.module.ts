import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Load env variables
    ConfigModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    TypeOrmModule.forFeature([User]),

    // FIXED JWT CONFIG
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // correct
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),

    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // export JwtModule if needed elsewhere
})
export class AuthModule {}