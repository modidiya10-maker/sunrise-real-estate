const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protectAdmin } = require('../middleware/auth');

// Public — anyone can submit an enquiry
router.post('/', createEnquiry);

// Protected (admin only)
router.get('/', protectAdmin, getAllEnquiries);
router.patch('/:id', protectAdmin, updateEnquiry);
router.delete('/:id', protectAdmin, deleteEnquiry);

module.exports = router;
