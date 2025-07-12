const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const auth = require('../middleware/auth');

router.get('/accounts', auth('admin'), accountController.getAll);
router.get('/accounts/:id', auth('admin'), accountController.getOne);
router.post('/accounts', auth('admin'), accountController.create);
router.put('/accounts', auth('admin'), accountController.update);
router.delete('/accounts/:id', auth('admin'), accountController.delete);

module.exports = router;