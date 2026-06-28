const express = require('express');
const router = express.Router();
const { uploadImages, deleteImage } = require('../controllers/uploadController');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Both endpoints are admin-only
router.post('/', protectAdmin, upload.array('images', 20), uploadImages);
router.delete('/', protectAdmin, deleteImage);

module.exports = router;
