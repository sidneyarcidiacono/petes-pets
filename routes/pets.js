const express = require('express')
const router = express.Router()

// CONTROLLER
const petsController = require('../controllers/pets')

// MAILER
const mailer = require('../utils/mailer');

// NEW PET
router.get('/new', petsController.getNewPetForm);

// CREATE PET
router.post('/', petsController.addNewPet);

// SHOW PET
router.get('/:id', petsController.getPetDetails);

// SHOW PET EDIT FORM
router.get('/:id/edit', petsController.getEditPetForm);

// EDIT PET
router.put('/:id', petsController.editPet);

// PURCHASE
router.post('/:id/purchase', petsController.purchasePet);

// DELETE PET
router.delete('/:id', petsController.deletePet);

module.exports = router
