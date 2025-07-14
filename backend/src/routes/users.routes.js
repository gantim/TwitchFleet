const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkInternalKey = require('../middleware/internalKey');
const auth = require('../middleware/auth');

router.get('/', checkInternalKey, auth(['admin']), userController.getAllUsers);
router.post('/', checkInternalKey, auth(['admin']), userController.createUser);
router.put('/', checkInternalKey, auth(['admin']), userController.updateUser);
router.delete('/:id', checkInternalKey, auth(['admin']), userController.deleteUser);

router.get('/all', checkInternalKey, auth(['admin']), userController.getAllBindings);
router.get('/:id/accounts', checkInternalKey, auth(['admin', 'moderator']), userController.getAccountsByUserId);

router.post('/add', checkInternalKey, auth(['admin']), userController.addSingle);
router.post('/add-multiple', checkInternalKey, auth(['admin']), userController.addMultiple);

router.post('/unbind', checkInternalKey, auth(['admin']), userController.unbindAccount);
router.post('/unbind-multiple', checkInternalKey, auth(['admin']), userController.unbindMultiple);
router.post('/unbind-user', checkInternalKey, auth(['admin']), userController.unbindAllFromUser);
router.post('/unbind-account', checkInternalKey, auth(['admin']), userController.unbindAllFromAccount);

router.get('/:id', checkInternalKey, auth(['admin']), userController.getUser);

module.exports = router;
