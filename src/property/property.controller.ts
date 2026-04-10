import {Controller,Post,Body,Get,Param,Delete,Put,Query,UseGuards,Req,UseInterceptors,UploadedFile, UploadedFiles, BadRequestException,} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from './property.entity';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  // =========== create property (without images) 
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createPropertyDto: CreatePropertyDto, @Req() req) {
    return this.propertyService.create(createPropertyDto, req.user.userId);
  }
  // =========== single image upload
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // folder
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '_' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024  // 5 MB
      },
      
      fileFilter: (req, file, cb) =>{
        if(!file.mimetype.match (/\/(jpg|jpeg|png|avif|webp)$/)){
          return cb( new BadRequestException('Only image files allowed.'), false,);
        }
        cb(null, true)
      }
    }),
  )

  uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = `http://localhost:3000/property/uploads/${file.filename}`
    return {
      url: imageUrl
    }; 
  }
  // =========== create with multiple image
  @Post('create-with-images')
  @UseGuards(JwtAuthGuard)  //Only logged-in users with valid JWT token can access this endpoint.
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads', // folder
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '_' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )

  async createWithImages(@UploadedFiles() files: Express.Multer.File[], @Body() createPropertyDto: CreatePropertyDto, @Req() req,){
    const imageUrls = files.map((file) => `http://localhost:3000/property/uploads/${file.filename}`,)
    return this.propertyService.createWithImages(createPropertyDto, req.user.userId, imageUrls)    
  }
  // =========== get all properties
  @Get('all')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('location') location?: string,
  ): Promise<Property[]> {
    return this.propertyService.findAll(+page, +limit, location);
  }
  
  // =========== search
  @Get('search')
  search(
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.propertyService.search(
      minPrice ? +minPrice : undefined,
      maxPrice ? +maxPrice : undefined,
    );
  }

  // =========== get one
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Property> {
    return this.propertyService.findOne(id);
  }

  // =========== update
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Req() req
  ): Promise<Property> {
    return this.propertyService.update(id, updatePropertyDto, req.user.userId, req.user.role);
  }
  
    // =========== delete ( Admin Only )
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Req() req) {
    return this.propertyService.remove(id, req.user);
  }
}
