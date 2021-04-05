const express = require('express')
const router = express.Router()

// CONTROLLER
const indexController = require('../controllers/index')

// SEARCH PET
router.get('/search', indexController.searchPets);

/* GET home page. */
router.get('/', indexController.getPets);

module.exports = router
