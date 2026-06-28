const Enquiry = require('../models/Enquiry');

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/enquiries
//  Public — submitted by site visitors
// ─────────────────────────────────────────────────────────────────────────────
exports.createEnquiry = async (req, res) => {
  const { propertyId, propertyTitle, name, phone, email, lookingFor, message, source } =
    req.body;

  if (!name || !phone) {
    return res
      .status(400)
      .json({ success: false, message: 'Name and phone are required.' });
  }

  const enquiry = await Enquiry.create({
    propertyId: propertyId || null,
    propertyTitle: propertyTitle || lookingFor || 'General',
    name,
    phone,
    email: email || '',
    lookingFor: lookingFor || 'General',
    message: message || '',
    source: source || 'Website',
  });

  res.status(201).json({ success: true, enquiry });
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/enquiries
//  Protected (admin) — supports ?status=new|read and ?search=
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllEnquiries = async (req, res) => {
  const { status, search } = req.query;
  const filter = {};

  if (status && ['new', 'read'].includes(status)) {
    filter.status = status;
  }

  if (search && search.trim()) {
    const q = search.trim();
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { propertyTitle: { $regex: q, $options: 'i' } },
      { message: { $regex: q, $options: 'i' } },
    ];
  }

  const enquiries = await Enquiry.find(filter)
    .sort({ createdAt: -1 })
    .populate('propertyId', 'title location'); // attach basic property info if available

  // Map to the shape the existing frontend render functions expect
  const mapped = enquiries.map((e) => ({
    id: e._id.toString(),
    _id: e._id.toString(),
    name: e.name,
    phone: e.phone,
    email: e.email || '—',
    prop: e.propertyTitle,   // frontend uses `prop`
    source: e.source,
    message: e.message || '—',
    status: e.status,
    time: new Date(e.createdAt).toLocaleString('en-IN'),
    createdAt: e.createdAt,
  }));

  res.json({
    success: true,
    count: mapped.length,
    newCount: mapped.filter((e) => e.status === 'new').length,
    enquiries: mapped,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
//  PATCH /api/enquiries/:id
//  Protected — mark as read / toggle status
// ─────────────────────────────────────────────────────────────────────────────
exports.updateEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    return res.status(404).json({ success: false, message: 'Enquiry not found.' });
  }

  if (req.body.status) enquiry.status = req.body.status;
  await enquiry.save();

  res.json({ success: true, enquiry });
};

// ─────────────────────────────────────────────────────────────────────────────
//  DELETE /api/enquiries/:id
//  Protected
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    return res.status(404).json({ success: false, message: 'Enquiry not found.' });
  }

  await enquiry.deleteOne();
  res.json({ success: true, message: 'Enquiry deleted.' });
};
