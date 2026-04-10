import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
    constructor( private readonly favoritesService: FavoritesService) {
    }

    // Save property
    @UseGuards(JwtAuthGuard)
    @Post(':propertyId')
    addFavorite(@Param('propertyId') propertyId: string, @Req() req){
        console.log("User from token:",req.user)
        const userId = req.user.userId
        if(!userId){
            return {message:"userId does not exist !"}
        }
        return this.favoritesService.addFavorite(userId, propertyId)
    }

    // Get favorites
    @UseGuards(JwtAuthGuard)
    @Get('myfavorite')
    getMyFavorites(@Req() req){
        console.log(req.user)
        const userId = req.user.userId
        if(!userId){
            return {message:"userId does not exist !"}
        }
        return this.favoritesService.getMyFavorites(userId)
    }

    // Remove favorites
    @UseGuards(JwtAuthGuard)
    @Delete(':propertyId')
    removeMyFavorites(@Param('propertyId') propertyId:string, @Req() req){
        console.log(req.user)
        const userId = req.user.userId
        if(!userId){
            return {message:"userId does not exist !"}
        }
        return this.favoritesService.removeMyFavorites(userId,propertyId)
    }
}
