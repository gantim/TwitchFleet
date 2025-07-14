const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const checkInternalKey = require('../middleware/internalKey');
const auth = require('../middleware/auth');

router.get('/', checkInternalKey, auth(['admin', 'moderator']), accountController.getAllAccounts);
router.get('/:id', checkInternalKey, auth(['admin', 'moderator']), accountController.getAccount);
router.post('/', checkInternalKey, auth(['admin', 'moderator']), accountController.createAccount);
router.put('/', checkInternalKey, auth(['admin', 'moderator']), accountController.updateAccount);
router.delete('/:id', checkInternalKey, auth(['admin', 'moderator']), accountController.deleteAccount);
router.post('/connect/:id', checkInternalKey, auth(['admin', 'moderator']), accountController.connectAccount);
router.post('/disconnect/:id', checkInternalKey, auth(['admin', 'moderator']), accountController.disconnectAccount);
router.post('/message/:id', checkInternalKey, auth(['admin', 'moderator']), accountController.messageAccount);

module.exports = router;