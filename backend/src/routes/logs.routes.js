const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs.controller');
const checkInternalKey = require('../middleware/internalKey');
const auth = require('../middleware/auth');

router.get('/messages', checkInternalKey, auth(['admin', 'moderator']), logsController.getMessages);
router.get('/connections', checkInternalKey, auth(['admin', 'moderator']), logsController.getConnections);
router.get('/messages/:id', checkInternalKey, auth(['admin', 'moderator']), logsController.getMessagesById);
router.get('/connections/:id', checkInternalKey, auth(['admin', 'moderator']), logsController.getConnectionsById);

module.exports = router;
