import {Controller, Post, UseInterceptors, UploadedFile, UploadedFiles,} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Single upload
  @Post('single')
  @UseInterceptors(FileInterceptor('image')) // no storage config
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const result: any = await this.uploadService.uploadImage(file);

    return {
      url: result.secure_url,
    };
  }

  // Multiple upload
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('images', 10)) // no storage config
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const results: any = await this.uploadService.uploadMultiple(files);

    return results.map((r) => ({
      url: r.secure_url,
    }));
  }
}