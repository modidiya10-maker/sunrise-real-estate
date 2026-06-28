const Property = require('../models/Property');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary');

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/upload
//  Protected — upload 1-20 images, returns Cloudinary URLs
//
//  Expects multipart/form-data with field name `images`
//  Optional body field: propertyId — if provided, appends the URLs to that
//  property document automatically.
// ─────────────────────────────────────────────────────────────────────────────
exports.uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded.' });
  }

  // Upload all files to Cloudinary in parallel
  const uploadPromises = req.files.map((file) =>
    uploadToCloudinary(file.buffer, 'sunrise-properties')
  );

  const results = await Promise.all(uploadPromises);

  const urls = results.map((r) => r.url);
  const publicIds = results.map((r) => r.publicId);

  // If a propertyId was sent, attach images to the property right away
  if (req.body.propertyId) {
    await Property.findByIdAndUpdate(req.body.propertyId, {
      $push: {
        images: { $each: urls },
        imagePublicIds: { $each: publicIds },
      },
    });
  }

  res.status(201).json({
    success: true,
    urls,
    publicIds,
    count: urls.length,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
//  DELETE /api/upload
//  Protected — delete a single image by publicId
//
//  Body: { publicId, propertyId? }
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteImage = async (req, res) => {
  const { publicId, propertyId } = req.body;

  if (!publicId) {
    return res.status(400).json({ success: false, message: 'publicId is required.' });
  }

  await deleteFromCloudinary(publicId);

  // If a propertyId was provided, remove the URL from the property document
  if (propertyId) {
    // We need the URL from the publicId — Cloudinary URLs follow a predictable
    // pattern, but it's safer to pull the document and filter arrays.
    const property = await Property.findById(propertyId).select('+imagePublicIds');
    if (property) {
      const idx = property.imagePublicIds.indexOf(publicId);
      if (idx !== -1) {
        property.images.splice(idx, 1);
        property.imagePublicIds.splice(idx, 1);
        await property.save();
      }
    }
  }

  res.json({ success: true, message: 'Image deleted.' });
};
