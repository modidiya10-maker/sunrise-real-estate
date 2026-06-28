const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Middleware: protectAdmin
 * Verifies the JWT from the Authorization header (Bearer token).
 * Attaches the admin document to req.admin on success.
 */
const protectAdmin = async (req, res, next) => {
  let token;

  // Accept token from Authorization header OR from httpOnly cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin account not found.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in again.';
    return res.status(401).json({ success: false, message });
  }
};

module.exports = { protectAdmin };
