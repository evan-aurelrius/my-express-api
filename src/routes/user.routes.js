const express = require('express')
const router = express.Router()
const users = require('../controllers/user.controller.js')
const authMiddleware = require('../middlewares/auth.middleware.js')
const checkRole = require('../middlewares/role.middleware.js');

// Public routes
router.post('/register', users.register);
router.post('/login', users.login);

// Private routes
router.post('/', authMiddleware, users.create)
router.get('/', [authMiddleware, checkRole(['admin'])], users.findAll)
router.get('/:id', [authMiddleware, checkRole(['admin'])], users.findOne)
router.put('/:id/password', authMiddleware, users.updatePassword)
router.put('/:id/details', authMiddleware, users.updateUserDetails)
router.delete('/:id', [authMiddleware, checkRole(['admin'])], users.delete)
router.delete('/', [authMiddleware, checkRole(['admin'])], users.deleteAll)

module.exports = router
