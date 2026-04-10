import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { User } from '../user/user.entity';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService 
) {}

async register(registerUserDto: RegisterUserDto){
    const existsEmail = await this.userRepository.findOne({ where: {email: registerUserDto.email}})
    if(existsEmail){
        throw new BadRequestException("Email already exists.")
    }
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 8)
    const user = this.userRepository.create({
        ...registerUserDto,
        password: hashedPassword,
        role: 'USER'
    })
    await this.userRepository.save(user)
    return {message: 'User registered successfully.'}
}

async login(loginUserDto: LoginUserDto){
    const user = await this.userRepository.findOne({ where: {email: loginUserDto.email}})
    if(!user){
        throw new UnauthorizedException("Invalid Credentials.")
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password)
    if(!isMatch){
        throw new UnauthorizedException("Invalid Credentials.")
    }
    const payload = {sub: user._id.toString(), email: user.email, role: user.role}
    return{
        access_token: this.jwtService.sign(payload, {expiresIn: '1d'}),
        refresh_token: this.jwtService.sign(payload, {expiresIn: '7d'}),
    }
}
}
