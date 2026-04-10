import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PropertyModule } from './property/property.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './upload/upload.controller';
import { FavoritesModule } from './favorites/favorites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // Load envrionment variables
    ConfigModule.forRoot({ isGlobal: true }),
    //Serve static upload files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', 'uploads'),
      serveRoot: '/uploads'
    }),
    // Rate limitting
     ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 20,
        },
      ],
    }),
    //Database connection
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      synchronize: false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    // Feature modules
    AuthModule,
    UserModule,
    PropertyModule,
    FavoritesModule,
    ReviewsModule,
    UploadModule,
  ],
     // Register controller
     controllers: [UploadController],

})
export class AppModule {}
