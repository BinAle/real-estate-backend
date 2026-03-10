import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
    constructor(@InjectRepository (User)
    private readonly userRepository: MongoRepository<User>
    ){}
    async findById(id: string){
        const user = await this.userRepository.findOne({
            where: {_id :new ObjectId(id)},
            select: ['_id','name','email','role','createdAt'],
        })
        if(!user){
            throw new NotFoundException('User not found.')
        }
        return user
    }
}
