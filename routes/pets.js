const express = require('express')
const router = express.Router()

// Validation
const { body } = require('express-validator')

// CONTROLLER
const petsController = require('../controllers/pets')

// MAILER
const mailer = require('../utils/mailer');

// NEW PET
router.get('/new', petsController.getNewPetForm);

// CREATE PET
router.post('/', [
    body('name', 'Please ensure you provide a valid name.')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 25 })
      .escape(),
    body('birthday', 'Please ensure you provide a valid date.')
      .not()
      .isEmpty()
      .isDate(),
    body('species', 'Please ensure you provide a valid breed name.')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 25 })
      .escape(),
    body('picUrl', 'Please provide a valid URL.')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 50 }),
    body('picUrlSq', 'Please provide a valid URL.')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 50 })
  ],
  petsController.addNewPet
);

// SHOW PET
router.get('/:id', petsController.getPetDetails);

// SHOW PET EDIT FORM
router.get('/:id/edit', petsController.getEditPetForm);

// EDIT PET
router.put('/:id', [
    body('name', 'Please ensure you provide a valid name.')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 25 })
      .escape(),
    body('birthday', 'Please ensure you provide a valid date.')
      .not()
      .isEmpty()
      .isDate(),
    body('species', 'Please ensure you provide a valid breed name.')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 25 })
      .escape(),
    body('picUrl', 'Please provide a valid URL.')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 50 }),
    body('picUrlSq', 'Please provide a valid URL.')
      .not()
      .isEmpty()
      .isLength({ min: 1, max: 50 })
  ],
  petsController.editPet
);

// PURCHASE
router.post('/:id/purchase', petsController.purchasePet);

// DELETE PET
router.delete('/:id', petsController.deletePet);

module.exports = router
