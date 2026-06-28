const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure once — reads from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 * Returns { url, publicId }
 *
 * @param {Buffer} buffer   - Raw file buffer (from multer memoryStorage)
 * @param {string} folder   - Cloudinary folder name (e.g. 'sunrise-properties')
 * @param {object} options  - Additional cloudinary upload options
 */
const uploadToCloudinary = (buffer, folder = 'sunrise-properties', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          // Auto-quality and auto-format reduces file size significantly
          { quality: 'auto', fetch_format: 'auto' },
          // Cap at 1200px wide — plenty for a property listing
          { width: 1200, crop: 'limit' },
        ],
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Delete one or more images from Cloudinary by their public_id.
 *
 * @param {string | string[]} publicIds
 */
const deleteFromCloudinary = async (publicIds) => {
  const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
  if (!ids.length) return;

  // Cloudinary allows bulk delete of up to 100 at a time
  const chunks = [];
  for (let i = 0; i < ids.length; i += 100) {
    chunks.push(ids.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    await cloudinary.api.delete_resources(chunk);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
