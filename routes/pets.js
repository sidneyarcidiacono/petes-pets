const express = require('express')
const router = express.Router()

// Validation
const { body } = require('express-validator')

// CONTROLLER
const petsController = require('../controllers/pets')

// MAILER
const mailer = require('../utils/mailer');

// UPLOADING TO AWS S3
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// UPLOAD TO AMAZON S3
const Upload = require('s3-uploader');

const client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'pets/avatar',
    region: process.env.S3_REGION,
    acl: 'public-read',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  cleanup: {
    versions: true,
    original: true
  },
  versions: [{
    maxWidth: 400,
    aspect: '16:10',
    suffix: '-standard'
  },{
    maxWidth: 300,
    aspect: '1:1',
    suffix: '-square'
  }]
});

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
      .isLength({ min: 1, max: 50 }),
    body('price', 'Please provide a valid price')
      .not()
      .isEmpty()
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
