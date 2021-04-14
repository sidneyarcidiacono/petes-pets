// MODEL
const Pet = require('../models/pet');

// Validation
const { validationResult } = require('express-validator')

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
exports.getNewPetForm = (req, res) => {
  res.render('pets-new');
}

// CREATE PET
exports.addNewPet = async (req, res) => {
  console.log("IN CONTROLLER LINE 40")
  const errors = validationResult(req)
   if (!errors.isEmpty()) {
     console.log("IN VAL ERRORS THING")
     const error = errors.array()[0].param.replace(/([A-Z])/g, ' $1')
     const formattedError = encodeURIComponent(
       error.charAt(0).toUpperCase() + error.slice(1)
     )
     res.status(422).redirect(`/pets/new?error=${formattedError}`)
   }
  try {
    const pet = new Pet(req.body);
    console.log(`pet line 53: ${pet}`)
    await pet.save()
    console.log(`PET: ${pet}`)
    if (req.file) {
      // Upload the images
      const versions = await client.upload(req.file.path, {})
      console.log(`VERSIONS: ${versions}`)
      // Pop off the -square and -standard and just use the one URL to grab the image
      versions.forEach(async function (image) {
        const urlArray = image.url.split('-');
        urlArray.pop();
        const url = urlArray.join('-');
        pet.avatarUrl = url;
        console.log(`pet.avatarUrl: ${pet.avatarUrl}`)
        await pet.save()
      });
      res.redirect(`/pets/${pet.id}`)
    } else {
      res.redirect(`/pets/${pet.id}`)
    }
  } catch (err) {
    console.log("IN CATCH BLOCK ")
    res.status(400).send(err.message)
  }
}

// SHOW PET BY ID
exports.getPetDetails = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
    res.render('pets-show', { pet: pet });
  } catch (err) {
    res.status(404).send(err.message)
  }
}

// SHOW PET EDIT FORM
exports.getEditPetForm = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
    res.render('pets-edit', { pet: pet });
  } catch (err) {
    res.status(500).send(err.message)
  }
}

// EDIT PET
exports.editPet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body)
    res.redirect(`/pets/${pet._id}`)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

// PURCHASE
exports.purchasePet = async (req, res) => {
  console.log(req.body);
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  const stripe = require("stripe")(process.env.PRIVATE_STRIPE_API_KEY);

  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express

  // req.body.petId can become null through seeding,
  // this way we'll insure we use a non-null value
  let petId = req.body.petId || req.params.id;

  try {
    const pet = await Pet.findById(petId)
    const charge = await stripe.charges.create({
      amount: pet.price * 100,
      currency: 'usd',
      description: `Purchased ${pet.name}, ${pet.species}`,
      source: token,
    })
    // Convert the amount back to dollars for ease in displaying in the template
    const user = {
      email: req.body.stripeEmail,
      amount: charge.amount / 100,
      petName: pet.name
    };
    // Call our mail handler to manage sending emails
    mailer.sendMail(user, req, res);
    res.redirect(`/pets/${req.params.id}`)
  } catch (err) {
    console.log('Error: ' + err);
    res.redirect(`/pets/${req.params.id}`);
  }
}

// DELETE PET
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndRemove(req.params.id)
    return res.redirect('/')
  } catch (err) {
    res.status(500).send(err.message)
  }
}
