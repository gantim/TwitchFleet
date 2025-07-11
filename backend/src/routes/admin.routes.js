const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const auth = require('../middleware/auth');

router.post('/users', auth('admin'), adminController.createUser);
router.get('/users', auth('admin'), adminController.getAllUsers);
router.get('/users/:id', auth('admin'), adminController.getUser);
router.put('/users', auth('admin'), adminController.updateUserRole);
router.delete('/users/:id', auth('admin'), adminController.deleteUser);

module.exports = router;
