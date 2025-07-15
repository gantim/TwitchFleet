const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const checkInternalKey = require('../middleware/internalKey');
const auth = require('../middleware/auth');

router.post('/register', checkInternalKey, authController.register);
router.post('/login', checkInternalKey, authController.login);
router.get('/me', checkInternalKey, auth(), authController.me);

module.exports = router;