const express = require('express')
const router = express.Router()

// CONTROLLER
const indexController = require('../controllers/index')

/* GET home page. */
router.get('/', indexController.getPets);

module.exports = router
