import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ObjectId } from 'mongodb';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewService: ReviewsService){}
    // Add review
    @UseGuards(JwtAuthGuard)
    @Post(':propertyId')
    create(@Param('propertyId') propertyId: string, @Body() createReviewDto:CreateReviewDto, @Req() req){
        return this.reviewService.create(req.user.userId, propertyId, createReviewDto)
    }

    // Get review
    @Get(':propertyId')
    getReviews(@Param('propertyId') propertyId: string, @Query('page') page = 1, @Query('limit') limit = 10,){
        return this.reviewService.getReviewsByProperty(propertyId, Number(page), Number(limit))
    }

    // Get average rating
    @Get(':propertyId/average')
    getAverage(@Param('propertyId') propertyId: string){
        if(!ObjectId.isValid(propertyId)){
            throw new BadRequestException('propertyId is not valid.')
        }
        return this.reviewService.getAverageRating(propertyId)
    }

    // Delete review
    @UseGuards(JwtAuthGuard)
    @Delete(':reviewId')
    delete(@Param('reviewId') reviewId: string, @Req() req){
        return this.reviewService.deleteReview(reviewId, req.user.userId)
    }
}
