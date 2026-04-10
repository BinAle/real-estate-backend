import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorites.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private favoritesRepository: Repository<Favorite>
) {}

// Add property to favorites
async addFavorite(userId:string, propertyId: string){
    const existing = await this.favoritesRepository.findOne({ where: {userId, propertyId}})
    if(existing){
        return { message: 'Property already in favorites.'}
    }

    const favorite = this.favoritesRepository.create({ userId, propertyId})
    return this.favoritesRepository.save(favorite)
}

// Get my favorites
async getMyFavorites(userId: string){
    return this.favoritesRepository.find({ where :{userId}, order :{createdAt: "DESC"}})
}

// Remove my favorites

async removeMyFavorites(userId: string, propertyId: string){
    await this.favoritesRepository.delete({userId, propertyId})
    return {message:"Removed from favorites."}
}

}
