import { v2 as cloudinaryLib } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinaryLib.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryLib,
  params: {
    folder: 'jewelry_products',   // folder where images are stored
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

export default { cloudinary: cloudinaryLib, storage };
