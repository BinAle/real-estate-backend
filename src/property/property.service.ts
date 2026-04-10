import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './property.entity';
import { MongoRepository } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ObjectId } from 'mongodb';
import { UpdatePropertyDto } from './dto/update-property.dto';
import path from 'path';
import fs from 'fs';
import { existsSync } from 'fs';

@Injectable()
export class PropertyService {
    constructor(@InjectRepository (Property)
    private propertyRepository: MongoRepository<Property>,
) {}

async create(createPropertyDto: CreatePropertyDto, userId: string): Promise<Property>{
    const property = this.propertyRepository.create({...createPropertyDto, ownerId: userId,})
    return this.propertyRepository.save(property)
}

async findAll(page = 1, limit = 10, location?: string): Promise<Property[]>{
    const query: any = {}; // empty query object to build dynamic search conditions
    if(location) query.location = {$regex: location, $options: "i"}
    return this.propertyRepository.find({
        where: query,
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC'}
    })
}

async findOne(id: string){
    if(!ObjectId.isValid(id)){
        throw new BadRequestException("Invalid property ID.")
    }
    const property = await this.propertyRepository.findOne({where: { _id: new ObjectId(id) } })
    if(!property){
        throw new NotFoundException(`Property with id ${id} not found.`)
    }
    return property
}

async update(id: string, updatePropertyDto: UpdatePropertyDto, userId: string, role: string){
    const property = await this.findOne(id)
    if(role !== 'ADMIN' && property.ownerId !== userId){
        throw new ForbiddenException('Access denied')
    }
    const updatedProperty = Object.assign(property, updatePropertyDto)
    return this.propertyRepository.save(updatedProperty)
}

async remove(id: string, user: any): Promise<{message:string}>{
    if(!ObjectId.isValid(id)){
        throw new BadRequestException('Invalid MongoDB ID.')
    }
    const objectId = new ObjectId(id)
    const property = await this.propertyRepository.findOne({ where: { _id: objectId } })
    
    if(!property){
        throw new NotFoundException(`Property with id ${id} not found.`)
    }

    if(user.role !== 'ADMIN' && property.ownerId !== user.userId){
       throw new ForbiddenException('Access denied')
    }
    
    if(property.images && property.images.length > 0){
        property.images.forEach((image) => {
            const parts = image.split('/uploads')
            if(parts.length > 1){
                const fileName = parts[1];
                const filePath = path.join(process.cwd(), 'uploads', fileName)
              if(fs.existsSync(filePath)){
               fs.unlinkSync(filePath)
             }
            }
        })
    }

    const result = await this.propertyRepository.delete(objectId)
    if(result.affected === 0){
        throw new NotFoundException(`Property with id ${id} could not be deleted.`)
    }
    return{message:'Property deleted successfully.'}

    
}

async search(minPrice?: number, maxPrice?: number){
    const query: any = {}
    if(minPrice || maxPrice){
        query.price = {}
        if(minPrice) query.price.$gte = minPrice
        if(maxPrice) query.price.$lte = maxPrice
    }
    return this.propertyRepository.find({where:query})
}

async createWithImages(createPropertyDto: CreatePropertyDto, userId: string, imageUrls: string[]){  
   createPropertyDto.images = imageUrls
   return this.create(createPropertyDto, userId)
}

}
