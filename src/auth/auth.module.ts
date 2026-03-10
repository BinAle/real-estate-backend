import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
    imports:[
        PassportModule.register({ defaultStrategy: 'jwt'}),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'realestate_secret_key',
            signOptions: { expiresIn: '1d'},
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports:[AuthService]
})
export class AuthModule {
}
