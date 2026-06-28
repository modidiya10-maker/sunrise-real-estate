/**
 * utils/seedAdmin.js
 *
 * Run once to create the initial admin account using credentials
 * from .env (ADMIN_USERNAME + ADMIN_PASSWORD).
 *
 * Usage:
 *   node utils/seedAdmin.js
 *
 * Safe to run multiple times — skips if the admin already exists.
 */

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

(async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌  MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB');

  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!password || password.length < 8) {
    console.error('❌  ADMIN_PASSWORD must be at least 8 characters.');
    await mongoose.disconnect();
    process.exit(1);
  }

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`ℹ️   Admin "${username}" already exists — nothing to do.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  await Admin.create({ username, passwordHash: password });
  console.log(`✅  Admin account created: ${username}`);
  console.log('    ⚠️  Delete ADMIN_USERNAME and ADMIN_PASSWORD from .env after this.');

  await mongoose.disconnect();
  process.exit(0);
})();
