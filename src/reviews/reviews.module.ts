import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.entity';
import { Property } from 'src/property/property.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Property, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
