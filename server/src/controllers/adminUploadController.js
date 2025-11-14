import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  },
});

// Upload single image
export const uploadImage = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // If Cloudinary is configured, use it
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        try {
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'tryon/products',
                resource_type: 'image',
                transformation: [
                  { width: 1200, height: 1200, crop: 'limit' },
                  { quality: 'auto' },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(req.file.buffer);
          });

          res.json({
            message: 'Image uploaded successfully',
            image: {
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
            },
          });
        } catch (cloudinaryError) {
          console.error('Cloudinary upload error:', cloudinaryError);
          return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
        }
      } else {
        // Fallback: Return a placeholder or use local storage
        // For production, you should implement local file storage
        return res.status(503).json({
          message: 'Image upload service not configured. Please set up Cloudinary or Firebase Storage.',
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload multiple images
export const uploadMultipleImages = async (req, res) => {
  try {
    upload.array('images', 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No image files provided' });
      }

      // If Cloudinary is configured, use it
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        try {
          const uploadPromises = req.files.map(
            (file) =>
              new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  {
                    folder: 'tryon/products',
                    resource_type: 'image',
                    transformation: [
                      { width: 1200, height: 1200, crop: 'limit' },
                      { quality: 'auto' },
                    ],
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else
                      resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        width: result.width,
                        height: result.height,
                      });
                  }
                );
                uploadStream.end(file.buffer);
              })
          );

          const uploadedImages = await Promise.all(uploadPromises);

          res.json({
            message: 'Images uploaded successfully',
            images: uploadedImages,
          });
        } catch (cloudinaryError) {
          console.error('Cloudinary upload error:', cloudinaryError);
          return res.status(500).json({ message: 'Failed to upload images to Cloudinary' });
        }
      } else {
        return res.status(503).json({
          message: 'Image upload service not configured. Please set up Cloudinary or Firebase Storage.',
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

