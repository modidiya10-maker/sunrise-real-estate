const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// ── Helper: sign JWT ──────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ── Helper: send token response ───────────────────────────────────────────────
const sendTokenResponse = (admin, statusCode, res) => {
  const token = signToken(admin._id);

  // Also set an httpOnly cookie for browser clients (optional — frontend can
  // use Bearer header instead, but cookie makes it trivially easy)
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Username and password are required.' });
  }

  // passwordHash is excluded by default (select: false), so we explicitly select it
  const admin = await Admin.findOne({ username: username.toLowerCase().trim() }).select(
    '+passwordHash'
  );

  if (!admin || !(await admin.comparePassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid username or password.' });
  }

  sendTokenResponse(admin, 200, res);
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/logout
// ─────────────────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res
    .cookie('token', '', {
      expires: new Date(0), // expire immediately
      httpOnly: true,
    })
    .json({ success: true, message: 'Logged out successfully.' });
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/auth/me
// ─────────────────────────────────────────────────────────────────────────────
exports.getMe = (req, res) => {
  // req.admin is attached by the protectAdmin middleware
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      role: req.admin.role,
      createdAt: req.admin.createdAt,
    },
  });
};
