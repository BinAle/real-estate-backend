import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { storage } from "../config/cloudinary.storage";

@Controller('upload')
export class UploadController{
    @Post()
    @UseInterceptors(FileInterceptor ('image', { storage }))
    uploadImage(@UploadedFile() file: Express.Multer.File){
        return {
            imageURL: file.path
        }
    }
}