const Property = require('../models/Property');
const { deleteFromCloudinary } = require('../services/cloudinary');

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/properties
//  Public — returns all properties, supports ?category= and ?search=
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllProperties = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category && category !== 'all') {
    filter.category = category;
  }

  if (search && search.trim()) {
    filter.$text = { $search: search.trim() };
  }

  const properties = await Property.find(filter).sort({ createdAt: -1 });

  // Map to the shape the existing frontend expects
  const mapped = properties.map(toFrontendShape);

  res.json({ success: true, count: mapped.length, properties: mapped });
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/properties/:id
//  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found.' });
  }
  res.json({ success: true, property: toFrontendShape(property) });
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/properties
//  Protected (admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.createProperty = async (req, res) => {
  const data = sanitiseBody(req.body);
  const property = await Property.create(data);
  res.status(201).json({ success: true, property: toFrontendShape(property) });
};

// ─────────────────────────────────────────────────────────────────────────────
//  PUT /api/properties/:id
//  Protected (admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.updateProperty = async (req, res) => {
  let property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found.' });
  }

  const data = sanitiseBody(req.body);
  property = await Property.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, property: toFrontendShape(property) });
};

// ─────────────────────────────────────────────────────────────────────────────
//  DELETE /api/properties/:id
//  Protected (admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id).select('+imagePublicIds');
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found.' });
  }

  // Delete all images from Cloudinary before removing the document
  if (property.imagePublicIds && property.imagePublicIds.length) {
    await deleteFromCloudinary(property.imagePublicIds);
  }

  await property.deleteOne();
  res.json({ success: true, message: 'Property deleted successfully.' });
};

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps a Mongoose Property document to the flat object shape the
 * existing frontend JavaScript expects (id, loc, cat, beds, baths, etc.)
 */
function toFrontendShape(p) {
  return {
    // MongoDB _id becomes the `id` the frontend uses
    id: p._id.toString(),
    _id: p._id.toString(),
    title: p.title,
    price: p.price,
    loc: p.location,       // frontend uses `loc`
    type: p.type,
    cat: p.category,       // frontend uses `cat`
    area: p.area,
    beds: p.bedrooms,      // frontend uses `beds`
    baths: p.bathrooms,    // frontend uses `baths`
    desc: p.description,   // frontend uses `desc`
    avail: p.availability,
    availDate: p.availableFrom,
    furniture: p.furniture,
    imgs: p.images,
    img: p.images[0] || '', // convenience: first image
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

/**
 * Converts frontend field names to the model field names.
 * Also strips any keys that should not be settable directly.
 */
function sanitiseBody(body) {
  const {
    title, price,
    // Accept both naming conventions from frontend
    location, loc,
    type, category, cat,
    area,
    bedrooms, beds,
    bathrooms, baths,
    description, desc,
    availability, avail,
    availableFrom, availDate,
    furniture,
    images, imgs,
    imagePublicIds,
  } = body;

  const cleaned = {};
  if (title !== undefined) cleaned.title = title;
  if (price !== undefined) cleaned.price = price;
  if (location || loc) cleaned.location = location || loc;
  if (category || cat) cleaned.category = (category || cat);
  if (type !== undefined) cleaned.type = type;
  if (area !== undefined) cleaned.area = area;
  if (bedrooms !== undefined || beds !== undefined)
    cleaned.bedrooms = Number(bedrooms ?? beds ?? 0);
  if (bathrooms !== undefined || baths !== undefined)
    cleaned.bathrooms = Number(bathrooms ?? baths ?? 0);
  if (description !== undefined || desc !== undefined)
    cleaned.description = description ?? desc ?? '';
  if (availability !== undefined || avail !== undefined)
    cleaned.availability = availability ?? avail;
  if (availableFrom !== undefined || availDate !== undefined)
    cleaned.availableFrom = availableFrom ?? availDate ?? '';
  if (furniture !== undefined) cleaned.furniture = furniture;
  if (images || imgs) cleaned.images = images ?? imgs ?? [];
  if (imagePublicIds) cleaned.imagePublicIds = imagePublicIds;

  return cleaned;
}
