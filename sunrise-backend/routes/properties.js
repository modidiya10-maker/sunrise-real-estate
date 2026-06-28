const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protectAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected (admin only)
router.post('/', protectAdmin, createProperty);
router.put('/:id', protectAdmin, updateProperty);
router.delete('/:id', protectAdmin, deleteProperty);

module.exports = router;
