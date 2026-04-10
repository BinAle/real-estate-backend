import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './reviews.entity';
import { MongoRepository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { ObjectId } from 'mongodb';
import { Property } from 'src/property/property.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: MongoRepository<Review>,

        @InjectRepository(Property)
        private readonly propertyRepository: MongoRepository<Property>,

        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>
    ){}

    // Add review ( 1 user = 1 review per property)
    async create(userId: string, propertyId: string, createReviewDto:CreateReviewDto){
        const existingReview = await this.reviewRepository.findOne({
            where: { userId, propertyId}
        })

        if(existingReview){
            throw new BadRequestException('You already reviewed this property.')
        }

        const createReview = this.reviewRepository.create({userId, propertyId, ...createReviewDto})

        await this.reviewRepository.save(createReview)
        await this.updatePropertyRating(propertyId)
        return createReview
    }

    // Get reviews by property
    async getReviewsByProperty(propertyId: string, page = 1, limit = 10){
        const skip = (page - 1) * limit
        const [data, total] = await Promise.all([
            this.reviewRepository.find({
                 where: {propertyId},
                 order: {createdAt: 'DESC' },
                 skip,
                 take: limit
            }),
            this.reviewRepository.count({ where: { propertyId } })
        ])

        const userIds = data.map( r => new ObjectId(r.userId))
        const users = await this.userRepository.find({
            where:{
                _id: { $in: userIds}
            } as any
        })
        const userMap = new  Map( users.map(u => [u._id.toString(), u]))

        const reviewsWithser = data.map(r => ({
            ...r,
            user: userMap.get(r.userId)
            ? {
                 name: userMap.get(r.userId)?.name,
                 email: userMap.get(r.userId)?.email,
              }
            : null

        }))
        return { data: reviewsWithser, total, page, lastPage: Math.ceil(total / limit)}
    }

    // Get average rating
    async getAverageRating(propertyId: string){
        try{
            if(!ObjectId.isValid(propertyId)){
            throw new BadRequestException('Invalid propertyId.')
           }
        const property = await this.propertyRepository.findOneBy({where: { _id: new ObjectId(propertyId)}})
        if(!property){
            throw new NotFoundException('Property not found.')
        }
        return{
            averageRating: property.averageRating ?? 0,
            totalReviews: property.totalReviews ?? 0,
        } 
        } catch(error){
            console.error('Error in average rating',error)
            throw error
        }        
    }

    // Delete review (only owner ideally)
    async deleteReview(reviewId: string, userId: string){
        const review = await this.reviewRepository.findOne({ where: { _id: new ObjectId(reviewId) } })
        if(!review){
            throw new NotFoundException('Review not found.')
        }
        if(review.userId !== userId){
            throw new ForbiddenException('You cannot delete this review.')
        }

        await this.reviewRepository.deleteOne({_id: new ObjectId(reviewId)})
        await this.updatePropertyRating(review.propertyId)

        return{message: 'Review deleted.'}
    }

  private async updatePropertyRating(propertyId: string) {
  const result = await this.reviewRepository.aggregate([
    { $match: { propertyId } },
    {
      $group: {
        _id: '$propertyId',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]).toArray();

  const stats = result[0] || {avgRating: 0, totalReviews: 0,};

  await this.propertyRepository.updateOne(
    { _id: new ObjectId(propertyId) },
    {
      $set: {
        averageRating: Number(stats.avgRating.toFixed(1)),
        totalReviews: stats.totalReviews,
      },
    },
  );
}
}
