const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    // Optional reference to a Property document.
    // Not required because the "Contact Form" enquiry has no specific property.
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
    },
    // Human-readable property name captured at enquiry time
    // (so the record stays meaningful even if the property is later deleted)
    propertyTitle: {
      type: String,
      default: 'General',
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    lookingFor: {
      type: String,
      default: 'General',
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      enum: ['Contact Form', 'Property Modal', 'Website', 'WhatsApp', 'Other'],
      default: 'Website',
    },
    status: {
      type: String,
      enum: ['new', 'read'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
