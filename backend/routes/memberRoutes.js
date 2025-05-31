const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { validateMember } = require('../middleware/validation');

// Add new member
router.post('/', validateMember, memberController.addMember);

// Get all members
router.get('/', memberController.getAllMembers);

// Get member by ID
router.get('/:id', memberController.getMemberById);

// Update member
router.put('/:id', validateMember, memberController.updateMember);

// Delete member
router.delete('/:id', memberController.deleteMember);

module.exports = router; 