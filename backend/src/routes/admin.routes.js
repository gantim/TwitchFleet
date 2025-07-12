const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');

router.get('/users', auth('admin'), adminController.getAllUsers);
router.get('/users/:id', auth('admin'), adminController.getUser);
router.post('/users', auth('admin'), adminController.createUser);
router.put('/users', auth('admin'), adminController.updateUserRole);
router.delete('/users/:id', auth('admin'), adminController.deleteUser);

module.exports = router;
