import { v2 as cloudinary } from "cloudinary";
const {CloudinaryStorage}  = require("multer-storage-cloudinary");

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
         
        folder: 'real-estate',
        allowed_formats: ['jpg', 'jpeg', 'png',],
        public_id: (req, file) => Date.now() + "_" + file.originalname,
      }
})