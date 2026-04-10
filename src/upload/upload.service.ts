import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'real-estate' }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
        .end(file.buffer);
    });
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }
}