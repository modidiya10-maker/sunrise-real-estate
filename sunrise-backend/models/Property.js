const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    price: {
      type: String,          // Stored as a display string (e.g. "₹42,00,000") to
      required: [true, 'Price is required'], // preserve the existing frontend rendering
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,          // Apartment, Bungalow, Shop, Office, Plot …
      required: [true, 'Property type is required'],
      trim: true,
    },
    category: {
      type: String,          // sale | rent | lease | rent-sale | commercial
      required: [true, 'Category is required'],
      enum: ['sale', 'rent', 'lease', 'rent-sale', 'commercial', 'buy'],
      lowercase: true,
    },
    area: {
      type: String,          // sq.ft as string (e.g. "1050")
      default: '',
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    availability: {
      type: String,
      enum: ['Available', 'Sold', 'Rent Out', 'Not Available', 'Available In'],
      default: 'Available',
    },
    availableFrom: {
      type: String,          // date string, e.g. "2024-06-01"
      default: '',
    },
    furniture: {
      type: String,
      enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished', ''],
      default: 'Unfurnished',
    },
    // images is an array of Cloudinary URLs
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: 'A property can have at most 20 images',
      },
    },
    // Cloudinary public_ids for deletion — parallel array to `images`
    imagePublicIds: {
      type: [String],
      default: [],
      select: false, // internal use only; not sent to the frontend
    },
  },
  {
    timestamps: true,
    // Virtual `id` field is already added by mongoose — no need for a separate numeric id
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Text index for search ─────────────────────────────────────────────────────
propertySchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Property', propertySchema);
