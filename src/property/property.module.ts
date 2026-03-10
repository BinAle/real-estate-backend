import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './property.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
  TypeOrmModule.forFeature([Property]),
  MulterModule.register({
    dest: './uploads',
  }),
  ],
  providers: [PropertyService],
  controllers: [PropertyController]
})
export class PropertyModule {
}
