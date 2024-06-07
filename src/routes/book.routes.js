const express = require('express')
const router = express.Router()
const books = require('../controllers/book.controller.js')
const authMiddleware = require('../middlewares/auth.middleware.js')
const checkRole = require('../middlewares/role.middleware.js')

router.post('/', authMiddleware, books.create)
router.get('/', [authMiddleware, checkRole(['admin'])], books.findAll)
router.get('/:id', authMiddleware, books.findOne)
router.put('/:id', authMiddleware, books.update)
router.delete('/:id', authMiddleware, books.delete)
router.delete('/', [authMiddleware, checkRole(['admin'])], books.deleteAll)

module.exports = router
